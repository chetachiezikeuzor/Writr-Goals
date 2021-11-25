import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	TFile,
	Plugin,
	WorkspaceLeaf,
	PluginSettingTab,
	Setting,
	normalizePath,
} from "obsidian";

import { WritrGoalsSettingsTab } from "../settings/settingsTab";
import { WritrGoalsSettings } from "../settings/settingsData";
import DEFAULT_SETTINGS from "../settings/settingsData";
import { WritrGoalsViewType } from "src/view/statusView";
import { WritrGoalsView } from "src/view/statusView";
import { WRITR_GOALS_VIEW_SIDE } from "../settings/settingsData";
import addIcons from "src/icons/customIcons";

export default class WritrGoalsPlugin extends Plugin {
	settings: WritrGoalsSettings;

	async onload() {
		addIcons();
		console.log("Writr Goals v" + this.manifest.version + " loaded");
		await this.loadSettings();

		this.registerView(
			WritrGoalsViewType,
			(leaf: WorkspaceLeaf) =>
				new WritrGoalsView(this.app, leaf, this, this.settings)
		);

		this.addCommand({
			id: "open-writr-goals-status-view",
			name: "Open status board",
			icon: "wg-pie-chart-alt",
			callback: async () => {
				if (
					this.app.workspace.getLeavesOfType(WritrGoalsViewType)
						.length == 0
				) {
					if (this.settings.writrGoalsViewPosition == "left") {
						await this.app.workspace
							.getLeftLeaf(false)
							.setViewState({
								type: WritrGoalsViewType,
							});
					} else {
						await this.app.workspace
							.getRightLeaf(false)
							.setViewState({
								type: WritrGoalsViewType,
							});
					}
				}
				this.app.workspace.revealLeaf(
					this.app.workspace
						.getLeavesOfType(WritrGoalsViewType)
						.first()
				);
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WritrGoalsSettingsTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	getFile() {
		if (this.app.workspace.activeLeaf)
			return (
				//@ts-ignore
				this.app.workspace.activeLeaf.view.file
			);
	}

	onunload() {
		console.log("Writr Goals unloaded");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
