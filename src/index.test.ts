import { describe, expect, it } from "vitest";
import { format, parse, unformat } from ".";

describe("format", () => {
  it.each([
    {
      input: "1234.56",
      thousandSeparator: " ",
      decimalSeparator: ",",
      expected: "1 234,56",
    },
    { input: "1234.56", expected: "1,234.56" },
    { input: "-1234.56", expected: "-1,234.56" },
    { input: "123.", expected: "123." },
    { input: "", expected: "" },
  ])(
    "should return $expected for input: $input, thousandSeparator: $thousandSeparator, decimalSeparator: $decimalSeparator",
    ({ input, thousandSeparator, decimalSeparator, expected }) => {
      const result = format(input, { thousandSeparator, decimalSeparator });
      expect(result).toBe(expected);
    },
  );
});

describe("unformat", () => {
  it.each([
    {
      input: "1 234,56",
      thousandSeparator: " ",
      decimalSeparator: ",",
      expected: "1234.56",
    },
    { input: "1,234.56", expected: "1234.56" },
    { input: "-1,234.56", expected: "-1234.56" },
    { input: "foo", expected: "" },
    { input: "123.", expected: "123." },
    { input: "123a", expected: "123" },
    { input: "12a3", expected: "123" },
    { input: "12-3", expected: "123" },
    { input: ".", expected: "0." },
    { input: "-.", expected: "-0." },
    { input: "0", expected: "0" },
    { input: "123..", expected: "123." },
    { input: "123.456.789", expected: "123.456789" },
  ])(
    "should return $expected for input: $input, thousandSeparator: $thousandSeparator, decimalSeparator: $decimalSeparator",
    ({ input, thousandSeparator, decimalSeparator, expected }) => {
      const result = unformat(input, { thousandSeparator, decimalSeparator });
      expect(result).toBe(expected);
    },
  );
});

describe("parse", () => {
  it.each([
    { input: "123", expected: 123 },
    { input: "123.", expected: 123 },
    { input: "123.4", expected: 123.4 },
    { input: "0", expected: 0 },
    { input: "0.", expected: 0 },
    { input: "-0", expected: -0 },
    { input: "-0.", expected: -0 },
    { input: "foo", expected: undefined },
    { input: "-", expected: undefined },
    { input: ".", expected: undefined },
    { input: "", expected: undefined },
  ])("should return $expected for input: $input", ({ input, expected }) => {
    const result = parse(input);
    expect(result).toBe(expected);
  });
});
