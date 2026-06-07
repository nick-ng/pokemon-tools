import fs from "node:fs/promises";
import path from "node:path";
import { SvItemPrinterTargetSchema } from "../src/schemas.ts";

const SEED_LISTS_DIR = path.join(".", "tools", "sv-item-printer");

async function main() {
	const fileList = await fs.readdir(SEED_LISTS_DIR);

	const printerTargets = [];
	await Promise.all(
		fileList.map(async (filename) => {
			if (!filename.endsWith(".txt")) {
				return;
			}

			const fileContents = await fs.readFile(path.join(SEED_LISTS_DIR, filename), {
				encoding: "utf8",
			});

			const temp = fileContents.split("\n\n");
			temp.forEach((rawString) => {
				let printType = "regular";
				if (filename.startsWith("item-bonus")) {
					printType = "item-bonus";
				} else if (filename.startsWith("ball-lotto")) {
					printType = "ball-lotto";
				} else if (filename.startsWith("combo")) {
					printType = "combo";
				}

				const result = parseSeed(rawString.trim(), printType);
				if (result) {
					printerTargets.push(result);
				}
			});
		})
	);

	const printTypes = [...new Set(printerTargets.map((pt) => pt.printType))];

	printTypes.forEach((printType) => {
		const temp = printerTargets.filter((pt) => pt.printType === printType);
		if (temp.length > 0) {
			fs.writeFile(
				path.join(".", "public", `item-printer-${printType}.json`),
				JSON.stringify(temp, null, 2)
			);
		}
	});
}

function parseSeed(seedString, printType) {
	const [line0, ...lines] = seedString.split("\n");

	const [seed] = line0.split(",");

	const itemMap = {};
	let lastArrow = "";
	let afterLastArrow = 0;
	let printCount = 0;
	lines.forEach((line) => {
		if (line.startsWith("x")) {
			afterLastArrow = afterLastArrow + 1;
			printCount = printCount + 1;
			const [rawQuantity, ...itemParts] = line.split(" ");
			const quantity = parseInt(rawQuantity.replace("x", ""), 10);
			const item = itemParts.join(" ");
			if (!itemMap[item]) {
				itemMap[item] = { item, quantity };
			} else {
				itemMap[item].quantity = itemMap[item].quantity + quantity;
			}
		} else if (line.startsWith("-->")) {
			afterLastArrow = 0;
			lastArrow = line;
		}
	});

	let triggers = "";
	let triggers2 = "";
	if (!lastArrow) {
		// noop
	} else if (lastArrow === "--> Print job triggers item bonus if used in regular mode.") {
		triggers = "item-bonus";
		triggers2 = "10/10";
	} else if (lastArrow === "--> Print job triggers ball bonus if used in regular mode.") {
		triggers = "ball-lotto";
	} else if (lastArrow === "--> Trigger item bonus, then print 5.") {
		triggers = "item-bonus";
		triggers2 = "5/10";
	} else if (lastArrow === "--> Trigger item bonus, then print 10.") {
		triggers = "item-bonus";
		triggers2 = "0/10";
	} else if (lastArrow === "--> Trigger ball bonus, then print 5.") {
		// noop
	} else if (lastArrow === "--> Trigger ball bonus, then print 10.") {
		// noop
	} else if (lastArrow === "--> Print 1 in regular mode to trigger item bonus.") {
		triggers = "item-bonus";
		triggers2 = "*";
	} else if (lastArrow === "--> Print 1 in regular mode to trigger ball bonus.") {
		triggers = "ball-lotto";
		triggers2 = "*";
	} else {
		console.log("lastArrow", lastArrow);
		console.log("printType", printType);
		console.log(seedString);
	}

	const printerTargetResult = SvItemPrinterTargetSchema.safeParse({
		id: `${printType}-${printCount}-${seed}`,
		timestamp: parseInt(seed, 10),
		printType,
		itemList: Object.values(itemMap).sort((a, b) => b.quantity - a.quantity),
		raw: seedString,
		triggers,
		triggers2,
		printCount,
	});
	if (printerTargetResult.success) {
		return printerTargetResult.data;
	} else {
		console.log("printerTargetResult.error", JSON.stringify(printerTargetResult.error, null, 2));
		return null;
	}
}

main();
