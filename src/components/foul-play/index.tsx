import { useOptions } from "../../hooks/options-context";
import OneFoulPlay from "./one-foul-play";

export default function FoulPlay() {
  const {
    options: { foulPlays, minIVMaxShow },
    setOptions,
  } = useOptions();

  return (
    <div>
      <h2>Foul Play</h2>
      <label className="m-1 inline-block cursor-pointer select-none rounded-lg border border-gray-500 p-1">
        Show All IVs:{" "}
        <input
          className=""
          checked={minIVMaxShow === 31}
          type="checkbox"
          onChange={() => {
            setOptions({
              minIVMaxShow: minIVMaxShow < 31 ? 31 : 0,
            });
          }}
        />
      </label>
      <button
        className="my-1 rounded-lg border border-gray-500 p-1 align-top"
        onClick={() => {
          setOptions({
            foulPlays: [
              ...foulPlays,
              {
                id: `${Date.now()}-${foulPlays.length}`,
                note: `New ${foulPlays.length + 1}`,
                level: 50,
                baseAtk: 50,
                atkNature: 0.9,
                finalDef: 200,
                catchLevel: 50,
                catchBaseAtk: 30,
                type1: "normal",
                type2: "none",
                teraType: "normal",
              },
            ],
          });
        }}
      >
        New Pokemon
      </button>
      <div>
        {foulPlays.map(
          (
            {
              id,
              note,
              baseAtk,
              atkNature,
              catchLevel,
              finalDef,
              level,
              teraType,
              type1,
              type2,
              catchBaseAtk,
            },
            i
          ) => (
            <OneFoulPlay
              key={id}
              id={id}
              note={note}
              baseAtk={baseAtk}
              atkNature={atkNature}
              catchLevel={catchLevel}
              finalDef={finalDef}
              level={level}
              teraType={teraType}
              type1={type1}
              type2={type2}
              catchBaseAtk={catchBaseAtk}
              maxIV={minIVMaxShow}
              onUpdate={(newPokemon) => {
                const temp = [...foulPlays];
                temp[i] = newPokemon;
                setOptions({ foulPlays: temp });
              }}
              onDuplicate={() => {}}
              onRemove={() => {}}
            />
          )
        )}
      </div>
      <p className="max-w-2xl">
        Since Pokemon are leveled to 50 for VGC battles, you often don't need
        your Pokemon's Speed or Attack IV to be exactly 0.
      </p>
      <p className="max-w-2xl">
        This shows you what stat range your caught Pokemon need to have in order
        to have the minimum Atk/Spe/etc. stat at level 50.
      </p>
      <details>
        <summary>Tips</summary>
        <p>
          If the Pokemon you're catching have a range of levels, you can create
          multiple Pokemon with different catch levels.
        </p>
      </details>
    </div>
  );
}
