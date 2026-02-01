import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it } from "vitest";
import { FormattedInput } from ".";

const Input = () => {
  return <FormattedInput data-testid="formatted-input" />;
};

describe("FormattedInput", () => {
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

  it("Should format input value and position caret correctly", async () => {
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
