import React, { ChangeEventHandler } from "react";
import { z } from "zod";

/**
 *  Parses the schema and returns an initial state object for a form based on the schema.
 *
 *  @template T - The type of the Zod schema.
 *  @param {T} schema - The Zod schema to parse.
 */
function useParsedState<T extends z.ZodObject<any>>(schema: T): FormState {
  return React.useMemo(
    () =>
      Object.keys(schema.shape).reduce((acc: FormState, key: string) => {
        const def = (schema.shape[key as keyof T] satisfies z.ZodObjectDef)
          ._def;
        const zodType: z.ZodFirstPartyTypeKind = def.typeName;

        // Parse the type and default value.
        // TODO: Convert switch to function & add more use cases.
        let type: FormFieldTypes;
        let value: string | number;
        switch (zodType) {
          case z.ZodFirstPartyTypeKind.ZodNumber:
            type = "number";
            value = 0;
            break;
          default:
            switch (key as "email" | "password") {
              case "password":
                type = "password";
                break;
              case "email":
                type = "text";
                break;
              default:
                type = "text";
                break;
            }
            value = "";
            break;
        }

        acc[key] = {
          value,
          config: {
            type,
            label: key,
          },
        };

        return acc;
      }, {}),
    [schema]
  );
}

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
): z.infer<T> {
  const result: z.infer<T> = {};

  Object.entries(state).forEach(([name, { value }]) => {
    result[name] = value;
  });

  return schema.parse(result);
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
  | "checkbox";

/**
 * Configuration object for a form field.
 *
 * @template T - The type of form field.
 * @property {T} type - The type of form field.
 * @property {string} label - The label of the form field.
 * @typedef {object} FieldConfig
 */
type FieldConfig<T extends FormFieldTypes> = {
  type: T;
  label: string;
};

/**
 * Defines the fields of a form.
 *
 * @template K - The keys of the form.
 * @typedef {Record<K, FieldConfig<FormFieldTypes>>} FormFields
 */
type FormFields = Record<string, FieldConfig<FormFieldTypes>>;

/**
 * Defines the state of a form.
 *
 * @typedef {object} FormState
 * @property {string | number} value - The current value of the form field.
 * @property {FieldConfig<FormFieldTypes>} config - The configuration object for the form field.
 */
export type FormState = {
  [K in keyof FormFields]: {
    value: string | number;
    config: FormFields[K];
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
      payload: { field: keyof FormFields; value: string };
    }
  | { type: "RESET_FORM"; payload: { initialState: FormState } };

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
        },
      };
    case "RESET_FORM":
      const { initialState } = payload;
      return initialState;
    default:
      return state;
  }
}

/**
 * Custom hook for handling form state and validation.
 * @template T - The type of the Zod schema used to validate the form.
 * @param {T} schema - The Zod schema used to validate the form.
 */
export function useForm<T extends z.ZodObject<any>>(schema: T) {
  const [state, dispatch] = React.useReducer(reducer, useParsedState(schema));
  return { state, dispatch };
}
