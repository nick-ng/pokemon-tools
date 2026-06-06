import type { SvItemPrinterTarget } from "../../schemas";

import { useEffect, useState } from "react";
import { useOptions } from "../../hooks/options-context";
import { SvItemPrinterTargetSchema } from "../../schemas";
import PrintTarget from "./print-target";
import ChosenTarget from "./chosen-target";

export default function SvItemPrinter() {
	const { options, setOptions } = useOptions();
	const [targets, setTargets] = useState<SvItemPrinterTarget[]>([]);
	const [filterString, setFilterString] = useState("");
	const [isMobileChooserOpen, setIsMobileChooserOpen] = useState(false);

	// @todo(nick-ng): use the seed or something so we can filter the results
	const chosenTarget = targets.find((t) => t.timestamp === options.svItemPrinterChosenTarget);
	const visibleTargets = filterString ? targets.filter((t) => t) : targets.slice(0, 50);

	useEffect(() => {
		const abortController = new AbortController();
		const fetchTargets = async () => {
			setTargets([]);
			try {
				const resR = await fetch("/item-printer-regular.json", { signal: abortController.signal });
				const resJson = await resR.json();
				const tempTargets = SvItemPrinterTargetSchema.array().parse(resJson);
				console.log("tempTargets[0]", tempTargets[0]);
				setTargets((prev) => prev.concat(tempTargets));
			} catch (e) {
				console.error(e);
			}
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
					<summary>Item Printer Seeds</summary>
					<div className="flex flex-row">
						<input
							className="mb-1 w-full grow border border-gray-500 py-1 px-1"
							type="text"
							value={filterString}
							placeholder="Filter..."
							onInput={(event) => {
								setFilterString(event.currentTarget.value);
							}}
						/>
						<button
							className="grow-0 border border-gray-500 py-1 px-2"
							type="button"
							onClick={() => {
								setFilterString("");
							}}
						>
							X
						</button>
					</div>
					<div className="mb-2 flex flex-col items-stretch gap-1">
						{targets.slice(0, filterString ? targets.length : 5).map((t, index) => (
							<PrintTarget
								key={t.timestamp}
								target={t}
								checked={options.svItemPrinterChosenTarget === index}
								filterString={filterString}
								onClick={(event) => {
									event.stopPropagation();
									setOptions({
										svItemPrinterChosenTarget: t.timestamp,
									});
									setIsMobileChooserOpen(false);
								}}
							/>
						))}
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
							onInput={(event) => {
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
					<div className="mx-2 mb-1 flex max-h-[80vh] flex-col items-stretch gap-1 overflow-y-auto">
						{visibleTargets.map((t) => (
							<PrintTarget
								key={t.timestamp}
								target={t}
								checked={options.svItemPrinterChosenTarget === t.timestamp}
								filterString={filterString}
								onClick={() => {
									setOptions({
										svItemPrinterChosenTarget: t.timestamp,
									});
								}}
							/>
						))}
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
