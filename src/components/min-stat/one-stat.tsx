import { IV_RANGE, otherStat } from "../../utils";

export interface MinIVProps {
  id: string;
  note: string;
  baseStat: number;
  level: number;
  nature: number;
  catchLevel: number;
  maxIV: number;
  onUpdate: (next: {
    id: string;
    note: string;
    baseStat: number;
    level: number;
    nature: number;
    catchLevel: number;
  }) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
}

export default function OneIV({
  id,
  note,
  baseStat,
  level,
  nature,
  catchLevel,
  maxIV,
  onUpdate,
  onRemove,
}: MinIVProps) {
  const minStat = otherStat(baseStat, level, 0, 0, nature);

  return (
    <div className="m-1 inline-block border border-gray-300 p-1 align-top">
      <input
        className="w-full rounded border border-gray-300 px-1 dark:bg-gray-800"
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
          });
        }}
      />
      <label className="flex justify-between">
        <span>Base Stat:</span>
        <input
          className="w-14"
          type="number"
          value={baseStat}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat: parseInt(e.target.value),
              level,
              nature,
              catchLevel,
            });
          }}
        />
      </label>
      <label className="flex justify-between">
        <span>Nature:</span>
        <select
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat,
              level,
              nature: parseFloat(e.target.value),
              catchLevel,
            });
          }}
        >
          <option value={0.9}>Decrease</option>
          <option value={1}>Neutral</option>
          <option value={1.1}>Increase</option>
        </select>
      </label>
      <label className="flex justify-between">
        <span>Final Level:</span>
        <input
          className="w-14"
          type="number"
          value={level}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat,
              level: parseInt(e.target.value),
              nature,
              catchLevel,
            });
          }}
        />
      </label>
      <label className="flex justify-between">
        <span>Catch Level:</span>
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
              catchLevel: parseInt(e.target.value),
            });
          }}
        />
      </label>
      <button
        className="my-2 rounded-lg border border-gray-500 p-1"
        onClick={() => {
          if (confirm(`Remove ${note}?`)) {
            onRemove();
          }
        }}
      >
        Remove
      </button>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-500 px-1 py-0 text-right">IV</th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{level}
            </th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{catchLevel}-
            </th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{catchLevel}
            </th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{catchLevel}+
            </th>
          </tr>
        </thead>
        <tbody>
          {IV_RANGE.filter((iv) => iv <= maxIV).map((iv) => {
            const stat = otherStat(baseStat, level, iv, 0, nature);
            return (
              <tr
                className={
                  stat === minStat ? "bg-blue-100 dark:bg-blue-900" : ""
                }
                key={iv}
              >
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {iv}
                </td>
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {stat}
                </td>
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {otherStat(baseStat, catchLevel, iv, 0, 0.9)}
                </td>
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {otherStat(baseStat, catchLevel, iv, 0, 1)}
                </td>
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {otherStat(baseStat, catchLevel, iv, 0, 1.1)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
