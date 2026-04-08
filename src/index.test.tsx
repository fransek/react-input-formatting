import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { createFormat, FormattedInput } from ".";

const Input = () => {
  return <FormattedInput data-testid="formatted-input" />;
};

describe("FormattedInput", () => {
  afterEach(() => {
    cleanup();
  });

  it("Should format input value and position caret correctly", async () => {
    render(<Input />);
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;

    const type = async (
      value: string,
      initialSelectionStart?: number,
      initialSelectionEnd?: number,
    ) => {
      await userEvent.type(input, value, {
        initialSelectionStart,
        initialSelectionEnd,
        delay: 30, // Wait for RAF
      });
    };

    await type("123456.7890");
    expect(input.value).toBe("123,456.7890");
    expect(input.selectionStart).toBe(12);

    await type("3", 3);
    expect(input.value).toBe("1,233,456.7890");
    expect(input.selectionStart).toBe(5);

    await type("3", 3, 12);
    expect(input.value).toBe("12,390");
    expect(input.selectionStart).toBe(4);

    await type(".", 4);
    expect(input.value).toBe("123.90");
    expect(input.selectionStart).toBe(4);

    await type("{Backspace}", 4);
    expect(input.value).toBe("12,390");
    expect(input.selectionStart).toBe(4);

    await type("{Backspace}", 3);
    expect(input.value).toBe("12,390");
    expect(input.selectionStart).toBe(2);
  });
});

describe("createFormat", () => {
  const format = createFormat({
    decimalSeparator: ",",
    thousandSeparator: " ",
  });

  afterEach(() => {
    cleanup();
  });

  it("should create input state correctly", () => {
    expect(format.createInputState("1234.56")).toEqual({
      formatted: "1 234,56",
      parsed: 1234.56,
      raw: "1234.56",
    });
  });

  it("should format value correctly", () => {
    expect(format.format("1234.56")).toBe("1 234,56");
  });

  it("should unformat value correctly", () => {
    expect(format.unformat("1 234,56")).toBe("1234.56");
  });

  it("should parse value correctly", () => {
    expect(format.parse("1234.56")).toBe(1234.56);
  });

  it("should render FormattedInput correctly", async () => {
    render(<format.FormattedInput data-testid="formatted-input" />);
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;
    await userEvent.type(input, "1234.56", { delay: 30 });
    expect(input.value).toBe("1 234,56");
  });

  it("should use useInputState hook correctly", async () => {
    const UseInputStateTest = () => {
      const { formatted, parsed, raw, handleChange, setRaw } =
        format.useInputState("1234.56");

      return (
        <div>
          <input
            data-testid="formatted-input"
            value={formatted}
            onChange={handleChange}
          />
          <button data-testid="set-raw" onClick={() => setRaw("9876.54")}>
            Set Raw
          </button>
          <div data-testid="raw">{raw}</div>
          <div data-testid="parsed">{parsed}</div>
        </div>
      );
    };

    render(<UseInputStateTest />);
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;
    const rawDiv = screen.getByTestId("raw");
    const parsedDiv = screen.getByTestId("parsed");
    const button = screen.getByTestId("set-raw");

    expect(input.value).toBe("1 234,56");
    expect(rawDiv.textContent).toBe("1234.56");
    expect(parsedDiv.textContent).toBe("1234.56");

    await userEvent.type(input, "7", { delay: 30, initialSelectionStart: 5 });
    expect(input.value).toBe("12 347,56");
    expect(rawDiv.textContent).toBe("12347.56");
    expect(parsedDiv.textContent).toBe("12347.56");

    await userEvent.click(button);
    expect(input.value).toBe("9 876,54");
    expect(rawDiv.textContent).toBe("9876.54");
    expect(parsedDiv.textContent).toBe("9876.54");
  });

  it("should format input on change using formatInput", async () => {
    const FormatInputTest = () => (
      <input data-testid="formatted-input" onChange={format.formatInput} />
    );

    render(<FormatInputTest />);
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;
    await userEvent.type(input, "1234.56", { delay: 30 });
    expect(input.value).toBe("1 234,56");
  });

  it("should throw if thousand and decimal separators are the same", () => {
    expect(() =>
      createFormat({ thousandSeparator: ",", decimalSeparator: "," }),
    ).toThrow("Thousand and decimal separators must be different.");
  });

  it("should throw if thousand or decimal separator is '-'", () => {
    expect(() =>
      createFormat({ thousandSeparator: "-", decimalSeparator: "." }),
    ).toThrow('Separators cannot be the minus sign ("-").');
    expect(() =>
      createFormat({ thousandSeparator: ",", decimalSeparator: "-" }),
    ).toThrow('Separators cannot be the minus sign ("-").');
  });
});

describe("prefix and suffix", () => {
  afterEach(() => {
    cleanup();
  });

  it("should format with prefix", async () => {
    render(<FormattedInput data-testid="formatted-input" prefix="$" />);
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;
    await userEvent.type(input, "1234.56", { delay: 30 });
    expect(input.value).toBe("$1,234.56");
  });

  it("should format with suffix", async () => {
    render(<FormattedInput data-testid="formatted-input" suffix="%" />);
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;
    await userEvent.type(input, "1234.56", { delay: 30 });
    expect(input.value).toBe("1,234.56%");
  });

  it("should format with prefix and suffix", async () => {
    render(
      <FormattedInput data-testid="formatted-input" prefix="$" suffix=" USD" />,
    );
    const input = screen.getByTestId("formatted-input") as HTMLInputElement;
    await userEvent.type(input, "1234.56", { delay: 30 });
    expect(input.value).toBe("$1,234.56 USD");
  });

  it("should create input state with prefix and suffix correctly", () => {
    const fmt = createFormat({ prefix: "$", suffix: "%" });
    expect(fmt.createInputState("1234.56")).toEqual({
      formatted: "$1,234.56%",
      parsed: 1234.56,
      raw: "1234.56",
    });
  });

  it("should return empty string for empty value regardless of prefix/suffix", () => {
    const fmt = createFormat({ prefix: "$", suffix: "%" });
    expect(fmt.format("")).toBe("");
  });
});
