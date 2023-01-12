import { useCallback } from "react";

import type { Options } from "../../hooks/options-context";
import type { PokemonType } from "../../schemas";
import { POKEMON_TYPES } from "../../constants";
import {
  EXTRA_IV,
  IV_RANGE,
  getTypeEffectiveness,
  otherStat,
  damage,
  getLargestMin,
  parseIntOrZero,
  capFirst,
} from "../../utils";

type FoulPlayType = Options["foulPlays"][number];

type OneFoulPlayProps = FoulPlayType & {
  maxIV: number;
  onUpdate: (next: FoulPlayType) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
  onDuplicate: (newCatchLevel: number) => void | Promise<void>;
};

export default function OneFoulPlay({
  id,
  note,
  level,
  baseAtk,
  atkNature,
  finalDef,
  catchLevel,
  catchBaseAtk,
  type1,
  type2,
  teraType,
  maxIV,
  onUpdate,
  onRemove,
  onDuplicate,
}: OneFoulPlayProps) {
  const getDamageCalc = useCallback(
    (power: number, stab: number, typeEffectiveness: number) => (n: number) =>
      damage(
        power,
        otherStat(baseAtk, level, n, 0, atkNature),
        finalDef,
        stab,
        typeEffectiveness,
        level
      ).reduce((prev, curr, _i, a) => prev + curr / a.length, 0),
    [baseAtk, level, atkNature, finalDef]
  );
  const damageCalcs = {
    foulPlayNoStab: getLargestMin(
      0,
      31,
      getDamageCalc(95, 1, getTypeEffectiveness("dark", [type1, type2]))
    ),
    foulPlayStab: getLargestMin(
      0,
      31,
      getDamageCalc(95, 1.5, getTypeEffectiveness("dark", [type1, type2]))
    ),
    foulPlayTeraStab: getLargestMin(
      0,
      31,
      getDamageCalc(95, 2, getTypeEffectiveness("dark", [type1, type2]))
    ),
    foulPlayNoStabVsTera: getLargestMin(
      0,
      31,
      getDamageCalc(95, 1, getTypeEffectiveness("dark", [teraType]))
    ),
    foulPlayStabVsTera: getLargestMin(
      0,
      31,
      getDamageCalc(95, 1.5, getTypeEffectiveness("dark", [teraType]))
    ),
    foulPlayTeraStabVsTera: getLargestMin(
      0,
      31,
      getDamageCalc(95, 2, getTypeEffectiveness("dark", [teraType]))
    ),
  };

  const foulPlayIV = Math.min(
    ...Object.values(damageCalcs).map((dc) => dc.highestInput)
  );

  const { highestInput: confusionIV, lowestOutput: confusionDamage } =
    getLargestMin(0, 31, getDamageCalc(40, 1, 1));

  const catchDecrease = {
    max: otherStat(catchBaseAtk || baseAtk, catchLevel, foulPlayIV, 0, 0.9),
    over: otherStat(
      catchBaseAtk || baseAtk,
      catchLevel,
      foulPlayIV + 1,
      0,
      0.9
    ),
  };

  const catchDecreaseWarn =
    catchDecrease.max === catchDecrease.over ? catchDecrease.over : -1;

  const catchNeutral = {
    max: otherStat(catchBaseAtk || baseAtk, catchLevel, foulPlayIV, 0, 1),
    over: otherStat(catchBaseAtk || baseAtk, catchLevel, foulPlayIV + 1, 0, 1),
  };

  const catchNeutralWarn =
    catchNeutral.max === catchNeutral.over ? catchNeutral.over : -1;

  const catchIncrease = {
    max: otherStat(catchBaseAtk || baseAtk, catchLevel, foulPlayIV, 0, 1.1),
    over: otherStat(
      catchBaseAtk || baseAtk,
      catchLevel,
      foulPlayIV + 1,
      0,
      1.1
    ),
  };

  const catchIncreaseWarn =
    catchIncrease.max === catchIncrease.over ? catchIncrease.over : -1;

  return (
    <div className="border-default m-1 inline-block p-1 align-top">
      <div className="flex w-[204px] flex-row justify-start">
        <div className="flex-shrink">
          <input
            className="inline-block w-full rounded-r-none"
            type="text"
            value={note}
            onChange={(e) => {
              onUpdate({
                id,
                note: e.target.value,
                level,
                baseAtk,
                atkNature,
                finalDef,
                catchLevel,
                catchBaseAtk,
                type1,
                type2,
                teraType,
              });
            }}
          />
        </div>
        <button
          className="border-default my-0.5 inline-block rounded-r bg-white px-2 dark:bg-gray-800"
          onClick={() => {
            if (confirm(`Remove ${note}?`)) {
              onRemove();
            }
          }}
        >
          X
        </button>
      </div>
      <table>
        <tbody>
          <tr>
            <td className="border-default px-1 py-0 text-right"></td>
            <td className="border-default px-1 py-0 text-right">Catch</td>
            <td className="border-default px-1 py-0 text-right">Final</td>
          </tr>
          <tr>
            <td className="border-default px-1 py-0 text-right">Level</td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={catchLevel}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    level,
                    baseAtk,
                    atkNature,
                    finalDef,
                    catchLevel: parseIntOrZero(e.target.value),
                    catchBaseAtk,
                    type1,
                    type2,
                    teraType,
                  });
                }}
              />
            </td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={level}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    level: parseIntOrZero(e.target.value),
                    baseAtk,
                    atkNature,
                    finalDef,
                    catchLevel,
                    catchBaseAtk,
                    type1,
                    type2,
                    teraType,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="border-default px-1 py-0 text-right">Base Atk</td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={catchBaseAtk || baseAtk}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    level,
                    baseAtk,
                    atkNature,
                    finalDef,
                    catchLevel,
                    catchBaseAtk: parseIntOrZero(e.target.value),
                    type1,
                    type2,
                    teraType,
                  });
                }}
              />
            </td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={baseAtk}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    level,
                    baseAtk: parseIntOrZero(e.target.value),
                    atkNature,
                    finalDef,
                    catchLevel,
                    catchBaseAtk,
                    type1,
                    type2,
                    teraType,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="border-default px-1 py-0 text-right" colSpan={2}>
              Def Stat (not base)
            </td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={finalDef}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    level,
                    baseAtk,
                    atkNature,
                    finalDef: parseIntOrZero(e.target.value),
                    catchLevel,
                    catchBaseAtk,
                    type1,
                    type2,
                    teraType,
                  });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <label className="flex justify-between">
        <span>Atk Nature:</span>
        <select
          value={atkNature}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              level,
              baseAtk,
              atkNature: parseFloat(e.target.value),
              finalDef,
              catchLevel,
              catchBaseAtk,
              type1,
              type2,
              teraType,
            });
          }}
        >
          <option value={0.9}>Decrease</option>
          <option value={1}>Neutral</option>
          <option value={1.1}>Increase</option>
        </select>
      </label>
      <label className="flex justify-between">
        <span>Type 1</span>
        <select
          value={type1}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              level,
              baseAtk,
              atkNature,
              finalDef,
              catchLevel,
              catchBaseAtk,
              type1: e.target.value as PokemonType,
              type2,
              teraType,
            });
          }}
        >
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {capFirst(t)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex justify-between">
        <span>Type 2</span>
        <select
          value={type2 || "none"}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              level,
              baseAtk,
              atkNature,
              finalDef,
              catchLevel,
              catchBaseAtk,
              type1,
              type2: e.target.value as PokemonType,
              teraType,
            });
          }}
        >
          <option value="none">None</option>
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {capFirst(t)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex justify-between">
        <span>Tera Type</span>
        <select
          value={teraType}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              level,
              baseAtk,
              atkNature,
              finalDef,
              catchLevel,
              catchBaseAtk,
              type1,
              type2,
              teraType: e.target.value as PokemonType,
            });
          }}
        >
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {capFirst(t)}
            </option>
          ))}
        </select>
      </label>
      <table className="m-auto">
        <thead>
          <tr>
            <th className="border-default px-1 py-0 text-center" rowSpan={2}>
              IV
            </th>
            <th className="border-default px-1 py-0 text-center" rowSpan={2}>
              Confusion
              <br />
              Damage
            </th>
            <th className="border-default px-1 py-0 text-center" rowSpan={2}>
              STAB
              <br />
              Foul Play
            </th>
            <th className="border-default px-1 py-0 text-center" colSpan={3}>
              Catch@{catchLevel}
            </th>
          </tr>
          <tr>
            <th className="border-default px-1 py-0 text-center">🔽</th>
            <th className="border-default px-1 py-0 text-center">⏺️</th>
            <th className="border-default px-1 py-0 text-center">🔼</th>
          </tr>
        </thead>
        <tbody>
          {IV_RANGE.filter(
            (iv) => iv <= Math.max(maxIV, foulPlayIV + EXTRA_IV)
          ).map((iv) => {
            const decreaseCatchStat = otherStat(
              catchBaseAtk || baseAtk,
              catchLevel,
              iv,
              0,
              0.9
            );
            const neutralCatchStat = otherStat(
              catchBaseAtk || baseAtk,
              catchLevel,
              iv,
              0,
              1
            );
            const increaseCatchStat = otherStat(
              catchBaseAtk || baseAtk,
              catchLevel,
              iv,
              0,
              1.1
            );
            return (
              <tr
                className={
                  iv === foulPlayIV || iv === confusionIV
                    ? "bg-blue-100 dark:bg-blue-900"
                    : ""
                }
                key={iv}
              >
                <td className="border-default px-2 py-0 text-center">{iv}</td>
                <td className="border-default px-2 py-0 text-center">
                  {Math.round(getDamageCalc(40, 1, 1)(iv) * 10) / 10}
                </td>
                <td className="border-default px-2 py-0 text-center">
                  {Math.round(
                    getDamageCalc(
                      95,
                      1.5,
                      getTypeEffectiveness("dark", [type1, type2])
                    )(iv) * 10
                  ) / 10}
                </td>
                <td
                  className={`border-default px-2 py-0 text-center ${
                    decreaseCatchStat === catchDecreaseWarn
                      ? "bg-red-300 dark:bg-red-700"
                      : ""
                  }`}
                >
                  {decreaseCatchStat}
                </td>
                <td
                  className={`border-default px-2 py-0 text-center ${
                    neutralCatchStat === catchNeutralWarn
                      ? "bg-red-300 dark:bg-red-700"
                      : ""
                  }`}
                >
                  {neutralCatchStat}
                </td>
                <td
                  className={`border-default px-2 py-0 text-center ${
                    increaseCatchStat === catchIncreaseWarn
                      ? "bg-red-300 dark:bg-red-700"
                      : ""
                  }`}
                >
                  {increaseCatchStat}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
