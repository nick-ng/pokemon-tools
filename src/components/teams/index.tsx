import type { Team, Pokemon, Move } from "./types";

import { useState } from "react";
import z from "zod";
import { loadTeams, saveTeam } from "./types";

const SELECTED_ID_KEY = "PUX_POKEMON_SELECTED_ID";

export default function TeamHints() {
	const [teams, setTeams] = useState(loadTeams());
	const [selectedId, setSelectedId] = useState(localStorage.getItem(SELECTED_ID_KEY));

	const selectedTeam = teams.find((t) => t.id === selectedId);

	return (
		<div>
			<h2>Team Hints</h2>
			<p>Tailored type effectiveness notes for your teams</p>
		</div>
	);
}
