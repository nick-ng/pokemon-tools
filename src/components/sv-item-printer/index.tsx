import type { SvItemPrinterTarget } from "../../schemas";

import { useEffect, useState, useMemo } from "react";
import { useOptions } from "../../hooks/options-context";
import { SvItemPrinterTargetSchema } from "../../schemas";
import { getMatchingCount, getSortValue } from "./utils";
import PrintTarget from "./print-target";
import ChosenTarget from "./chosen-target";

// @todo(nick-ng): add a way to adjust the min time and adjustment time settings
export default function SvItemPrinter() {
	const { options, setOptions } = useOptions();
	const [targets, setTargets] = useState<SvItemPrinterTarget[]>([]);
	const [filterString, setFilterString] = useState("");
	const [isMobileChooserOpen, setIsMobileChooserOpen] = useState(false);
	const [chosenPrintTypes, setChosenPrintTypes] = useState<string[]>([]);
	const [chosenModeTriggers, setChosenModeTriggers] = useState<string[]>([]);

	const printTypes = useMemo(() => [...new Set(targets.map((t) => t.printType))], [targets]);
	const modeTriggers = useMemo(() => [...new Set(targets.map((t) => t.triggers))], [targets]);

	const chosenTarget = targets.find((t) => t.id === options.svItemPrinterChosenTarget);
	const visibleTargets = targets
		.filter((t) => {
			if (chosenPrintTypes.length > 0 && !chosenPrintTypes.includes(t.printType)) {
				return false;
			}

			if (chosenModeTriggers.length > 0 && !chosenModeTriggers.includes(t.triggers)) {
				return false;
			}

			if (filterString.length >= 3) {
				return getMatchingCount(t, filterString, true) > 0;
			}

			return true;
		})
		.sort((a, b) => {
			return (
				getSortValue(a, filterString, options.svItemPrinterMinSeconds) -
				getSortValue(b, filterString, options.svItemPrinterMinSeconds)
			);
		})
		.slice(0, 5);

	useEffect(() => {
		const abortController = new AbortController();
		const printUris = ["regular", "ball-lotto", "item-bonus", "combo"];
		const fetchTargets = () => {
			setTargets([]);
			printUris.map(async (printType) => {
				try {
					const resR = await fetch(`/item-printer-${printType}.json`, {
						signal: abortController.signal,
					});
					const resJson = await resR.json();
					const tempTargets = SvItemPrinterTargetSchema.array().parse(resJson);
					setTargets((prev) => prev.concat(tempTargets));
				} catch (e) {
					console.error(e);
				}
			});
		};

		fetchTargets();

		return () => {
			abortController.abort();
		};
	}, []);

	return (
		<div className="w-full">
			<h2>Scarlet & Violet Item Printer</h2>
			<div className="lg:grid lg:grid-cols-2">
				<details className="lg:hidden">
					<summary>Item Printer Seeds</summary>
					<div className="flex flex-row">
						<input
							className="m-0 mr-[-1px] block grow rounded-r-none border border-gray-500 px-1"
							type="text"
							value={filterString}
							placeholder="Filter..."
							onChange={(event) => {
								setFilterString(event.currentTarget.value);
							}}
						/>
						<button
							className="block grow-0 rounded-r border border-gray-500 px-2"
							type="button"
							onClick={() => {
								setFilterString("");
							}}
						>
							X
						</button>
					</div>
					<div className="mx-2 mb-1 flex flex-row items-start justify-around gap-2">
						<div className="flex flex-col justify-start">
							<h4>Print Type</h4>
							{printTypes.map((printType) => (
								<label key={printType} className="block">
									<input
										type="checkbox"
										checked={chosenPrintTypes.includes(printType)}
										onChange={(event) => {
											if (event.currentTarget.checked) {
												setChosenPrintTypes((prev) => [...prev, printType]);
											} else {
												setChosenPrintTypes((prev) => prev.filter((p) => p !== printType));
											}
										}}
									/>{" "}
									{printType}
								</label>
							))}
						</div>
						<div className="flex flex-col justify-start">
							<h4>Mode Triggers</h4>
							{modeTriggers.map((modeTrigger) => (
								<label key={modeTrigger} className="block">
									<input
										type="checkbox"
										checked={chosenModeTriggers.includes(modeTrigger)}
										onChange={(event) => {
											if (event.currentTarget.checked) {
												setChosenModeTriggers((prev) => [...prev, modeTrigger]);
											} else {
												setChosenModeTriggers((prev) => prev.filter((p) => p !== modeTrigger));
											}
										}}
									/>{" "}
									{modeTrigger || "No trigger"}
								</label>
							))}
						</div>
					</div>
					<div className="mb-2 flex flex-col items-stretch gap-1">
						{visibleTargets.length > 0 ? (
							visibleTargets.map((t, index) => (
								<PrintTarget
									key={t.id}
									target={t}
									checked={options.svItemPrinterChosenTarget === t.id}
									filterString={filterString}
									onClick={() => {
										setOptions({
											svItemPrinterChosenTarget: t.id,
										});
										setIsMobileChooserOpen(false);
									}}
								/>
							))
						) : (
							<div>No matches</div>
						)}
					</div>
				</details>
				<div className="hidden border border-gray-500 lg:block">
					<p className="mx-2 mt-1">
						Seeds from{" "}
						<a
							href="https://gist.github.com/Lusamine/112d4230919fadd254f0e6dfca850471"
							target="_blank"
						>
							Anubis's Item Printer Seeds.md
						</a>
					</p>
					<div className="mx-2 my-1 flex flex-row items-stretch">
						<input
							className="m-0 mr-[-1px] block grow rounded-r-none border border-gray-500 px-1"
							type="text"
							value={filterString}
							placeholder="Filter..."
							onChange={(event) => {
								setFilterString(event.currentTarget.value);
							}}
						/>
						<button
							className="block grow-0 rounded-r border border-gray-500 px-2"
							type="button"
							onClick={() => {
								setFilterString("");
							}}
						>
							X
						</button>
					</div>
					<div className="mx-2 mb-1 flex flex-row items-start gap-2">
						<div className="flex flex-col justify-start">
							<h4>Print Type</h4>
							{printTypes.map((printType) => (
								<label key={printType} className="block">
									<input
										type="checkbox"
										checked={chosenPrintTypes.includes(printType)}
										onChange={(event) => {
											if (event.currentTarget.checked) {
												setChosenPrintTypes((prev) => [...prev, printType]);
											} else {
												setChosenPrintTypes((prev) => prev.filter((p) => p !== printType));
											}
										}}
									/>{" "}
									{printType}
								</label>
							))}
						</div>
						<div className="flex flex-col justify-start">
							<h4>Mode Triggers</h4>
							{modeTriggers.map((modeTrigger) => (
								<label key={modeTrigger} className="block">
									<input
										type="checkbox"
										checked={chosenModeTriggers.includes(modeTrigger)}
										onChange={(event) => {
											if (event.currentTarget.checked) {
												setChosenModeTriggers((prev) => [...prev, modeTrigger]);
											} else {
												setChosenModeTriggers((prev) => prev.filter((p) => p !== modeTrigger));
											}
										}}
									/>{" "}
									{modeTrigger || "No trigger"}
								</label>
							))}
						</div>
					</div>
					<div className="mx-2 mb-1 flex max-h-[80vh] flex-col items-stretch gap-1 overflow-y-auto">
						{visibleTargets.length > 0 ? (
							visibleTargets.map((t) => (
								<PrintTarget
									key={t.id}
									target={t}
									checked={options.svItemPrinterChosenTarget === t.id}
									filterString={filterString}
									onClick={() => {
										setOptions({
											svItemPrinterChosenTarget: t.id,
										});
									}}
								/>
							))
						) : (
							<div>No matches</div>
						)}
					</div>
				</div>
				<div className="border border-gray-500 p-2">
					{chosenTarget ? (
						<ChosenTarget key={chosenTarget.timestamp} chosenTarget={chosenTarget} />
					) : (
						<div></div>
					)}
				</div>
			</div>
		</div>
	);
}
