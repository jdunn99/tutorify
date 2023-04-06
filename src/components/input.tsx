import { FieldConfig } from "@/utils/hooks/useFormReducer";
import React from "react";

const style =
  "border border-slate-300 text-slate-800 sm:text-sm rounded-lg block p-2.5";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  children?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <input className={`${style} ${className}`} ref={ref} {...rest}>
        {children}
      </input>
    );
  }
);
Input.displayName = "Input";

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ children, className = "", ...rest }, ref) => {
    return (
      <textarea className={`${style} ${className}`} ref={ref} {...rest}>
        {children}
      </textarea>
    );
  }
);
TextArea.displayName = "TextArea";

type State = {
  value: string | number | boolean;
  config: FieldConfig<any>;
  error?: string;
};

interface FormInputProps {
  textarea?: boolean;
  state: State;
  label?: string;
  children?: React.ReactNode;
  height?: string;
  onChange(event: React.ChangeEvent<HTMLElement>, value?: any): void;
}

interface BooleanInputProps extends FormInputProps {
  heading: string;
  labels?: string[];
}

interface DropdownInputProps extends FormInputProps {
  placeholder: string;
}

/*
 * Render a standard input
 */
export function FormInput({
  state,
  label,
  textarea,
  height,
  onChange,
}: FormInputProps) {
  let { value, config, error } = state;
  const { type, label: name } = config;

  if (typeof value === "boolean") value = "";

  const Item = textarea ? TextArea : Input;

  return (
    <label
      htmlFor={label}
      className="text-sm flex-1 block w-full font-semibold"
    >
      {label}
      <Item
        type={type}
        className={`mt-2 font-normal w-full ${height} ${
          error ? "border border-red-500" : ""
        }`}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={label}
      />
      <span className="font-normal text-xs text-red-500">{error}</span>
    </label>
  );
}

/*
 * Render a checkbox to represent boolean inputs.
 */
export function BooleanInput({
  state,
  labels = ["Yes", "No"],
  heading,
  onChange,
}: BooleanInputProps) {
  const { value, config, error } = state;
  const { type, label: name } = config;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-900">{heading}</p>
      {error ? (
        <span className="font-normal text-xs text-red-500">
          Value is required
        </span>
      ) : null}
      {labels.map((label, index) => (
        <label key={label} className="block">
          <input
            className="mr-1 accent-green-600"
            type={type}
            name={name}
            checked={index === 0 ? value === true : value === false}
            onChange={(event) => {
              onChange(event, index === 0 ? true : false);
            }}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

/*
 * Generates an array of options given a list of keys
 */
export function generateArrayOptions(keys: string[]): JSX.Element[] {
  const options = [];
  for (let i = 0; i < keys.length; i++) {
    options.push(
      <option key={i + 1} value={keys[i]}>
        {keys[i]}
      </option>
    );
  }

  return options;
}

/*
 * Renders an array of strings into a select component
 */
export function DropdownInput({
  state,
  label,
  placeholder,
  children,
  onChange,
}: DropdownInputProps) {
  const { value, config, error } = state;
  const { label: name } = config;

  return (
    <label htmlFor={name} className="text-sm flex-1 block w-full font-semibold">
      {label}
      <select
        className={`${style} ${
          error ? "border border-red-500" : ""
        } bg-white w-full mt-2`}
        value={value.toString().length === 0 ? "none" : value.toString()}
        onChange={onChange}
        name={name}
      >
        <option value="none" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      <span className="font-normal text-xs text-red-500">{error}</span>
    </label>
  );
}
