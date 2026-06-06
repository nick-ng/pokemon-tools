import type { SvItemPrinterTarget } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { getTimerData } from "./utils";

export type PrintTargetProps = {
	target: SvItemPrinterTarget;
	index: number;
	checked: boolean;
	filterString: string;
	onClick: () => void | Promise<void>;
};

const getMatchingCount = (printTarget: SvItemPrinterTarget, filterString: string) => {
	if (!filterString) {
		return 0;
	}

	let matchingCount = 0;
	for (let i = 0; i < printTarget.itemList.length; i++) {
		const item = printTarget.itemList[i];
		if (item.item.toLowerCase().includes(filterString.toLowerCase())) {
			matchingCount = matchingCount + item.quantity;
		}
	}

	return matchingCount;
};

export default function PrintTarget({ target, checked, filterString, onClick }: PrintTargetProps) {
	const { options } = useOptions();

	const delaySeconds = getTimerData(target.timestamp, options.svItemPrinterMinSeconds).delaySeconds;
	const matchingCount = getMatchingCount(target, filterString);

	const flexOrder = (8000 - matchingCount) * 100 + delaySeconds;

	return (
		<button
			className="flex flex-row items-center justify-between border border-gray-500 px-2 py-1"
			style={{ order: flexOrder }}
			type="button"
			onClick={() => {
				onClick();
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
							{i.quantity} {i.item}
						</div>
					);
				})}
			</div>
			<div>
				<div>
					{matchingCount > 0 && `${matchingCount}x, `}
					{delaySeconds}s
				</div>
			</div>
		</button>
	);
}
