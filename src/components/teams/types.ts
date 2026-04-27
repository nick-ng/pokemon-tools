import z from "zod";

export const moveSchema = z.object({
	name: z.string(),
	types: z.array(z.string()),
	side: z.literal(["physical", "special", "status"]),
});
export type Move = z.infer<typeof moveSchema>;

export const pokemonSchema = z.object({
	species: z.string(),
	types: z.array(z.string()),
	moves: z.array(moveSchema),
	notes: z.string(),
});
export type Pokemon = z.infer<typeof pokemonSchema>;

export const teamSchema = z.object({
	id: z.string(),
	name: z.string(),
	replicaCode: z.string().optional(),
	pasteUrl: z.string().optional(),
	notes: z.string().optional(),
	pokemon: z.array(pokemonSchema),
});
export type Team = z.infer<typeof teamSchema>;

const STORE_KEY = "PUX_POKEMON_TEAMS";
const teamsSchema = z.array(teamSchema);

export const loadTeams = (): Team[] => {
	try {
		const temp = localStorage.getItem(STORE_KEY);
		if (temp) {
			const unknownTeams = JSON.parse(temp);
			const result = teamsSchema.parse(unknownTeams);

			return result;
		}
	} catch (e) {
		console.error("error loading teams", e);
	}

	return [];
};

/**
 * Do not try to manually set the id on the newTeam
 */
export const saveTeam = (
	newTeam: Team,
	callback?: (newTeams: Team[], newTeamId: string) => void | Promise<void>
) => {
	const oldTeamId = newTeam.id; // new team should have default or old team ID
	const newTeamId = newTeam.replicaCode || newTeam.pasteUrl || oldTeamId;

	const oldTeams = loadTeams();
	const newTeams = oldTeams.filter((team) => team.id !== oldTeamId).concat([newTeam]);
	localStorage.setItem(STORE_KEY, JSON.stringify(newTeams));
	if (typeof callback === "function") {
		callback(newTeams, newTeamId);
	}
};
