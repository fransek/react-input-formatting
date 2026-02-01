import React, { InputHTMLAttributes } from "react";

export interface InputState {
  /** The raw input string */
  raw: string;
  /** The formatted input string */
  formatted: string;
  /** The parsed number, or `undefined` if parsing failed */
  parsed: number | undefined;
}

export interface InputStateSetters {
  /** Change event handler to be used on input elements */
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Function to set the raw input string */
  setRaw: (raw: string) => void;
}

export interface FormatOptions {
  /** The character used as thousand separator (default: ",") */
  thousandSeparator?: string;
  /** The character used as decimal separator (default: ".") */
  decimalSeparator?: string;
}

export interface Format {
  /** Formats a raw input string */
  format: (raw: string) => string;
  /** Unformats a formatted input string */
  unformat: (formatted: string) => string;
  /** Parses a formatted input string */
  parse: (formatted: string) => number | undefined;
  /** Formats an input event and returns the new InputState */
  formatInput: (event: React.ChangeEvent<HTMLInputElement>) => InputState;
  /** Creates an InputState from a raw input string */
  createInputState: (raw: string) => InputState;
  /** React hook to manage input state */
  useInputState: (initialValue: string) => InputState & InputStateSetters;
  /** React Input component that formats user input */
  FormattedInput: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

export interface InputProps
  extends FormatOptions, InputHTMLAttributes<HTMLInputElement> {}
