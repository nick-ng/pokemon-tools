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
	const chosenTarget = targets[options.svItemPrinterChosenTarget];

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
							className="mb-1 w-full grow px-1"
							type="text"
							value={filterString}
							placeholder="Filter..."
							onInput={(event) => {
								setFilterString(event.currentTarget.value);
							}}
						/>
						<button
							className="grow-0 border border-gray-500 px-2"
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
								index={index}
								checked={options.svItemPrinterChosenTarget === index}
								filterString={filterString}
								onClick={(event) => {
									event.stopPropagation();
									setOptions({
										svItemPrinterChosenTarget: index,
									});
									setIsMobileChooserOpen(false);
								}}
							/>
						))}
					</div>
				</details>
				<div className="hidden border border-gray-500 p-2 lg:block">
					<p>
						Seeds from{" "}
						<a
							href="https://gist.github.com/Lusamine/112d4230919fadd254f0e6dfca850471"
							target="_blank"
						>
							Anubis's Item Printer Seeds.md
						</a>
					</p>
					<div className="mb-1 flex flex-row">
						<input
							className="grow px-1"
							type="text"
							value={filterString}
							placeholder="Filter..."
							onInput={(event) => {
								setFilterString(event.currentTarget.value);
							}}
						/>
						<button
							className="grow-0 border border-gray-500 px-2"
							type="button"
							onClick={() => {
								setFilterString("");
							}}
						>
							X
						</button>
					</div>
					<div className="flex flex-col items-stretch gap-1">
						{targets.slice(0, filterString ? targets.length : 5).map((t, index) => (
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
