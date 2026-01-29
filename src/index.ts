export interface InputState {
  raw: string;
  formatted: string;
  parsed: number | undefined;
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

export function formatAndPositionCaret(
  target: HTMLInputElement,
  thousandSeparator = ",",
  decimalSeparator = ".",
): InputState {
  const value = target.value;
  const raw = unformat(value, thousandSeparator, decimalSeparator);
  const formatted = format(raw, thousandSeparator, decimalSeparator);
  const parsed = parse(raw);

  const caretPos = target.selectionStart ?? 0;

  const calculateCaretOffset = (value: string) => {
    const beforeCaret = value.substring(0, caretPos);
    const beforeCaretRaw = unformat(
      beforeCaret,
      thousandSeparator,
      decimalSeparator,
    );
    return beforeCaret.length - beforeCaretRaw.length;
  };

  const prevCaretOffset = calculateCaretOffset(value);
  const nextCaretOffset = calculateCaretOffset(formatted);

  const offset = nextCaretOffset - prevCaretOffset;
  const newPos = caretPos + offset;

  requestAnimationFrame(() => target.setSelectionRange(newPos, newPos));

  return {
    formatted,
    raw,
    parsed,
  };
}

export function createFormat(thousandSeparator = ",", decimalSeparator = ".") {
  if (thousandSeparator === decimalSeparator) {
    throw new Error("Thousand and decimal separators must be different.");
  }
  if (thousandSeparator === "-" || decimalSeparator === "-") {
    throw new Error('Separators cannot be the minus sign ("-").');
  }

  return {
    format: (raw: string) => format(raw, thousandSeparator, decimalSeparator),
    parse: (formatted: string) =>
      unformat(formatted, thousandSeparator, decimalSeparator),
    formatAndPositionCaret: (target: HTMLInputElement): InputState =>
      formatAndPositionCaret(target, thousandSeparator, decimalSeparator),
    initializeState: (raw: string): InputState => {
      const formatted = format(raw, thousandSeparator, decimalSeparator);
      const parsed = parse(raw);
      return {
        raw,
        formatted,
        parsed,
      };
    },
  };
}
