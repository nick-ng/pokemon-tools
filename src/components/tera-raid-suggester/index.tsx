import { useEffect, useState } from "react";

import type { TeraRaidPokemon } from "../../services/pokedex/schemas";

import { useOptions } from "../../hooks/options-context";
import { TeraRaidArraySchema } from "../../services/pokedex/schemas";
import MatchupDetails from "./matchup-details";
import YourPokemon from "./your-pokemon";

export default function TeraRaidSuggester() {
  const { options, setOptions } = useOptions();
  const [raidPokemon, setRaidPokemon] = useState<TeraRaidPokemon[]>([]);
  const { raidYourPokemon } = options;

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
      <details>
        <summary className="text-xl">Your Pokemon</summary>
        <div>
          {raidYourPokemon.map((yp, i) => (
            <YourPokemon
              key={yp.id}
              yourRaidPokemon={yp}
              onChange={(newPokemon) => {
                const temp = [...raidYourPokemon];
                temp[i] = newPokemon;
                setOptions({ raidYourPokemon: temp });
              }}
              onDelete={() => {
                setOptions({
                  raidYourPokemon: raidYourPokemon.filter(
                    (a) => a.id !== yp.id
                  ),
                });
              }}
            />
          ))}
          <button
            className="m-1 rounded-lg border border-gray-500 p-2 align-top"
            onClick={() => {
              setOptions({
                raidYourPokemon: raidYourPokemon.concat({
                  id: `pokemon-${Date.now()}-${raidYourPokemon.length}`,
                  pokemon: {
                    name: `Pokemon ${raidYourPokemon.length + 1}`,
                    types: ["normal"],
                    teraType: "normal",
                    ability: "n/a",
                    finalStats: {
                      hp: 0,
                      atk: 0,
                      def: 0,
                      spa: 0,
                      spd: 0,
                      spe: 0,
                    },
                  },
                  mainMoves: [
                    {
                      id: `move-${Date.now()}-0`,
                      name: "Move 1",
                      damageClass: "physical",
                      power: 80,
                      type: "normal",
                    },
                  ],
                }),
              });
            }}
          >
            Add Pokemon
          </button>
        </div>
      </details>
      <h2>Raid Pokemon</h2>
      <div>
        {raidPokemon.map((p) => (
          <MatchupDetails
            key={p.id}
            pokemon={p.pokemon}
            moves={p.moves}
            raidStars={p.stars}
          />
        ))}
      </div>
    </div>
  );
}
