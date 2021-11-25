import * as React from "react";
import useInterval, { usePlugin } from "./hooks";
import { App } from "obsidian";
import WritrGoalsPlugin from "src/plugin/main";
import {
	getCharacterCount,
	getSentenceCount,
	getWordCount,
} from "src/utils/getCounts";
import ProgressSvg from "./progressSvg";
import { setAttributes } from "src/utils/setAttributes";
import { removeMarkdown, removeFootnotes } from "src/utils/removeSyntax";

export function getActiveFile(): void {
	return this.app.workspace.activeLeaf.view.file;
}

export function readFile(filePath: any): void {
	return this.app.vault.read(filePath);
}

export function readMetaCache(filePath: any): void {
	return this.app.metadataCache.getFileCache(filePath);
}

export function CreateBoard() {
	const plugin = usePlugin();

	this.state({
		file: this.getFile(),
		path: this.getPath(),
		fileContent: this.getFileContent(),
		fileCache: this.getFileCache(),
		fileFrontMatter: this.getFrontMatter(),
	});

	useInterval(() => {
		//@ts-ignore
		let setFile = this.app.workspace.activeLeaf.view.file;
		//console.log(setFile);
		let setCurrentPage = setFile ? setFile.path : "";
		let setFileContent = this.app.vault.read(setFile);
		const setFileCache = this.app.metadataCache.getFileCache(setFile);
		let setFileFrontMatter = setFileCache.frontmatter;

		let setWordTarget = setFileFrontMatter.wordTarget;
		let setCharTarget = setFileFrontMatter.charTarget;
		let setSentenceTarget = setFileFrontMatter.sentenceTarget;

		let setWordsToRemove = setFileFrontMatter.wordsToRemove;
		let setCharsToRemove = setFileFrontMatter.charsToRemove;
		let setSentencesToRemove = setFileFrontMatter.sentencesToRemove;

		let setCharactersIncludeSpaces =
			setFileFrontMatter.charactersIncludeSpaces;
		let setIncludeFootnotes = setFileFrontMatter.includeFootnotes;
		let setExcludeComments = setFileFrontMatter.excludeComments;
		let setFileStatus = setFileFrontMatter.status;
		let setWordsPerMinute = setFileFrontMatter.wordsPerMinute;
		let setShowWritingGoals = setFileFrontMatter.showWritingGoals;

		let setFileDecription = setFileFrontMatter.description;
		let setPageTitle = setCurrentPage.name;

		let setText = setFile ? setFile.unsafeCachedData : null;
		setText = setText.replace(/(^\\s\*)|(\\s\*$)/gi, "");
		setText = setText.replace(/\[ \]{2,}/gi, " ");
		setText = setText.replace(/\\n /, "\\n");

		setText = removeMarkdown(setText, true);
		if (!setIncludeFootnotes) setText = removeFootnotes(setText);

		let setWordCount = getWordCount(setText) - setWordsToRemove;
		let setCharCount = getCharacterCount(setText, true) - setCharsToRemove;
		let setSentenceCount = getSentenceCount(setText) - setSentencesToRemove;

		let setWordCountPercentage = setWordTarget
			? setWordCount / setWordTarget
			: 0;
		let setCharacterCountPercentage = setCharTarget
			? setCharCount / setCharTarget
			: 0;
		let setSentenceCountPercentage = setSentenceTarget
			? setSentenceCount / setSentenceTarget
			: 0;
	}, 1000);

	const [pageTitle, setPageTitle] = React.useState(null);
	const [fileDecription, setFileDecription] = React.useState(null);

	const [wordTarget, setWordTarget] = React.useState(null);
	const [charTarget, setCharTarget] = React.useState(null);
	const [sentenceTarget, setSentenceTarget] = React.useState(null);

	const [wordCount, setWordCount] = React.useState(null);
	const [characterCount, setCharCount] = React.useState(null);
	const [sentenceCount, setSentenceCount] = React.useState(null);

	const [wordsPerMin, setWordsPerMinute] = React.useState(null);

	const [wordCountPercentage, setWordCountPercentage] = React.useState(null);
	const [characterCountPercentage, setCharacterCountPercentage] =
		React.useState(null);
	const [sentenceCountPercentage, setSentenceCountPercentage] =
		React.useState(null);

	const [includeFootnotes, setIncludeFootnotes] = React.useState(null);
	const [charactersIncludeSpaces, setCharactersIncludeSpaces] =
		React.useState(null);
	const [excludeComments, setExcludeComments] = React.useState(null);

	const [textContent, setText] = React.useState(null);

	function toPercentStr(percentage: any) {
		return (percentage * 100).toFixed(1).toString() + "%";
	}

	// - Create Settings Info
	let setting_ft = "Footnotes excluded. ";
	let setting_charSpaces = "Character Count includes Spaces. ";
	let setting_comments = "Comments included. ";

	if (includeFootnotes) setting_ft = "Footnotes included. ";
	if (!charactersIncludeSpaces)
		setting_charSpaces = "Character Count without Spaces. ";
	if (excludeComments) setting_comments = "Comments excluded. ";

	function createSettings() {
		return `<hr/><small><strong>Settings:</strong> ${setting_ft} ${setting_comments} ${setting_charSpaces}</small>`;
	}

	let numStats =
		(wordTarget > 0 ? 1 : 0) +
		(charTarget > 0 ? 1 : 0) +
		(sentenceTarget > 0 ? 1 : 0);

	let overallPercentage =
		(wordCountPercentage +
			characterCountPercentage +
			sentenceCountPercentage) /
		numStats;

	function getStat(percentage: any) {
		return percentage >= 1
			? `🥳 Target has been reached`
			: percentage >= 0.8
			? `📄 Almost there`
			: percentage >= 0.6
			? `✍🏽 Keep going`
			: percentage >= 0.4
			? `✏️ Making progress`
			: percentage >= 0.2
			? `🙏🏽 Let's do this!`
			: percentage >= 0.05
			? `😪 Just getting started`
			: `🔴 No Progress Yet`;
	}

	let wordsPerMinute = setWordsPerMinute ? setWordsPerMinute : 250; // Average case.
	let result;
	let textLength = wordCount; // Split by words
	if (textLength > 0) {
		let value = Math.ceil(textLength / wordsPerMin);
		result = `<i style="font-weight: 900; color: var(--interactive-accent);">~</i> ${value} min read`;
	} else {
		result = "--";
	}

	return (
		<div
			id="writr-goals-status-board"
			className="writr-goals-status-board count-div pattern-2"
		>
			<div className="progress-wrapper">
				<span className="progress-item-title">INFO</span>
				<div className="progress-content-div">
					<span className="progress-list-item">
						<h5 className="file-title">{pageTitle && pageTitle}</h5>
					</span>
					$
					{fileDecription
						? `<span class="progress-list-item file-description">${fileDecription}</span>`
						: ""}
				</div>
				<hr />
				<span className="progress-item-title">OVERALL</span>
				<div className="progress-content-div center-text">
					{ProgressSvg(overallPercentage)}
					<small className="progress-list-item small-width">
						$
						{(wordTarget && wordCount) ||
						(characterCount && charTarget) ||
						(sentenceCount && sentenceTarget)
							? `Calculating: `
							: ``}
						${wordTarget && wordCount ? `word count` : ""} $
						{characterCount && charTarget ? `character count` : ""}{" "}
						$
						{sentenceCount && sentenceTarget
							? `sentence count`
							: ""}
					</small>
					${result}
				</div>
				<span className="progress-item-title">PROGRESS</span>
				<div className="progress-content-div">
					$
					{wordTarget
						? `<span class="progress-list-item">${wordCount} / ${wordTarget} words<span class="progress-stat"><progress value=${
								(wordCount / wordTarget >= 1
									? 1
									: wordCount / wordTarget) * 100
						  } max="100"></progress>${toPercentStr(
								wordCountPercentage
						  )}</span></span>`
						: ""}
					$
					{charTarget
						? `<span class="progress-list-item">${characterCount} / ${charTarget} characters<span class="progress-stat"><progress value=${
								(characterCount / charTarget >= 1
									? 1
									: characterCount / charTarget) * 100
						  } max="100"></progress>${toPercentStr(
								characterCountPercentage
						  )}</span></span>`
						: ""}
					$
					{sentenceTarget
						? `<span class="progress-list-item">${sentenceCount} / ${sentenceTarget} sentence(s)<span class="progress-stat"><progress value=${
								(sentenceCount / sentenceTarget >= 1
									? 1
									: sentenceCount / sentenceTarget) * 100
						  } max="100"></progress> ${toPercentStr(
								sentenceCountPercentage
						  )}</span></span>`
						: ""}
					<div className="progress-content-item center-text">
						${getStat(overallPercentage)}
					</div>
				</div>
				<span className="progress-item-title">GOALS</span>
				<div className="progress-content-div">
					{wordTarget
						? `<span class="progress-list-item">Word Count Goal: ${wordTarget} words</span>`
						: ""}
					$
					{charTarget
						? `<span class="progress-list-item">Char Count Goal: ${charTarget} characters</span>`
						: ""}
					$
					{sentenceTarget
						? `<span class="progress-list-item">Sentence Count Goal: ${sentenceTarget} sentences</span>`
						: ""}
				</div>
				${createSettings()}
			</div>
		</div>
	);
}
