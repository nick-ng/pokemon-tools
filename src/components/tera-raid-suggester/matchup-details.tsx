import { useEffect, useState } from "react";
import z from "zod";

import { getMoveByName, pokedex, MoveInfo } from "./pokedex";

interface MatchupDetailsProps {
  pokemon: string;
  moves: string[];
}

export default function MatchupDetails({
  pokemon,
  moves,
}: MatchupDetailsProps) {
  const [moveDetails, setMoveDetails] = useState<MoveInfo[]>([]);

  useEffect(() => {
    (async () => {
      setMoveDetails(await getMoveByName(moves));
    })();
  }, [moves.join(",")]);

  return (
    <div>
      <h3>{pokemon}</h3>
      <pre>{JSON.stringify(moveDetails, null, "  ")}</pre>
    </div>
  );
}
