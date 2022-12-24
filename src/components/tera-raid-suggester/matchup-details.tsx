import { useEffect, useState } from "react";

import type { MoveInfo, PokedexEntry } from "../../services/pokedex/schemas";
import {
  getMovesByName,
  getPokemonByNameWithCache,
} from "../../services/pokedex";

const RAID_STAR_LEVEL_MAP = Object.freeze({
  4: { hpIncrease: 12, level: 45 },
  5: { hpIncrease: 20, level: 75 },
  6: { hpIncrease: 25, level: 90 },
  7: { hpIncrease: 25, level: 100 },
});

interface MatchupDetailsProps {
  pokemon: string;
  moves: string[];
  raidStars: number;
}

export default function MatchupDetails({
  pokemon,
  moves,
  raidStars,
}: MatchupDetailsProps) {
  const [moveDetails, setMoveDetails] = useState<MoveInfo[]>([]);
  const [pokemonDexEntry, setPokemonDexEntry] = useState<PokedexEntry | null>(
    null
  );

  useEffect(() => {
    (async () => {
      Promise.all([
        setMoveDetails(await getMovesByName(moves)),
        setPokemonDexEntry(await getPokemonByNameWithCache(pokemon)),
      ]);
    })();
  }, [moves.join(",")]);

  return (
    <div className="m-1 inline-block border border-gray-300 p-1 align-top">
      <h3>{pokemon} - Stats</h3>
      <pre>{JSON.stringify(pokemonDexEntry, null, "  ")}</pre>
      <details>
        <summary>{pokemon} - Moves</summary>
        <pre>{JSON.stringify(moveDetails, null, "  ")}</pre>
      </details>
    </div>
  );
}
