import z from "zod";

export const TeraRaidSchema = z.object({
  id: z.string(),
  stars: z.number(),
  pokemon: z.string(),
  moves: z.array(z.string()),
});

export type TeraRaidPokemon = z.infer<typeof TeraRaidSchema>;

export const TeraRaidArraySchema = z.array(TeraRaidSchema);

export const MoveInfoSchema = z.object({
  name: z.string(),
  damageClass: z.enum(["physical", "special", "status", "both"]),
  power: z.number().nullable(),
  type: z.string(),
});

export type MoveInfo = z.infer<typeof MoveInfoSchema>;
