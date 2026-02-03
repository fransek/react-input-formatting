"use client";

import { createFormat } from "react-input-formatter";

const { useInputState, FormattedInput, formatInput } = createFormat({
  thousandSeparator: ",",
  decimalSeparator: ".",
});

export default function Home() {
  const input = useInputState("12345.67");

  return (
    <main className="flex flex-col items-center gap-4 p-4 pt-20">
      <div>
        <h2 className="font-bold">Controlled Input</h2>
        <label>
          Formatted:{" "}
          <input
            className="border rounded px-1"
            value={input.formatted}
            onChange={input.handleChange}
          />
        </label>
        <div>Raw: &quot;{input.raw}&quot;</div>
        <div>Parsed: {input.parsed}</div>
      </div>

      <div>
        <h2 className="font-bold">Uncontrolled Input</h2>
        <label>
          Formatted:{" "}
          <input className="border rounded px-1" onChange={formatInput} />
        </label>
      </div>

      <div>
        <h2 className="font-bold">Input Component</h2>
        <label>
          Formatted: <FormattedInput className="border rounded px-1" />
        </label>
      </div>
    </main>
  );
}
