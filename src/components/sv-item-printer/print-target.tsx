import type { SvItemPrinterTarget } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { getTimerData, getMatchingCount } from "./utils";

export type PrintTargetProps = {
	target: SvItemPrinterTarget;
	checked: boolean;
	filterString: string;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

export default function PrintTarget({ target, checked, filterString, onClick }: PrintTargetProps) {
	const { options } = useOptions();

	const delaySeconds = getTimerData(target.timestamp, options.svItemPrinterMinSeconds).delaySeconds;
	const matchingCount = getMatchingCount(target, filterString);

	return (
		<button
			className="flex flex-row items-center justify-between gap-2 border border-gray-500 px-2 py-1"
			type="button"
			onClick={(event) => {
				onClick(event);
			}}
		>
			<div>
				<input type="radio" checked={checked} readOnly />
			</div>
			<div className="">
				{target.itemList.map((i) => {
					const isIrrelevant =
						filterString && !i.item.toLowerCase().includes(filterString.toLowerCase());

					return (
						<div key={i.item} className={`text-left ${isIrrelevant ? "opacity-30" : ""}`}>
							{i.quantity} {i.item.replace("Tera Shard", "Shard")}
						</div>
					);
				})}
			</div>
			<div className="grid grid-cols-2 gap-x-1">
				<div className="text-right">Mode:</div>
				<div className="text-left">{target.printType}</div>
				<div className="text-right">Prints:</div>
				<div className="text-left">{target.printCount}</div>
				{target.triggers && (
					<>
						<div className="text-right">Triggers:</div>
						<div className="text-left">
							{target.triggers}, {target.triggers2}
						</div>
					</>
				)}
			</div>
			<div className="grow"></div>
			<div>
				{matchingCount > 0 && <div>{matchingCount}x</div>}
				<div>{delaySeconds}s</div>
			</div>
		</button>
	);
}
