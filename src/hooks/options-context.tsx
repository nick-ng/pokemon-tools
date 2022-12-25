import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import z from "zod";

import { YourRaidPokemonSchema } from "../services/pokedex/schemas";

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
});

export type Options = z.infer<typeof optionsSchema>;

export const defaultOptions = Object.freeze({
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
  minIVMaxShow: 10,
  raidYourPokemon: [
    {
      id: "a",
      pokemon: {
        name: "Azumaril",
        types: ["water", "fairy"],
        teraType: "fairy",
        ability: "Huge Power",
        finalStats: {
          hp: 207,
          atk: 102,
          def: 101,
          spa: 80,
          spd: 100,
          spe: 70,
        },
      },
      mainMoves: [
        {
          id: "a",
          name: "Play Rough",
          damageClass: "physical",
          power: 90,
          type: "fairy",
        },
        {
          id: "b",
          name: "Waterfall",
          damageClass: "physical",
          power: 80,
          type: "water",
        },
      ],
    },
  ],
}) as Readonly<Options>;

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
