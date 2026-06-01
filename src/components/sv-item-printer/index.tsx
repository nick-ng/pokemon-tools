import type { SvItemPrinterTarget } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { useEffect, useState } from "react";

const targets: SvItemPrinterTarget[] = [
	{
		timestamp: 2435349196,
		itemList: [
			{ item: "Fast Ball", quantity: 1 },
			{ item: "Sport Ball", quantity: 1 },
		],
		raw: "",
	},
];

const getStartingDateString = (timestamp: number) => {
	const startingDate = new Date(timestamp * 1000);

	const dd = startingDate.getDate().toString().padStart(2, "0");
	const mm = (startingDate.getMonth() + 1).toString().padStart(2, "0");
	const yyyy = startingDate.getFullYear();

	const hh = startingDate.getHours().toString().padStart(2, "0");
	const ii = startingDate.getMinutes().toString().padStart(2, "0");

	return `${dd}/${mm}/${yyyy} ${hh}:${ii}`;
};

export default function SvItemPrinter() {
	const { options } = useOptions();
	const [timerRunning, setTimerRunning] = useState(false);

	const chosenTarget = targets[0];
	const delaySeconds = chosenTarget.timestamp % 60;
	const totalDelaySeconds = delaySeconds + options.svItemPrinterAdjustSeconds;

	const barBMaxSeconds = 5;

	const barASeconds = totalDelaySeconds - barBMaxSeconds;
	const barBSeconds = Math.min(barBMaxSeconds, totalDelaySeconds);

	useEffect(() => {
		const startTimer = (kbEvent: KeyboardEvent) => {
			if (kbEvent.key === " ") {
				setTimerRunning(true);
			}
		};

		document.addEventListener("keydown", startTimer);

		return () => {
			document.removeEventListener("keydown", startTimer);
		};
	});

	return (
		<div>
			<h2>Scarlet & Violet Item Printer</h2>
			<div className="lg:grid lg:grid-cols-2">
				<div className="hidden border border-gray-500 p-2 lg:block">
					<p>Select Targets Here</p>
				</div>
				<div className="border border-gray-500 p-2">
					<div className="grid grid-cols-2">
						<div>Date and Time</div>
						<div>{getStartingDateString(chosenTarget.timestamp)}</div>
						<div>Seconds</div>
						<div>{delaySeconds}</div>

						<div>Items</div>
						<div>
							<ul>
								{chosenTarget.itemList.map((item) => (
									<li>
										{item.quantity} {item.item}
									</li>
								))}
							</ul>
						</div>
					</div>
					<h3>Timer</h3>
					{barASeconds > 0 ? (
						<p>Press when the second bar is empty.</p>
					) : (
						<p>Press when the bar is empty.</p>
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
							className="grow border border-gray-500 py-1 px-2"
							type="button"
							onClick={() => {
								setTimerRunning(true);
							}}
						>
							Start Timer
						</button>
						<button
							className="border border-gray-500 py-1 px-2"
							type="button"
							onClick={() => {
								setTimerRunning(false);
							}}
						>
							Reset
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
