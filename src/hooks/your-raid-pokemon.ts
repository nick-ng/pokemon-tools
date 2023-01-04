import z from "zod";

import type { YourRaidPokemon } from "../schemas";
import { YourRaidPokemonSchema } from "../schemas";

const yourRaidPokemon = [
  {
    id: "a",
    pokemon: {
      name: "Azumaril",
      types: ["water", "fairy"] as ("water" | "fairy")[],
      teraType: "fairy" as "fairy",
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
  {
    id: "b",
    pokemon: {
      name: "Flutter Mane",
      types: ["ghost", "fairy"] as ("ghost" | "fairy")[],
      teraType: "fairy",
      ability: "Protosynthesis",
      finalStats: {
        hp: 252,
        atk: 131,
        def: 146,
        spa: 405,
        spd: 369,
        spe: 306,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Moonblast",
        damageClass: "special",
        power: 95,
        type: "fairy",
      },
    ],
  },
  {
    id: "c",
    pokemon: {
      name: "Skeledirge",
      types: ["fire", "ghost"] as ("ghost" | "fire")[],
      teraType: "fire",
      ability: "",
      finalStats: {
        hp: 412,
        atk: 156,
        def: 237,
        spa: 350,
        spd: 186,
        spe: 168,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Torch Song",
        damageClass: "special",
        power: 80,
        type: "fire",
      },
    ],
  },
  {
    id: "d",
    pokemon: {
      name: "Espathra",
      types: ["psychic"] as "psychic"[],
      teraType: "psychic",
      ability: "",
      finalStats: {
        hp: 394,
        atk: 125,
        def: 156,
        spa: 301,
        spd: 157,
        spe: 246,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Lumina Crash",
        damageClass: "special",
        power: 80,
        type: "psychic",
      },
    ],
  },
  {
    id: "e",
    pokemon: {
      name: "Flapple",
      types: ["grass", "dragon"] as ("grass" | "dragon")[],
      teraType: "grass",
      ability: "",
      finalStats: {
        hp: 344,
        atk: 319,
        def: 197,
        spa: 226,
        spd: 156,
        spe: 176,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Grav Apple",
        damageClass: "special",
        power: 80,
        type: "grass",
      },
    ],
  },
  {
    id: "f",
    pokemon: {
      name: "Gholdengo",
      types: ["steel", "ghost"] as ("steel" | "ghost")[],
      teraType: "ghost",
      ability: "",
      finalStats: {
        hp: 378,
        atk: 125,
        def: 226,
        spa: 401,
        spd: 218,
        spe: 204,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Shadow Ball",
        damageClass: "special",
        power: 80,
        type: "ghost",
      },
    ],
  },
  {
    id: "g",
    pokemon: {
      name: "Iron Hands",
      types: ["fighting", "electric"] as ("fighting" | "electric")[],
      teraType: "electric",
      ability: "",
      finalStats: {
        hp: 512,
        atk: 416,
        def: 253,
        spa: 122,
        spd: 172,
        spe: 136,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Thunder Punch",
        damageClass: "physical",
        power: 75,
        type: "electric",
      },
      {
        id: "b",
        name: "Drain Punch",
        damageClass: "physical",
        power: 75,
        type: "fighting",
      },
    ],
  },
  {
    id: "h",
    pokemon: {
      name: "Slowbro",
      types: ["water", "psychic"] as ("water" | "psychic")[],
      teraType: "psychic",
      ability: "",
      finalStats: {
        hp: 332,
        atk: 186,
        def: 350,
        spa: 299,
        spd: 185,
        spe: 86,
      },
    },
    mainMoves: [
      {
        id: "a",
        name: "Psychic",
        damageClass: "special",
        power: 90,
        type: "psychic",
      },
    ],
  },
];

export const getYourRaidPokemon = (): YourRaidPokemon[] => {
  const res = z.array(YourRaidPokemonSchema).safeParse(yourRaidPokemon);

  if (!res.success) {
    return [];
  }

  return res.data;
};
