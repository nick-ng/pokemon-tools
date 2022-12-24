import z from "zod";

export const TeraRaidSchema = z.object({
  id: z.string(),
  stars: z.number(),
  pokemon: z.string(),
  moves: z.array(z.string()),
});

export type TeraRaidPokemon = z.infer<typeof TeraRaidSchema>;

export const TeraRaidArraySchema = z.array(TeraRaidSchema);

export const RawMoveInfoSchema = z.object({
  damage_class: z.object({ name: z.enum(["physical", "special", "status"]) }),
  power: z.number().nullable(),
  type: z.object({ name: z.string() }),
});

export type RawMoveInfo = z.infer<typeof RawMoveInfoSchema>;

export const MoveInfoSchema = z.object({
  name: z.string(),
  damageClass: z.enum(["physical", "special", "status", "both"]),
  power: z.number().nullable(),
  type: z.union([z.string(), z.number()]),
});

export type MoveInfo = z.infer<typeof MoveInfoSchema>;

export const RawPokemonInfoSchema = z.object({
  types: z.array(
    z.object({
      slot: z.number(),
      type: z.object({ name: z.string() }),
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: z.object({ name: z.string() }),
    })
  ),
  abilities: z.array(
    z.object({
      ability: z.object({ name: z.string() }),
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
});

export const PokemonStatsSchema = z.object({
  hp: z.number(),
  atk: z.number(),
  def: z.number(),
  spa: z.number(),
  spd: z.number(),
  spe: z.number(),
});

export type PokemonStats = z.infer<typeof PokemonStatsSchema>;

export const PokedexEntrySchema = z.object({
  name: z.string(),
  types: z.array(z.string()),
  baseStats: PokemonStatsSchema,
  abilities: z.array(z.string()),
  hiddenAbility: z.string().nullable(),
});

export type PokedexEntry = z.infer<typeof PokedexEntrySchema>;

export const PokemonInfoSchema = z.object({
  name: z.string(),
  types: z.array(z.string()),
  teraType: z.string(),
  finalStats: PokemonStatsSchema,
  ability: z.string(),
});

export type PokemonInfo = z.infer<typeof PokemonInfoSchema>;
