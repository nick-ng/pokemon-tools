import { useEffect, useState } from "react";

import { TeraRaidPokemon, TeraRaidArraySchema } from "./schemas";
import MatchupDetails from "./matchup-details";

export default function TeraRaidSuggester() {
  const [raidPokemon, setRaidPokemon] = useState<TeraRaidPokemon[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res6 = await fetch("/serebii-6-star-raid.json");
        const resJSON6 = await res6.json();
        const tempPokemon6 = TeraRaidArraySchema.parse(resJSON6);

        setRaidPokemon(tempPokemon6);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      {raidPokemon.map((p) => (
        <MatchupDetails key={p.id} pokemon={p.pokemon} moves={p.moves} />
      ))}
    </div>
  );
}
