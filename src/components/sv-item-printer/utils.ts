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
