import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import z from "zod";

import {
  YourRaidPokemonSchema,
  PokemonTypeSchema,
  StopwatchSchema,
} from "../schemas";
import { getYourRaidPokemon } from "./your-raid-pokemon";

const OPTIONS_STORE = "POKEMON_TOOLS_OPTIONS";

const optionsSchema = z.object({
  darkMode: z.enum(["light", "dark", "system"]),
  minIVs: z.array(
    z.object({
      id: z.string(),
      note: z.string(),
      baseStat: z.number(),
      level: z.number(),
      nature: z.number(),
      catchLevel: z.number(),
    })
  ),
  minIVMaxShow: z.number(),
  raidYourPokemon: z.array(YourRaidPokemonSchema),
  raidTeraType: PokemonTypeSchema,
  raidAttackAdjustment: z.number(),
  stopwatches: z.array(StopwatchSchema),
  stopwatchFontSizePt: z.number(),
});

export type Options = z.infer<typeof optionsSchema>;

export const defaultOptions: Readonly<Options> = Object.freeze({
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
    {
      id: "b",
      note: "Miraidon - Atk",
      baseStat: 85,
      level: 50,
      nature: 0.9,
      catchLevel: 72,
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
});

const toggleDarkMode = (darkMode: Options["darkMode"]) => {
  if (
    darkMode === "dark" ||
    (darkMode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const OptionsContext = createContext<{
  options: Options;
  setOptions: (newPartialOptions: Partial<Options>) => void;
}>({
  options: defaultOptions,
  setOptions: () => {},
});

const OptionsContextProvider = ({ children }: { children: ReactNode }) => {
  const savedOptionsString = localStorage.getItem(OPTIONS_STORE);
  let savedOptions: Partial<Options> = {};
  if (savedOptionsString) {
    try {
      savedOptions = optionsSchema
        .partial()
        .parse(JSON.parse(savedOptionsString));
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
    const prefersColorSchemeDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

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
