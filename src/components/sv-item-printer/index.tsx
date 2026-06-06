import type { SvItemPrinterTarget } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { useEffect, useState, useRef } from "react";

const targets: SvItemPrinterTarget[] = [
	{
		timestamp: 2435349196,
		itemList: [
			{ item: "Fast Ball", quantity: 1 },
			{ item: "Sport Ball", quantity: 1 },
		],
		raw: "",
	},
	{
		timestamp: 2703495290,
		itemList: [
			{ item: "Great Ball", quantity: 5 },
			{ item: "Master Ball", quantity: 4 },
		],
		raw: `2703495290, 2055-09-02 10:54:50
x1 Master Ball
x1 Master Ball
x5 Great Ball
x1 Master Ball
x1 Master Ball`,
	},
	{
		timestamp: 2681864404,
		itemList: [
			{ item: "Heal Ball", quantity: 5 },
			{ item: "Master Ball", quantity: 4 },
		],
		raw: `2681864404, 2054-12-26 02:20:04
x5 Heal Ball
x1 Master Ball
x1 Master Ball
x1 Master Ball
x1 Master Ball`,
	},
];

const getTimerData = (timestamp: number, minDelayS: number) => {
	let delaySeconds = timestamp % 60;
	if (delaySeconds < minDelayS) {
		delaySeconds = delaySeconds + 60;
	}

	const startingDate = new Date((timestamp - delaySeconds) * 1000);

	const dd = startingDate.getUTCDate().toString().padStart(2, "0");
	const mm = (startingDate.getUTCMonth() + 1).toString().padStart(2, "0");
	const yyyy = startingDate.getUTCFullYear();

	const hh = startingDate.getUTCHours().toString().padStart(2, "0");
	const ii = startingDate.getUTCMinutes().toString().padStart(2, "0");

	return {
		dmyString: `${dd}/${mm}/${yyyy} ${hh}:${ii}`,
		mdyString: `${mm}/${dd}/${yyyy} ${hh}:${ii}`,
		ymdString: `${yyyy}/${mm}/${dd} ${hh}:${ii}`,
		delaySeconds,
	};
};

export default function SvItemPrinter() {
	const { options, setOptions } = useOptions();
	const [timerRunning, setTimerRunning] = useState(false);
	const startButtonRef = useRef<HTMLButtonElement | null>(null);

	const chosenTarget = targets[options.svItemPrinterChosenTarget];

	const timerData = getTimerData(chosenTarget.timestamp, options.svItemPrinterMinSeconds);
	const totalDelaySeconds = timerData.delaySeconds - options.svItemPrinterAdjustSeconds;

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
		<div className="w-full">
			<h2>Scarlet & Violet Item Printer</h2>
			<div className="lg:grid lg:grid-cols-2">
				<div className="hidden border border-gray-500 p-2 lg:block">
					<p>Select Targets Here</p>
					<div className="flex flex-col items-stretch gap-1">
						{targets.map((t, index) => (
							<button
								key={t.timestamp}
								className="flex flex-row items-center justify-between border border-gray-500 px-2 py-1"
								type="button"
								onClick={() => {
									setOptions({
										svItemPrinterChosenTarget: index,
									});

									setTimerRunning(false);

									if (startButtonRef.current) {
										startButtonRef.current.focus();
									}
								}}
							>
								<div>
									<input type="radio" checked={options.svItemPrinterChosenTarget === index} />
								</div>
								<div className="">
									{t.itemList.map((i) => (
										<div key={i.item} className="text-left">
											{i.quantity} {i.item}
										</div>
									))}
								</div>
								<div>
									{getTimerData(t.timestamp, options.svItemPrinterMinSeconds).delaySeconds}s
								</div>
							</button>
						))}
					</div>
				</div>
				<div className="border border-gray-500 p-2">
					<div className="grid grid-cols-2">
						<div>Date and Time</div>
						<div>{timerData.dmyString}</div>
						<div>Seconds</div>
						<div>{timerData.delaySeconds}</div>

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
							ref={startButtonRef}
							onClick={() => {
								setTimerRunning(true);
							}}
						>
							Start Timer
						</button>
						<button
							className="border border-gray-500 py-1 px-2"
							type="button"
							onClick={(event) => {
								setTimerRunning(false);
								if (startButtonRef.current) {
									startButtonRef.current.focus();
								}
							}}
						>
							Reset
						</button>
					</div>
					<div>
						<h4>Raw Entry</h4>
						<pre>{chosenTarget.raw}</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
