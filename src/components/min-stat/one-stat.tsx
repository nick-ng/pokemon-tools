import { IV_RANGE, otherStat, parseIntOrZero } from "../../utils";

const EXTRA_IV = 2;

const getHighestAcceptableIV = (
  baseStat: number,
  level: number,
  nature: number
) => {
  const minStat = otherStat(baseStat, level, 0, 0, nature);

  for (let iv = 1; iv < 32; iv++) {
    const tempStat = otherStat(baseStat, level, iv, 0, nature);
    if (tempStat > minStat) {
      return iv - 1;
    }
  }

  return 0;
};

interface MinIVProps {
  id: string;
  note: string;
  baseStat: number;
  level: number;
  nature: number;
  catchLevel: number;
  catchBaseStat?: number | null;
  maxIV: number;
  onUpdate: (next: {
    id: string;
    note: string;
    baseStat: number;
    level: number;
    nature: number;
    catchLevel: number;
    catchBaseStat?: number | null;
  }) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
  onDuplicate: (newCatchLevel: number) => void | Promise<void>;
}

export default function OneIV({
  id,
  note,
  baseStat,
  level,
  nature,
  catchLevel,
  catchBaseStat,
  maxIV,
  onUpdate,
  onRemove,
  onDuplicate,
}: MinIVProps) {
  const minStat = otherStat(baseStat, level, 0, 0, nature);
  const highestAcceptableIV = getHighestAcceptableIV(baseStat, level, nature);

  const catchDecrease = {
    max: otherStat(
      catchBaseStat || baseStat,
      catchLevel,
      highestAcceptableIV,
      0,
      0.9
    ),
    over: otherStat(
      catchBaseStat || baseStat,
      catchLevel,
      highestAcceptableIV + 1,
      0,
      0.9
    ),
  };

  const catchDecreaseWarn =
    catchDecrease.max === catchDecrease.over ? catchDecrease.over : -1;

  const catchNeutral = {
    max: otherStat(
      catchBaseStat || baseStat,
      catchLevel,
      highestAcceptableIV,
      0,
      1
    ),
    over: otherStat(
      catchBaseStat || baseStat,
      catchLevel,
      highestAcceptableIV + 1,
      0,
      1
    ),
  };

  const catchNeutralWarn =
    catchNeutral.max === catchNeutral.over ? catchNeutral.over : -1;

  const catchIncrease = {
    max: otherStat(
      catchBaseStat || baseStat,
      catchLevel,
      highestAcceptableIV,
      0,
      1.1
    ),
    over: otherStat(
      catchBaseStat || baseStat,
      catchLevel,
      highestAcceptableIV + 1,
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
                baseStat,
                level,
                nature,
                catchLevel,
                catchBaseStat,
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
                    baseStat,
                    level,
                    nature,
                    catchLevel: parseIntOrZero(e.target.value),
                    catchBaseStat,
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
                    baseStat,
                    level: parseIntOrZero(e.target.value),
                    nature,
                    catchLevel,
                    catchBaseStat,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <td className="border-default px-1 py-0 text-right">Base Stat</td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={catchBaseStat || baseStat}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    baseStat,
                    level,
                    nature,
                    catchLevel,
                    catchBaseStat: parseIntOrZero(e.target.value),
                  });
                }}
              />
            </td>
            <td className="border-default px-1 py-0 text-right">
              <input
                className="w-14"
                type="number"
                value={baseStat}
                onChange={(e) => {
                  onUpdate({
                    id,
                    note,
                    baseStat: parseIntOrZero(e.target.value),
                    level,
                    nature,
                    catchLevel,
                    catchBaseStat,
                  });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <label className="flex justify-between">
        <span>Final Nature:</span>
        <select
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat,
              level,
              nature: parseFloat(e.target.value),
              catchLevel,
              catchBaseStat,
            });
          }}
        >
          <option value={0.9}>Decrease</option>
          <option value={1}>Neutral</option>
          <option value={1.1}>Increase</option>
        </select>
      </label>
      <div className="flex justify-between">
        <button
          className="border-default my-2 rounded-lg p-1"
          onClick={() => {
            onDuplicate(catchLevel);
          }}
        >
          Copy
        </button>
        <button
          className="border-default my-2 rounded-lg p-1"
          onClick={() => {
            onDuplicate(catchLevel + 1);
          }}
        >
          Copy (Level {catchLevel + 1})
        </button>
      </div>
      <table className="m-auto">
        <thead>
          <tr>
            <th className="border-default px-1 py-0 text-center" rowSpan={2}>
              IV
            </th>
            <th className="border-default px-1 py-0 text-center" rowSpan={2}>
              @{level}
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
            (iv) => iv <= Math.max(maxIV, highestAcceptableIV + EXTRA_IV)
          ).map((iv) => {
            const stat = otherStat(baseStat, level, iv, 0, nature);
            const decreaseCatchStat = otherStat(
              catchBaseStat || baseStat,
              catchLevel,
              iv,
              0,
              0.9
            );
            const neutralCatchStat = otherStat(
              catchBaseStat || baseStat,
              catchLevel,
              iv,
              0,
              1
            );
            const increaseCatchStat = otherStat(
              catchBaseStat || baseStat,
              catchLevel,
              iv,
              0,
              1.1
            );
            return (
              <tr
                className={
                  stat === minStat ? "bg-blue-100 dark:bg-blue-900" : ""
                }
                key={iv}
              >
                <td className="border-default px-2 py-0 text-center">{iv}</td>
                <td className="border-default px-2 py-0 text-center">{stat}</td>
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
