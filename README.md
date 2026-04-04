# react-input-formatting

A React library for formatting numeric inputs with configurable thousand and decimal separators.

## Installation

```bash
npm install react-input-formatting
```

## Usage

### `FormattedInput` component

Drop-in replacement for `<input>` that formats the value as the user types.

```tsx
import { FormattedInput } from "react-input-formatting";

<FormattedInput />
// => formats with default separators: "1,234.56"
```

### `useInputState` hook

Controlled input with access to `raw`, `formatted`, and `parsed` values.

```tsx
import { useInputState } from "react-input-formatting";

function MyInput() {
  const { formatted, parsed, handleChange, setRaw } = useInputState("1234.56");

  return <input value={formatted} onChange={handleChange} />;
}
```

### `createFormat` — custom separators

Creates a set of utilities pre-configured with your separators.

```tsx
import { createFormat } from "react-input-formatting";

const format = createFormat({ thousandSeparator: " ", decimalSeparator: "," });

// "1 234,56"
format.format("1234.56");

// Formatted <input> component
<format.FormattedInput />

// Hook
const { formatted, parsed, handleChange } = format.useInputState("1234.56");
```

### Utility functions

All functions are also exported individually and use default separators (`,` / `.`).

| Function | Description |
|---|---|
| `format(raw, options?)` | Formats a raw number string |
| `unformat(formatted, options?)` | Strips separators, returns raw string |
| `parse(raw)` | Parses raw string to `number \| undefined` |
| `formatInput(event, options?)` | Formats an input change event, returns `InputState` |
| `createInputState(raw, options?)` | Creates an `InputState` from a raw string |

## Data model

Every API works with the same `InputState` shape:

```ts
interface InputState {
  raw: string;        // plain number string, always uses "." as decimal
  formatted: string;  // display string with configured separators
  parsed: number | undefined; // undefined for incomplete input ("", "-", ".")
}
```

## `FormatOptions`

| Option | Default | Description |
|---|---|---|
| `thousandSeparator` | `","` | Character used to group thousands |
| `decimalSeparator` | `"."` | Character used as decimal point |

The two separators must be different characters and neither can be `"-"`.
