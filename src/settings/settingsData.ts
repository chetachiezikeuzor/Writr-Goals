export const WRITR_GOALS_VIEW_SIDE = ["right", "left"];

export interface WritrGoalsSettings {
	mySetting: string;
	writrGoalsViewPosition: string;
}

const DEFAULT_SETTINGS: WritrGoalsSettings = {
	mySetting: "default",
	writrGoalsViewPosition: "left",
};

export default DEFAULT_SETTINGS;
