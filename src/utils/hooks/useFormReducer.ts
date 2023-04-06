import React from "react";
import { z } from "zod";

function parseState<T extends z.ZodObject<any>>(schema: T): FormState {
  if (schema === undefined) return {} as FormState;
  return Object.keys(schema.shape).reduce((acc: FormState, key: string) => {
    const def = (schema.shape[key as keyof T] satisfies z.ZodObjectDef)._def;

    let { description, typeName, defaultValue, innerType } = def;

    if (innerType) typeName = innerType._def.typeName;

    // Parse the type and default value.
    // TODO: Convert switch to function & add more use cases.
    let type: FormFieldTypes;
    let value: string | number;

    switch (typeName) {
      case z.ZodFirstPartyTypeKind.ZodNumber:
        type = "number";
        value = 0;
        break;
      case z.ZodFirstPartyTypeKind.ZodBoolean:
        type = "checkbox";
        value = "";
        break;
      default:
        type = "text";
        value = "";
        break;
    }

    acc[key] = {
      value: defaultValue ? defaultValue() : value,
      config: {
        type: description || type,
        label: key,
      },
    };

    return acc;
  }, {});
}

/**
 *  Parses the schema and returns an initial state object for a form based on the schema.
 *
 *  @template T - The type of the Zod schema.
 *  @param {T} schema - The Zod schema to parse.
 */
export function useParsedState<T extends z.ZodObject<any>>(
  schema: T
): FormState {
  return React.useMemo(() => {
    return parseState(schema);
  }, [schema]);
}

export type ValidatedError = Record<keyof FormFields, string>;

export type ValidatedResult<T> = {
  result?: T;
  errors?: Record<keyof FormFields, string>;
};

/**
 * Validates a form state using a Zod schema.
 *
 * @template T - The type of the Zod schema used to validate the form.
 * @param {FormState} state - The state of the form to be validated.
 * @param {T} schema - The Zod schema used to validate the form.
 * @returns {z.infer<T>} The parsed and validated form state.
 */
export function validate<T extends z.ZodTypeAny>(
  state: FormState,
  schema: T
): ValidatedResult<z.infer<T>> {
  const result: z.infer<T> = {};

  Object.entries(state).forEach(([name, { value }]) => {
    result[name] = value;
  });

  try {
    return { result: schema.parse(result) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { issues } = error;
      const errors: ValidatedError = {};

      issues.forEach(({ message, path }) => (errors[path[0]] = message));
      return { errors };
    }

    return {};
  }
}

/**
 * Defines the types of form fields available.
 *
 * @typedef {'text' | 'email' | 'password' | 'number' | 'checkbox'} FormFieldTypes
 */
export type FormFieldTypes =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "checkbox";

/**
 * Configuration object for a form field.
 *
 * @template T - The type of form field.
 * @property {T} type - The type of form field.
 * @property {string} label - The label of the form field.
 * @typedef {object} FieldConfig
 */
export type FieldConfig<T extends FormFieldTypes> = {
  type: T;
  label: string;
};

/**
 * Defines the fields of a form.
 *
 * @template K - The keys of the form.
 * @typedef {Record<K, FieldConfig<FormFieldTypes>>} FormFields
 */
export type FormFields = Record<string, FieldConfig<FormFieldTypes>>;

/**
 * Defines the state of a form.
 *
 * @typedef {object} FormState
 * @property {string | number} value - The current value of the form field.
 * @property {FieldConfig<FormFieldTypes>} config - The configuration object for the form field.
 */
export type FormState = {
  [K in keyof FormFields]: {
    value: string | number | boolean;
    config: FormFields[K];
    error?: string;
  };
};

/**
 * Defines the actions that can be performed on a form.
 *
 * @typedef {object} Action
 * @property {'UPDATE_FIELD'} type - The type of the action.
 * @property {{ field: keyof FormFields; value: string }} payload - The payload of the action.
 * @property {'RESET_FORM'} type - The type of the action.
 * @property {{ initialState: FormState }} payload - The payload of the action.
 */
type Action =
  | {
      type: "UPDATE_FIELD";
      payload: { field: keyof FormFields; value: string | number | boolean };
    }
  | { type: "RESET_FORM"; payload: { initialState: FormState } }
  | { type: "VALIDATE"; payload: { errors: ValidatedError } }
  | { type: "RESUME"; payload: { key: string } };

/**
 * Defines the reducer function for a form state.
 *
 * @param {FormState} state - The current state of the form.
 * @param {Action} action - The action to be performed on the form.
 * @returns {FormState} The new state of the form.
 */
function reducer(state: FormState, action: Action): FormState {
  const { payload, type } = action;

  switch (type) {
    case "UPDATE_FIELD":
      const { field, value } = payload;
      return {
        ...state,
        [field]: {
          ...state[field],
          value,
          error: undefined,
        },
      };
    case "VALIDATE":
      const { errors } = payload;
      const temp = Object.assign({}, state);

      Object.entries(errors).forEach(([key, value]) => {
        temp[key] = {
          ...temp[key],
          error: value,
        };
      });

      return temp;
    case "RESET_FORM":
      const { initialState } = payload;
      return initialState;
    // Fetch from localStorage and then return the statek
    case "RESUME":
      const { key } = payload;
      const saved = localStorage.getItem(key);

      // key not found. return
      if (saved === null) return state;

      return JSON.parse(saved) as typeof state;
    default:
      return state;
  }
}

/**
 * Custom hook for handling form state and validation.
 * @template T - The type of the Zod schema used to validate the form.
 * @param {T} schema - The Zod schema used to validate the form.
 */
export function useForm<T extends z.ZodObject<any>>(schema: T, key?: string) {
  const [state, dispatch] = React.useReducer(reducer, useParsedState(schema));

  React.useEffect(() => {
    if (typeof key !== "undefined")
      dispatch({ type: "RESUME", payload: { key } });
  }, [key]);

  /*
   * Updates the form state when a field value changes.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event object containing the field name and value.
   */
  function onChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    actualValue?: any
  ) {
    let { name, value, type } = event.target;
    if (typeof actualValue !== "undefined") value = actualValue;

    dispatch({
      type: "UPDATE_FIELD",
      payload: {
        field: name,
        value: type === "number" ? parseInt(value) : value,
      },
    });
  }

  function validateSchema() {
    const { errors, result } = validate(state, schema);
    if (errors) dispatch({ type: "VALIDATE", payload: { errors } });

    return { result };
  }

  return { state, dispatch, onChange, validate: validateSchema };
}
