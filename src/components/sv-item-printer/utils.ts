import type { SvItemPrinterTarget } from "../../schemas";

export const getTimerData = (timestamp: number, minDelayS: number) => {
	let delaySeconds = timestamp % 60;
	if (delaySeconds < minDelayS) {
		delaySeconds = delaySeconds + 60;
	}

	const startingDate = new Date((timestamp - delaySeconds) * 1000);

	const dd = startingDate.getUTCDate().toString().padStart(2, "0");
	const mm = (startingDate.getUTCMonth() + 1).toString().padStart(2, "0");
	const yyyy = startingDate.getUTCFullYear();

	const hh = startingDate.getUTCHours().toString().padStart(2, "0");
	const ii = startingDate.getUTCMinutes().toString().padStart(2, "0");

	return {
		dmyString: `${dd}/${mm}/${yyyy} ${hh}:${ii}`,
		mdyString: `${mm}/${dd}/${yyyy} ${hh}:${ii}`,
		ymdString: `${yyyy}/${mm}/${dd} ${hh}:${ii}`,
		delaySeconds,
	};
};

export const getMatchingCount = (
	printTarget: SvItemPrinterTarget,
	filterString: string,
	fast = false
) => {
	if (!filterString) {
		return 0;
	}

	let matchingCount = 0;
	for (let i = 0; i < printTarget.itemList.length; i++) {
		const item = printTarget.itemList[i];
		if (item.item.toLowerCase().includes(filterString.toLowerCase())) {
			if (fast) {
				return item.quantity;
			}

			matchingCount = matchingCount + item.quantity;
		}
	}

	return matchingCount;
};

export const getSortValue = (
	printTarget: SvItemPrinterTarget,
	filterString: string,
	minDelayS: number
) => {
	const delaySeconds = getTimerData(printTarget.timestamp, minDelayS).delaySeconds;
	const matchingCount = getMatchingCount(printTarget, filterString);
	if (matchingCount >= 100) {
		return delaySeconds;
	}

	if (matchingCount >= 50) {
		return 5000 + delaySeconds;
	}

	return (100 - matchingCount) * 100 + delaySeconds;
};
