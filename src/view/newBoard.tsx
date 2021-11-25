import { useState, useEffect, Component } from "react";
import * as React from "react";
import WritrGoalsPlugin from "../plugin/main";
import { App, Debouncer, TFile, MarkdownView } from "obsidian";
import { getWordCount } from "src/utils/getCounts";

export function getActiveFile(): void {
	return this.app.workspace.activeLeaf.view.file;
}

export function readFile(filePath: any): void {
	return this.app.vault.read(filePath);
}

export function readMetaCache(filePath: any): void {
	return this.app.metadataCache.getFileCache(filePath);
}

class NewBoard extends Component<any, any> {
	plugin: WritrGoalsPlugin;
	appendMethod: string;
	debouncedUpdate: Debouncer<[contents: string, filepath: string]>;

	constructor(app: App, plugin: WritrGoalsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		var date = this.getTimeString();
		let date_now = new Date();
		this.state = {
			time: date,
			seconds: this.getTimeSeconds(),
			minutes: this.getTimeMinutes(),
			hours: this.getTimeHours(),
			middayVal: "AM",
			days: "",
			file: this.getFile(),
			path: this.getPath(),
			fileContent: this.getFileContent(),
			fileCache: this.getFileCache(),
			fileFrontMatter: this.getFrontMatter(),
		};
	}

	getFile() {
		//@ts-ignore
		let file = getActiveFile().basename;
		return file;
	}

	getPath() {
		//@ts-ignore
		let path = getActiveFile().path;
		console.log(path);
		return path;
	}

	getFileContent() {
		//@ts-ignore
		return readFile(getActiveFile().path);
	}
	getFileCache() {
		//@ts-ignore
		return readMetaCache(this.getPath());
	}

	getFrontMatter() {
		//@ts-ignore
		return readMetaCache(this.getPath()).frontmatter;
	}

	getTimeString() {
		const date = new Date(Date.now()).toLocaleTimeString();
		return date;
	}
	getTimeSeconds() {
		const seconds = new Date(Date.now()).getSeconds();
		return seconds;
	}
	getTimeMinutes() {
		const minutes = new Date(Date.now()).getMinutes();
		return minutes;
	}
	getTimeHours() {
		const hours = new Date(Date.now()).getHours();
		return hours;
	}
	getTimeDay() {
		const hours = new Date(Date.now()).getDay();
		return hours;
	}
	componentDidMount() {
		const _this = this;
		this.setState({ path: this.getPath() });
		//@ts-ignore
		this.timer = setInterval(function () {
			var date = _this.getTimeString();
			let seconds = _this.getTimeSeconds();
			let minutes = _this.getTimeMinutes();
			let hours = _this.getTimeHours();
			let days = _this.getTimeDay();
			let file = _this.getFile();

			let middayVal = hours >= 12 ? "PM" : "AM";

			let daysOfTheWeek = [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
			];

			if (hours == 0) {
				hours = 12;
			} else if (hours > 12) {
				hours -= 12;
			}

			hours = hours < 10 ? 0 + hours : hours;
			minutes = minutes < 10 ? 0 + minutes : minutes;
			seconds = seconds < 10 ? 0 + seconds : seconds;

			_this.setState({
				time: date,
				seconds: seconds,
				minutes: minutes,
				hours: hours,
				middayVal: middayVal,
				days: daysOfTheWeek[days],
				file: file,
			});
		}, 1000);
	}

	componentWillUnmount() {
		//@ts-ignore
		clearInterval(this.timer);
		this.setState({ path: this.getPath() });
	}

	render() {
		const {
			seconds,
			minutes,
			hours,
			middayVal,
			days,
			file,
			path,
			fileFrontMatter,
		} = this.state;
		return (
			<div className="ui-clock">
				<h1>{file}</h1>
				<div className="progress-content-div">
					<span className="progress-list-item">
						<h5 className="file-title">
							Writing Goals Status Board
						</h5>
					</span>
					<span className="progress-list-item file-description">
						{fileFrontMatter}
					</span>
				</div>
				<div id="day">{days}</div>
				<div className="wrapper">
					<div id="time">{hours + ":" + minutes + ":" + seconds}</div>
					<div id="midday">{middayVal}</div>
				</div>
			</div>
		);
	}
}

export default NewBoard;
