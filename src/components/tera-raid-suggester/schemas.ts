import z from "zod";

export const TeraRaidSchema = z.object({
  id: z.string(),
  stars: z.number(),
  pokemon: z.string(),
  moves: z.array(z.string()),
});

export type TeraRaidPokemon = z.infer<typeof TeraRaidSchema>;

export const TeraRaidArraySchema = z.array(TeraRaidSchema);
