import { useState, useEffect, Component } from "react";
import * as React from "react";
import WritrGoalsPlugin from "../plugin/main";
import { App } from "obsidian";

export function getActiveFile(): void {
	return this.app.workspace.activeLeaf.view.file.basename;
}
