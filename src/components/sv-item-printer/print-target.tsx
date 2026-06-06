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
	const flexOrder = Math.max(0, 50 - matchingCount) * 100 + delaySeconds;

	return (
		<button
			className="flex flex-row items-center justify-between gap-2 border border-gray-500 px-2 py-1"
			style={{ order: flexOrder }}
			type="button"
			onClick={(event) => {
				onClick(event);
			}}
		>
			<div>
				<input type="radio" checked={checked} readOnly />
			</div>
			<div>{target.printType}</div>
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
			<div className="grow"></div>
			<div>
				<div>
					{matchingCount > 0 && `${matchingCount}x, `}
					{delaySeconds}s
				</div>
			</div>
		</button>
	);
}
