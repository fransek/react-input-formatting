export interface InputState {
  raw: string;
  formatted: string;
  parsed: number;
  isValid: boolean;
}

export function format(
  raw: string,
  thousandSeparator = ",",
  decimalSeparator = ".",
) {
  const [int = "", frac] = raw.split(".");
  const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return frac == null ? formattedInt : formattedInt + decimalSeparator + frac;
}

export function unformat(
  formatted: string,
  thousandSeparator = ",",
  decimalSeparator = ".",
) {
  return formatted
    .replaceAll(thousandSeparator, "")
    .replace(decimalSeparator, ".");
}

export function formatAndPositionCaret(
  e: React.ChangeEvent<HTMLInputElement>,
  thousandSeparator = ",",
  decimalSeparator = ".",
): InputState {
  const value = e.target.value;
  const raw = unformat(value, thousandSeparator, decimalSeparator);
  const formatted = format(raw, thousandSeparator, decimalSeparator);
  const parsed = Number(raw);
  const isValid = !Number.isNaN(parsed);

  const caretPos = e.target.selectionStart ?? 0;

  const previousSubstring = value.substring(0, caretPos);
  const newSubstring = formatted.substring(0, caretPos);

  const previousSeparatorCount =
    previousSubstring.split(thousandSeparator).length - 1;
  const newSeparatorCount = newSubstring.split(thousandSeparator).length - 1;

  const offset = newSeparatorCount - previousSeparatorCount;

  requestAnimationFrame(() => {
    e.target.setSelectionRange(caretPos + offset, caretPos + offset);
  });

  return {
    formatted,
    raw,
    parsed,
    isValid,
  };
}

export function createFormat(thousandSeparator = ",", decimalSeparator = ".") {
  if (thousandSeparator === decimalSeparator) {
    throw new Error("Thousand and decimal separators must be different.");
  }
  if (thousandSeparator.length !== 1 || decimalSeparator.length !== 1) {
    throw new Error("Separators must be a single character.");
  }
  if (thousandSeparator === "-" || decimalSeparator === "-") {
    throw new Error('Separators cannot be the minus sign ("-").');
  }

  return {
    format: (raw: string) => format(raw, thousandSeparator, decimalSeparator),
    parse: (formatted: string) =>
      unformat(formatted, thousandSeparator, decimalSeparator),
    formatAndPositionCaret: (
      e: React.ChangeEvent<HTMLInputElement>,
    ): InputState =>
      formatAndPositionCaret(e, thousandSeparator, decimalSeparator),
    initializeState: (raw: string): InputState => {
      const formatted = format(raw, thousandSeparator, decimalSeparator);
      const parsed = Number(raw);
      const isValid = !Number.isNaN(parsed);
      return {
        raw,
        formatted,
        parsed,
        isValid,
      };
    },
  };
}
