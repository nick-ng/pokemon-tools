import type { SvItemPrinterTarget } from "../../schemas";

import { useEffect, useState, useRef } from "react";
import { useOptions } from "../../hooks/options-context";
import { getTimerData } from "./utils";

type ChosenTargetProps = {
	chosenTarget: SvItemPrinterTarget;
};

export default function ChosenTarget({ chosenTarget }: ChosenTargetProps) {
	const { options } = useOptions();
	const [timerRunning, setTimerRunning] = useState(false);
	const startButtonRef = useRef<HTMLButtonElement | null>(null);

	const timerData = getTimerData(chosenTarget.timestamp, options.svItemPrinterMinSeconds);
	const totalDelaySeconds = timerData.delaySeconds - options.svItemPrinterAdjustSeconds;
	const barBMaxSeconds = 5;
	const barASeconds = totalDelaySeconds - barBMaxSeconds;
	const barBSeconds = Math.min(barBMaxSeconds, totalDelaySeconds);

	useEffect(() => {
		setTimeout(() => {
			if (startButtonRef.current) {
				startButtonRef.current.focus();
			}
		}, 0);
	}, []);
	return (
		<>
			<details>
				<summary>Instructions</summary>
				<ol className="ml-5 mb-1 list-outside list-decimal">
					<li>
						Talk to the item printer NPC until you get the menu that has "I want to print
						something!"
					</li>
					<li>
						Press the Home button (do not close Pokemon Scarlet/Violet), go to the Switch settings,
						and adjust the date and time. It doesn't matter what timezone you've selected.
					</li>
					<li>
						Press "A" to set the time and click the "Start Timer" below at the same time. You can
						press the space bar instead of clicking if that's easier.
					</li>
					<li>
						Go back to Pokemon Scarlet/Violet and press "A" when the 5s bar is empty. If you need to
						wait a long time, there will be two bars, one that is always 5 seconds, and one that is
						the remaining time.
					</li>
				</ol>
				<h4>Hints</h4>
				<p>
					After you press "A" to set the time, you can press "Home" twice to get back into the game.
					The first press goes back to the home screen, the second press opens the game.
				</p>
				<p>
					If you keep missing timing, try changing the "Adjustment". There is some fade-out/in time
					which might be different on the different consoles.
				</p>
				<hr className="mb-2" />
			</details>
			<div className="grid grid-cols-2">
				<div>Required Bonus</div>
				<div>{chosenTarget.printType}</div>
				<div>Date and Time</div>
				<div>{timerData.dmyString}</div>
				<div>Seconds</div>
				<div>{timerData.delaySeconds}</div>

				<div>Items</div>
				<div>
					<ul>
						{chosenTarget.itemList.map((item) => (
							<li key={item.item}>
								{item.quantity} {item.item}
							</li>
						))}
					</ul>
				</div>
			</div>
			<h3>Timer</h3>
			{barASeconds > 0 ? (
				<p>Choose "I would like to print something!" when the second bar is empty.</p>
			) : (
				<p>Choose "I would like to print something!" when the bar is empty.</p>
			)}
			<div className="grid grid-cols-[min-content_1fr] gap-x-1">
				{barASeconds > 0 && (
					<>
						<div className="text-right">{barASeconds}s</div>
						<div className="border border-gray-500">
							<div
								className={`h-full bg-blue-800 text-right ease-linear ${
									timerRunning ? "transition-all" : "transition-none"
								}`}
								style={{
									width: timerRunning ? "0" : "100%",
									transitionDuration: timerRunning ? `${barASeconds}s` : "0",
								}}
							></div>
						</div>
					</>
				)}
				<div className="text-right">{barBSeconds}s</div>
				<div className="border border-gray-500">
					<div
						className={`h-full bg-blue-800 text-right ease-linear ${
							timerRunning ? "transition-all" : "transition-none"
						}`}
						style={{
							width: timerRunning ? "0" : "100%",
							transitionDelay: timerRunning ? `${Math.max(0, barASeconds)}s` : "0",
							transitionDuration: timerRunning ? `${barBSeconds}s` : "0",
						}}
					></div>
				</div>
			</div>
			<div className="mt-1 flex flex-row">
				<button
					className="mr-[-1px] grow rounded-l border border-gray-500 py-1 px-2"
					type="button"
					ref={startButtonRef}
					onClick={() => {
						setTimerRunning(true);
					}}
					onKeyDown={(event) => {
						if (event.key === " ") {
							setTimerRunning(true);
						}
					}}
				>
					Start Timer
				</button>
				<button
					className="rounded-r border border-gray-500 py-1 px-2"
					type="button"
					onClick={() => {
						setTimerRunning(false);
						if (startButtonRef.current) {
							startButtonRef.current.focus();
						}
					}}
				>
					Reset
				</button>
			</div>
			{chosenTarget.raw && (
				<div>
					<h4>Raw Entry</h4>
					<pre>{chosenTarget.raw}</pre>
				</div>
			)}
		</>
	);
}
