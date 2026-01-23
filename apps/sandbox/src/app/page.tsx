"use client";

import { useState } from "react";
import { createFormat } from "react-input-formatter";

const { initializeState, formatAndPositionCaret } = createFormat();

export default function Home() {
  const [input, setInput] = useState(initializeState("123456.7890"));
  return (
    <div className="p-4">
      <label htmlFor="formatted">Formatted: </label>
      <input
        id="formatted"
        className="border  rounded px-1"
        value={input.formatted}
        onChange={(e) => setInput(formatAndPositionCaret(e))}
      />
      <div>Raw: "{input.raw}"</div>
      <div>Parsed: {input.parsed}</div>
    </div>
  );
}
