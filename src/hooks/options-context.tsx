import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import z from "zod";

import { YourRaidPokemonSchema, PokemonTypeSchema, StopwatchSchema } from "../schemas";
import { getYourRaidPokemon } from "./your-raid-pokemon";

const OPTIONS_STORE = "POKEMON_TOOLS_OPTIONS";

const optionsSchema = z.object({
	darkMode: z.string(),
	minIVs: z.array(
		z.object({
			id: z.string(),
			note: z.string(),
			baseStat: z.number(),
			level: z.number(),
			nature: z.number(),
			catchLevel: z.number(),
			catchBaseStat: z.number().optional().nullable(),
		})
	),
	minIVMaxShow: z.number(),
	raidYourPokemon: z.array(YourRaidPokemonSchema),
	raidTeraType: PokemonTypeSchema,
	raidAttackAdjustment: z.number(),
	stopwatches: z.array(StopwatchSchema),
	stopwatchFontSizePt: z.number(),
	linkTradeCode: z.number().nullable(),
	foulPlays: z.array(
		z.object({
			id: z.string(),
			note: z.string(),
			level: z.number(),
			baseAtk: z.number(),
			atkNature: z.number(),
			finalDef: z.number(),
			catchLevel: z.number(),
			catchBaseAtk: z.number().optional().nullable(),
			type1: PokemonTypeSchema,
			type2: PokemonTypeSchema,
			teraType: PokemonTypeSchema,
		})
	),
	svItemPrinterAdjustSeconds: z.number().optional().default(1),
	svItemPrinterMinSeconds: z.number().optional().default(7),
	svItemPrinterChosenTarget: z.string().optional().default(""),
});

export type Options = z.infer<typeof optionsSchema>;

export const defaultOptions: Options = {
	darkMode: "system",
	minIVs: [
		{
			id: "a",
			note: "Ting-Lu - Spe",
			baseStat: 45,
			level: 50,
			nature: 0.9,
			catchLevel: 60,
		},
	],
	minIVMaxShow: 0,
	raidYourPokemon: getYourRaidPokemon(),
	raidTeraType: "normal",
	raidAttackAdjustment: 50,
	stopwatches: [
		{
			id: "a",
			name: "Stopwatch 1",
			startTimeMS: 0,
			pausedMS: 0,
			isRunning: false,
			bars: [
				{
					id: "bar-a",
					durationMS: 60 * 1000,
					name: "1 minute",
				},
				{
					id: "bar-b",
					durationMS: 30 * 60 * 1000,
					name: "30 minutes",
				},
			],
		},
	],
	stopwatchFontSizePt: 32,
	linkTradeCode: null,
	foulPlays: [
		{
			id: "a",
			note: "test",
			level: 50,
			baseAtk: 55,
			atkNature: 0.9,
			finalDef: 75,
			catchLevel: 58,
			catchBaseAtk: 55,
			type1: "ghost",
			type2: "fairy",
			teraType: "fairy",
		},
	],
	svItemPrinterAdjustSeconds: 2,
	svItemPrinterMinSeconds: 7,
	svItemPrinterChosenTarget: "",
};

const toggleDarkMode = (darkMode: Options["darkMode"]) => {
	if (darkMode === "dark") {
		document.documentElement.classList.add("dark");
		return;
	}

	if (darkMode === "light") {
		document.documentElement.classList.remove("dark");
		return;
	}

	if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
		document.documentElement.classList.add("dark");
		return;
	}

	document.documentElement.classList.remove("dark");
};

const OptionsContext = createContext<{
	options: Options;
	setOptions: (newPartialOptions: Partial<Options>) => void;
}>({
	options: { ...defaultOptions },
	setOptions: () => {},
});

const OptionsContextProvider = ({ children }: { children: ReactNode }) => {
	const savedOptionsString = localStorage.getItem(OPTIONS_STORE);
	let savedOptions: Partial<Options> = {};
	if (savedOptionsString) {
		try {
			savedOptions = optionsSchema.partial().parse(JSON.parse(savedOptionsString));
		} catch (e) {
			console.error("Invalid saved options", savedOptionsString);
		}
	}

	const [options, setOptions] = useState<Options>({
		...defaultOptions,
		...savedOptions,
	});

	useEffect(() => {
		toggleDarkMode(options.darkMode);
	}, [options.darkMode]);

	useEffect(() => {
		const prefersColorSchemeDark = window.matchMedia("(prefers-color-scheme: dark)");

		const toggleCallBack = () => {
			toggleDarkMode(options.darkMode);
		};

		prefersColorSchemeDark.addEventListener("change", toggleCallBack);

		return () => {
			prefersColorSchemeDark.removeEventListener("change", toggleCallBack);
		};
	}, []);

	return (
		<OptionsContext.Provider
			value={{
				options,
				setOptions: (newPartialOptions: Partial<Options>) => {
					setOptions((prevOptions) => {
						const fullOptions = { ...prevOptions, ...newPartialOptions };
						localStorage.setItem(OPTIONS_STORE, JSON.stringify(fullOptions));
						return fullOptions;
					});
				},
			}}
		>
			{children}
		</OptionsContext.Provider>
	);
};

export const useOptions = () => {
	return useContext(OptionsContext);
};

export default OptionsContextProvider;
