import { useEffect, useState } from "react";

import type { MoveInfo } from "./schemas";
import { getMovesByName } from "./pokedex";

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
      setMoveDetails(await getMovesByName(moves));
    })();
  }, [moves.join(",")]);

  return (
    <div>
      <h3>{pokemon}</h3>
      <pre>{JSON.stringify(moveDetails, null, "  ")}</pre>
    </div>
  );
}
