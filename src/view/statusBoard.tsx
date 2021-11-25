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
import { toPercentStr } from "src/utils/getCounts";
import { getStat } from "src/utils/getCounts";

export function StatusBoard() {
	const plugin = usePlugin();

	let setFile = this.app.workspace.activeLeaf.view.file;
	let setCurrentPage = setFile ? setFile.path : "";
	let setFileContent = this.app.vault.read(setFile);
	let setFileCache = this.app.metadataCache.getFileCache(setFile);
	let setFileFrontMatter = setFileCache.frontmatter;

	let setWordTarget = setFileFrontMatter.wordTarget;
	let setCharTarget = setFileFrontMatter.charTarget;
	let setSentenceTarget = setFileFrontMatter.sentenceTarget;

	let setWordsToRemove = setFileFrontMatter.wordsToRemove;
	let setCharsToRemove = setFileFrontMatter.charsToRemove;
	let setSentencesToRemove = setFileFrontMatter.sentencesToRemove;

	let setCharactersIncludeSpaces = setFileFrontMatter.charactersIncludeSpaces;
	let setIncludeFootnotes = setFileFrontMatter.includeFootnotes;
	let setExcludeComments = setFileFrontMatter.excludeComments;
	let setFileStatus = setFileFrontMatter.status;
	let setWordsPerMinute = setFileFrontMatter.wordsPerMinute;
	let setShowWritingGoals = setFileFrontMatter.showWritingGoals;

	let setFileDecription = setFileFrontMatter.description;
	let setPageTitle = setFile.basename;

	let setText = setFile ? setFile.unsafeCachedData : null;
	setText = setText.replace(/(^\\s\*)|(\\s\*$)/gi, "");
	setText = setText.replace(/\[ \]{2,}/gi, " ");
	setText = setText.replace(/\\n /, "\\n");

	setText = removeMarkdown(setText, setExcludeComments);
	if (!setIncludeFootnotes) setText = removeFootnotes(setText);

	let setWordCount = getWordCount(setText) - setWordsToRemove;
	let setCharCount =
		getCharacterCount(setText, setCharactersIncludeSpaces) -
		setCharsToRemove;
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

	// - Create Settings Info
	let setting_ft = "Footnotes excluded. ";
	let setting_charSpaces = "Character Count includes Spaces. ";
	let setting_comments = "Comments included. ";

	if (setIncludeFootnotes) setting_ft = "Footnotes included. ";
	if (!setCharactersIncludeSpaces)
		setting_charSpaces = "Character Count without Spaces. ";
	if (setExcludeComments) setting_comments = "Comments excluded. ";

	function createSettings() {
		return (
			<>
				<hr />
				<small>
					<strong>Settings:</strong> {setting_ft} {setting_comments}{" "}
					{setting_charSpaces}
				</small>
			</>
		);
	}

	let numStats =
		(setWordTarget > 0 ? 1 : 0) +
		(setCharTarget > 0 ? 1 : 0) +
		(setSentenceTarget > 0 ? 1 : 0);

	let overallPercentage =
		(setWordCountPercentage +
			setCharacterCountPercentage +
			setSentenceCountPercentage) /
		numStats;

	let wordsPerMinute = setWordsPerMinute ? setWordsPerMinute : 250; // Average case.
	let result;
	let textLength = setWordCount; // Split by words
	if (textLength > 0) {
		let value = Math.ceil(textLength / wordsPerMinute);
		result = (
			<>
				<i
					style={{
						fontWeight: "900",
						color: "var(--interactive-accent)",
					}}
				>
					~
				</i>{" "}
				{value} min read{" "}
			</>
		);
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
						<h5 className="file-title">{setPageTitle}</h5>
					</span>

					{setFileDecription ? (
						<span className="progress-list-item file-description">
							{setFileDecription}
						</span>
					) : (
						""
					)}
				</div>
				<hr />
				<span className="progress-item-title">OVERALL</span>
				<div className="progress-content-div center-text">
					{ProgressSvg(overallPercentage)}
					<small className="progress-list-item small-width">
						{(setWordTarget && setWordCount) ||
						(setCharCount && setCharTarget) ||
						(setSentenceCount && setSentenceTarget)
							? `Calculating: `
							: ``}
						{setWordTarget && setWordCount ? `word count` : ""}{" "}
						{setCharCount && setCharTarget ? `character count` : ""}{" "}
						{setSentenceCount && setSentenceTarget
							? `sentence count`
							: ""}
					</small>
					{result}
				</div>
				<span className="progress-item-title">PROGRESS</span>
				<div className="progress-content-div">
					{setWordTarget ? (
						<span className="progress-list-item">
							{setWordCount} / {setWordTarget} words
							<span className="progress-stat">
								<progress
									value={
										(setWordCount / setWordTarget >= 1
											? 1
											: setWordCount / setWordTarget) *
										100
									}
									max="100"
								></progress>
								{toPercentStr(setWordCountPercentage)}
							</span>
						</span>
					) : (
						""
					)}

					{setCharTarget ? (
						<span className="progress-list-item">
							{setCharCount} / {setCharTarget} characters
							<span className="progress-stat">
								<progress
									value={
										(setCharCount / setCharTarget >= 1
											? 1
											: setCharCount / setCharTarget) *
										100
									}
									max="100"
								></progress>
								{toPercentStr(setCharacterCountPercentage)}
							</span>
						</span>
					) : (
						""
					)}

					{setSentenceTarget ? (
						<span className="progress-list-item">
							{setSentenceCount} / {setSentenceTarget} sentence(s)
							<span className="progress-stat">
								<progress
									value={
										(setSentenceCount / setSentenceTarget >=
										1
											? 1
											: setSentenceCount /
											  setSentenceTarget) * 100
									}
									max="100"
								></progress>
								{toPercentStr(setSentenceCountPercentage)}
							</span>
						</span>
					) : (
						""
					)}
					<div className="progress-content-item center-text">
						{getStat(overallPercentage)}
					</div>
				</div>
				<span className="progress-item-title">GOALS</span>
				<div className="progress-content-div">
					{setWordTarget ? (
						<span className="progress-list-item">
							Word Count Goal: {setWordTarget} words
						</span>
					) : (
						""
					)}

					{setCharTarget ? (
						<span className="progress-list-item">
							Char Count Goal: {setCharTarget} characters
						</span>
					) : (
						""
					)}

					{setSentenceTarget ? (
						<span className="progress-list-item">
							Sentence Count Goal: {setSentenceTarget} sentences
						</span>
					) : (
						""
					)}
				</div>
				{createSettings()}
			</div>
		</div>
	);
}
