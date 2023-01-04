import { useEffect, useState } from "react";

import { PokemonTypeSchema, TeraRaidPokemon } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { TeraRaidArraySchema } from "../../schemas";
import { POKEMON_TYPES } from "../../constants";
import { capFirst } from "../../utils";
import MatchupDetails from "./matchup-details";
import YourPokemon from "./your-pokemon";

const fetchRaidJSON = async (url: string) => {
  try {
    const res6 = await fetch(url);
    const resJSON6 = await res6.json();
    const tempPokemon6 = TeraRaidArraySchema.parse(resJSON6);

    return tempPokemon6;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default function TeraRaidSuggester() {
  const { options, setOptions } = useOptions();

  const { raidYourPokemon, raidTeraType, raidAttackAdjustment } = options;

  const [raidPokemon, setRaidPokemon] = useState<TeraRaidPokemon[]>([]);
  const [raidFilter, setRaidFilter] = useState("");

  useEffect(() => {
    (async () => {
      const raids = await Promise.all([
        fetchRaidJSON("/serebii-6-star-raid.json"),
        fetchRaidJSON("/serebii-5-star-raid.json"),
        fetchRaidJSON("/serebii-4-star-raid.json"),
      ]);

      setRaidPokemon(raids.flat());
    })();
  }, []);

  return (
    <div>
      <details className="inline-block">
        <summary className="text-xl">Your Pokemon</summary>
        <div>
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
        </div>
      </details>
      <h2>Raid Pokemon</h2>
      <div className="inline-block">
        <label className="flex justify-between">
          <span className="mr-1">Tera Type:</span>
          <select
            value={raidTeraType}
            onChange={(e) => {
              setOptions({
                raidTeraType: PokemonTypeSchema.parse(e.target.value),
              });
            }}
          >
            {POKEMON_TYPES.map((t) => {
              return (
                <option key={t} value={t}>
                  {capFirst(t)}
                </option>
              );
            })}
          </select>
        </label>
        <label className="flex justify-between">
          <span className="mr-1">Attack Adjustment:</span>
          <input
            className="w-14"
            type="number"
            value={raidAttackAdjustment}
            onChange={(e) => {
              setOptions({ raidAttackAdjustment: parseInt(e.target.value) });
            }}
          />
        </label>
        <label className="flex justify-between">
          <span className="mr-1">Filter:</span>
          <input
            type="text"
            value={raidFilter}
            onChange={(e) => {
              setRaidFilter(e.target.value);
            }}
          />
        </label>
      </div>
      <details className="ml-2 inline-block max-w-xl align-top">
        <summary>Help/Info</summary>
        <p className="mt-1">
          You can use the filter to narrow down what raid Pokemon are shown.
        </p>
        <p className="mt-1">
          You can customise your Pokemon by expanding the "Your Pokemon"
          section. Some example Pokemon are already there. You should remove the
          Pokemon you don't have and add Pokemon you do have or change the
          existing Pokemon to better match what you have.
        </p>
        <p className="mt-1">
          Ratings assume neither Pokemon boosts/lowers each others stats. If
          your Pokemon has a boosting move or can lower the raid Pokemon's
          stats, you can increase power of its main move to simulate the
          difference.
        </p>
        <p className="mt-1">
          All the moves the raid Pokemon and your Pokemon know are compared
          taking type(s), tera type, and stats into account.
        </p>
        <p className="mt-1">
          Defense is the number of attacks your Pokemon can take if the raid
          Pokemon uses its most damaging attack.
        </p>
        <p className="mt-1">
          Attack is higher if your Pokemon deals more damage. You can adjust the
          bias between attack and defense by changing the "Attack Adjustment"
          value.
        </p>
        <p className="mt-1">
          The formula I've used is:
          <pre>
            (attack adjustment * raid Pokemon's HP) / your Pokemon's most
            damaging move
          </pre>
        </p>
        <p className="mt-1">
          Raid Pokemon's moves are from Serebii's{" "}
          <a
            href="https://serebii.net/scarletviolet/teraraidbattles/4star.shtml"
            target="_blank"
          >
            4 star
          </a>
          ,{" "}
          <a
            href="https://serebii.net/scarletviolet/teraraidbattles/5star.shtml"
            target="_blank"
          >
            5 star
          </a>
          , and{" "}
          <a
            href="https://serebii.net/scarletviolet/teraraidbattles/6star.shtml"
            target="_blank"
          >
            6 star
          </a>{" "}
          pages. Pokemon and move stats are from{" "}
          <a href="https://pokeapi.co/" target="_blank">
            Pok&#xE9;API
          </a>{" "}
          and{" "}
          <a href="https://pokemondb.net/" target="_blank">
            Pokémon Database
          </a>
          <p></p>
        </p>
      </details>
      <div>
        {raidPokemon
          .filter(
            (r) =>
              !raidFilter ||
              r.pokemon.toLowerCase().includes(raidFilter.toLowerCase())
          )
          .map((p) => (
            <MatchupDetails
              key={p.id}
              pokemon={p.pokemon}
              moves={p.moves}
              raidStars={p.stars}
              raidTeraType={raidTeraType}
              yourPokemon={raidYourPokemon}
              attackAdjustment={raidAttackAdjustment}
            />
          ))}
      </div>
    </div>
  );
}
