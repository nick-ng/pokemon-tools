import { useEffect } from "react";

import { useOptions } from "../../hooks/options-context";
import { getLinkTradeCode } from "./utils";

export default function LinkTradeCode() {
  const { options, setOptions } = useOptions();

  const { linkTradeCode } = options;

  useEffect(() => {
    if (typeof linkTradeCode !== "number") {
      setOptions({ linkTradeCode: getLinkTradeCode() });
    }
  }, [linkTradeCode]);

  const linkTradeCodeString = linkTradeCode?.toString().padStart(8, "0");

  return (
    <div>
      <h1>Link Trade Code</h1>
      <p>
        A random link trade code that isn't one of the "version exclusive" trade
        codes from{" "}
        <a href="https://www.youtube.com/watch?v=iqeuYcwF1xU" target="_blank">
          Austin John's video
        </a>
      </p>
      {typeof linkTradeCode === "number" && (
        <table className="my-1">
          <tbody>
            <tr>
              <td className="border-default px-1">4-digit</td>
              <td className="border-default px-1 font-mono">
                {linkTradeCodeString?.slice(0, 4)}
              </td>
            </tr>
            <tr>
              <td className="border-default px-1">8-digit</td>
              <td className="border-default px-1 font-mono">
                {linkTradeCodeString?.slice(0, 4)}{" "}
                {linkTradeCodeString?.slice(4)}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <button
        className="my-2 rounded-lg border border-gray-500 p-1 align-top"
        onClick={() => {
          setOptions({ linkTradeCode: getLinkTradeCode() });
        }}
      >
        New Trade Code
      </button>
    </div>
  );
}
