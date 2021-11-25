import type WritrGoalsPlugin from "../plugin/main";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { PluginContext } from "./context";
import { debounce } from "src/utils/debounce";
import { WritrGoalsSettings } from "../settings/settingsData";
import { CreateBoard } from "./createBoard";
import { StatusBoard } from "./statusBoard";
import NewBoard from "./newBoard";

import {
	App,
	Notice,
	ItemView,
	WorkspaceLeaf,
	ButtonComponent,
} from "obsidian";

export const WritrGoalsViewType = "writr-goals-view-container";

export class WritrGoalsView extends ItemView {
	app: App;
	plugin: WritrGoalsPlugin;
	settings: WritrGoalsSettings;
	private reactComponent: React.ReactElement;

	constructor(
		app: App,
		leaf: WorkspaceLeaf,
		plugin: WritrGoalsPlugin,
		settings: WritrGoalsSettings
	) {
		super(leaf);
		this.plugin = plugin;
		this.app = app;
		this.settings = settings;
		this.redraw = this.redraw.bind(this);
		this.redrawDebounced = this.redrawDebounced.bind(this);
		this.containerEl = this.containerEl;
		this.registerEvent(
			//@ts-ignore
			this.app.workspace.on("layout-ready", this.redrawDebounced)
		);
		this.registerEvent(
			this.app.workspace.on("file-open", this.redrawDebounced)
		);
		this.registerEvent(
			this.app.workspace.on("quick-preview", this.redrawDebounced)
		);
		this.registerEvent(this.app.vault.on("delete", this.redraw));
	}

	getViewType(): string {
		return WritrGoalsViewType;
	}

	getDisplayText(): string {
		return "Writr Goals";
	}

	getIcon(): string {
		return "wg-pie-chart-alt";
	}

	load(): void {
		super.load();
	}

	async onOpen(): Promise<void> {
		this.redraw();
	}

	redrawDebounced = debounce(function () {
		this.redraw();
	}, 100);

	async redraw() {
		this.reactComponent = React.createElement(StatusBoard);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		ReactDOM.render(this.reactComponent, (this as any).contentEl);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
