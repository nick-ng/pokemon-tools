import type { SvItemPrinterTarget } from "../../schemas";
import { useOptions } from "../../hooks/options-context";

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

	const chosenTarget = targets[0];
	const delaySeconds = chosenTarget.timestamp % 60;

	return (
		<div>
			<h2>Scarlet & Violet Item Printer</h2>
			<div className="lg:grid lg:grid-cols-2">
				<div className="hidden lg:block">
					<p>Select Targets Here</p>
				</div>
				<div>
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
				</div>
			</div>
		</div>
	);
}
