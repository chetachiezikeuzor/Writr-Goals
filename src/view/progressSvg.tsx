import * as React from "react";
import { setAttributes } from "src/utils/setAttributes";

export default function ProgressSvg(overallPercentage: any) {
	let progressSvgEl = document.createElement("svg");
	let progressInnerEl = document.createElement("svg");
	let progressText = document.createElement("text");
	let progressTrack = document.createElement("path");
	let progressFill = document.createElement("path");
	let percent: any = (overallPercentage * 100).toFixed(1);
	let max = -229.99078369140625;

	let strokeVal = (40.64 * 100) / 200;
	setAttributes(progressInnerEl, {
		class: "progress accent noselect",
		"data-progress": `${Math.round((overallPercentage * 100) / 10)}`,
		x: "0px",
		y: "0px",
		viewBox: "0 0 80 80",
	});
	setAttributes(progressTrack, {
		class: "track",
		d: "M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0",
	});
	setAttributes(progressFill, {
		class: "fill",
		d: "M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0",
		style: `stroke-dashoffset: ${
			((100 - percent) / 100) * max
		}; stroke-dasharray: ${40.64 * strokeVal + " 999"}`,
	});
	setAttributes(progressText, {
		class: "value",
		x: "50%",
		y: "57%",
	});
	progressText.innerHTML = `${percent >= 0 ? percent : `--`}%`;
	progressInnerEl.appendChild(progressTrack);
	progressInnerEl.appendChild(progressFill);
	progressInnerEl.appendChild(progressText);
	progressSvgEl.appendChild(progressInnerEl);

	return (
		<>
			<svg
				className="progress accent noselect"
				data-progress={Math.round((overallPercentage * 100) / 10)}
				x="0px"
				y="0px"
				viewBox="0 0 80 80"
			>
				<path
					className="track"
					d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0"
				></path>
				<path
					className="fill"
					d="M5,40a35,35 0 1,0 70,0a35,35 0 1,0 -70,0"
					style={{
						strokeDashoffset: `${((100 - percent) / 100) * max}`,
						strokeDasharray: `${40.64 * strokeVal + " 999"}`,
					}}
				></path>
				<text className="value" x="50%" y="57%">
					{percent >= 0 ? percent : `--`}%
				</text>
			</svg>
		</>
	);
}
