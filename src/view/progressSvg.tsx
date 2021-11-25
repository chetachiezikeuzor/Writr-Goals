import * as React from "react";
import { setAttributes } from "src/utils/setAttributes";

export default function ProgressSvg(overallPercentage: any) {
	let percent: any = (overallPercentage * 100).toFixed(1);
	let max = -229.99078369140625;

	let strokeVal = (40.64 * 100) / 200;

	return (
		<>
			<svg
				className="progress accent noselect"
				data-progress={
					overallPercentage
						? Math.round((overallPercentage * 100) / 10)
						: 0
				}
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
