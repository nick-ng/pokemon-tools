import type { SvItemPrinterTarget } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { useEffect, useState, useRef } from "react";
import { getTimerData } from "./utils";
import PrintTarget from "./print-target";

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

export default function SvItemPrinter() {
	const { options, setOptions } = useOptions();
	const [timerRunning, setTimerRunning] = useState(false);
	const [filterString, setFilterString] = useState("");
	const [isMobileChooserOpen, setIsMobileChooserOpen] = useState(false);
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
				<details
					className="lg:hidden"
					open={isMobileChooserOpen}
					onClick={(event) => {
						event.preventDefault();
						setIsMobileChooserOpen((prev) => {
							return !prev;
						});
					}}
				>
					<summary>Print Targets</summary>
					<input
						className="mb-1 w-full px-1"
						type="text"
						value={filterString}
						placeholder="Filter..."
						onInput={(event) => {
							setFilterString(event.currentTarget.value);
						}}
					/>
					<div className="mb-2 flex flex-col items-stretch gap-1">
						{targets.map((t, index) => (
							<PrintTarget
								key={t.timestamp}
								target={t}
								index={index}
								checked={options.svItemPrinterChosenTarget === index}
								filterString={filterString}
								onClick={(event) => {
									event.stopPropagation();
									setOptions({
										svItemPrinterChosenTarget: index,
									});
									setTimerRunning(false);
									setIsMobileChooserOpen(false);
								}}
							/>
						))}
					</div>
				</details>
				<div className="hidden border border-gray-500 p-2 lg:block">
					<p>Select Targets Here</p>
					<input
						className="mb-1 w-full px-1"
						type="text"
						value={filterString}
						placeholder="Filter..."
						onInput={(event) => {
							setFilterString(event.currentTarget.value);
						}}
					/>
					<div className="flex flex-col items-stretch gap-1">
						{targets.map((t, index) => (
							<PrintTarget
								key={t.timestamp}
								target={t}
								index={index}
								checked={options.svItemPrinterChosenTarget === index}
								filterString={filterString}
								onClick={() => {
									setOptions({
										svItemPrinterChosenTarget: index,
									});
									setTimerRunning(false);

									if (startButtonRef.current) {
										startButtonRef.current.focus();
									}
								}}
							/>
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
									<li key={item.item}>
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
