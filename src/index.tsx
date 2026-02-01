import React, { forwardRef, InputHTMLAttributes, useState } from "react";
import {
  Format,
  FormatOptions,
  InputProps,
  InputState,
  InputStateSetters,
} from "./types";

export function format(
  raw: string,
  { thousandSeparator = ",", decimalSeparator = "." }: FormatOptions = {},
) {
  const [int = "", frac] = raw.split(".");
  const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return frac == null ? formattedInt : formattedInt + decimalSeparator + frac;
}

export function unformat(
  formatted: string,
  { thousandSeparator = ",", decimalSeparator = "." }: FormatOptions = {},
) {
  let result = formatted
    .replaceAll(thousandSeparator, "")
    .replaceAll(decimalSeparator, ".")
    .replaceAll(/[^\d.-]/g, "") // Remove invalid characters
    .replaceAll(/(?!^)-/g, ""); // Remove misplaced minus signs

  const [int, ...frac] = result.split(".");
  if (frac.length > 0) {
    result = int + "." + frac.join("");
  }

  if (result.startsWith(".")) {
    result = "0" + result;
  } else if (result.startsWith("-.")) {
    result = "-0" + result.substring(1);
  }

  return result;
}

export function parse(raw: string): number | undefined {
  if (raw === "" || raw === "-" || raw === ".") {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function formatInput(
  event: React.ChangeEvent<HTMLInputElement>,
  { thousandSeparator = ",", decimalSeparator = "." }: FormatOptions = {},
): InputState {
  const options = { thousandSeparator, decimalSeparator };
  const value = event.target.value;
  const raw = unformat(value, options);
  const formatted = format(raw, options);
  const parsed = parse(raw);

  const caretPos = event.target.selectionStart ?? 0;

  const calculateCaretOffset = (value: string) => {
    const beforeCaret = value.substring(0, caretPos);
    const beforeCaretRaw = unformat(beforeCaret, options);
    return beforeCaret.length - beforeCaretRaw.length;
  };

  const prevCaretOffset = calculateCaretOffset(value);
  const nextCaretOffset = calculateCaretOffset(formatted);

  const offset = nextCaretOffset - prevCaretOffset;
  const newPos = caretPos + offset;
  event.target.value = formatted;

  requestAnimationFrame(() => event.target.setSelectionRange(newPos, newPos));

  return {
    formatted,
    raw,
    parsed,
  };
}

export function createInputState(
  initialValue: string,
  { thousandSeparator = ",", decimalSeparator = "." }: FormatOptions = {},
): InputState {
  const options = { thousandSeparator, decimalSeparator };
  const raw = unformat(initialValue, options);
  const formatted = format(raw, options);
  const parsed = parse(raw);

  return {
    raw,
    formatted,
    parsed,
  };
}

export function useInputState(
  initialValue: string,
  options: FormatOptions = {},
): InputState & InputStateSetters {
  const [inputState, setInputState] = useState(
    createInputState(initialValue, options),
  );

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const newState = formatInput(event, options);
    setInputState(newState);
  }

  function setRaw(raw: string) {
    setInputState(createInputState(raw, options));
  }

  return {
    ...inputState,
    handleChange,
    setRaw,
  };
}

function validateFormatOptions({
  thousandSeparator = ",",
  decimalSeparator = ".",
}: FormatOptions = {}) {
  if (thousandSeparator === decimalSeparator) {
    throw new Error("Thousand and decimal separators must be different.");
  }
  if (thousandSeparator === "-" || decimalSeparator === "-") {
    throw new Error('Separators cannot be the minus sign ("-").');
  }
}

export function createFormat({
  thousandSeparator = ",",
  decimalSeparator = ".",
}: FormatOptions = {}): Format {
  const options = { thousandSeparator, decimalSeparator };
  validateFormatOptions(options);

  const FormattedInputWrapper = forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement>
  >((props, ref) => <FormattedInput ref={ref} {...props} {...options} />);

  FormattedInputWrapper.displayName = "FormattedInputWrapper";

  return {
    format: (raw) => format(raw, options),
    unformat: (formatted) => unformat(formatted, options),
    parse,
    formatInput: (event) => formatInput(event, options),
    createInputState: (raw) => createInputState(raw, options),
    useInputState: (initialValue: string) =>
      useInputState(initialValue, options),
    FormattedInput: FormattedInputWrapper,
  };
}

export const FormattedInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { decimalSeparator = ".", thousandSeparator = ",", onChange, ...props },
    ref,
  ) => {
    return (
      <input
        {...props}
        ref={ref}
        onChange={(e) => {
          formatInput(e, {
            decimalSeparator,
            thousandSeparator,
          });
          onChange?.(e);
        }}
      />
    );
  },
);

FormattedInput.displayName = "FormattedInput";

export * from "./types";
