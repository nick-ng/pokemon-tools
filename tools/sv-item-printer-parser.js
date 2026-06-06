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
				}

				const result = parseSeed(rawString.trim(), printType);
				if (result) {
					printerTargets.push(result);
				}
			});
		})
	);

	const regular = printerTargets.filter((pt) => pt.printType === "regular");
	if (regular.length > 0) {
		fs.writeFile(
			path.join(".", "public", "item-printer-regular.json"),
			JSON.stringify(regular, null, 2)
		);
	}
}

function parseSeed(seedString, printType) {
	const [line0, ...lines] = seedString.split("\n");

	const [seed] = line0.split(",");

	const itemMap = {};
	lines.forEach((line) => {
		if (line.startsWith("x")) {
			const [rawQuantity, ...itemParts] = line.split(" ");
			const quantity = parseInt(rawQuantity.replace("x", ""), 10);
			const item = itemParts.join(" ");
			if (!itemMap[item]) {
				itemMap[item] = { item, quantity };
			} else {
				itemMap[item].quantity = itemMap[item].quantity + quantity;
			}
		}
	});

	const printerTargetResult = SvItemPrinterTargetSchema.safeParse({
		timestamp: parseInt(seed, 10),
		printType,
		itemList: Object.values(itemMap).sort((a, b) => b.quantity - a.quantity),
		raw: seedString,
	});
	if (printerTargetResult.success) {
		return printerTargetResult.data;
	} else {
		console.log("printerTargetResult.error", JSON.stringify(printerTargetResult.error, null, 2));
		return null;
	}
}

main();
