/*
 * This is somewhat of a typesafe (still some any conversions that can be resolved)
 * hook for fetching data for an admin page
 */
import { getQueryKey } from "@trpc/react-query";
import { z } from "zod";
import { api } from "../api";
import { useForm, validate } from "./useFormReducer";
import type { Session } from "next-auth";
import { useQueryClient } from "@tanstack/react-query";

type Endpoint =
  | "profile"
  | "subject"
  | "availability"
  | "user"
  | "tutor"
  | "profile"
  | "appointment";

/**
 * The properties accepted by the useAdminData hook.
 */
type AdminOptions = {
  /**
   * The user's session information.
   */
  session?: Session;
  /**
   * The endpoint to retrieve data from.
   */
  endpoint: Endpoint;
  /**
   * The schema used to validate the form data.
   */
  schema: z.ZodObject<any>;
};

/**
 * Hook to perform admin mutations.
 *
 * @param {AdminOptions} options The options object containing the endpoint and schema.
 */
export function useAdminMutation({ endpoint, schema }: AdminOptions) {
  const queryClient = useQueryClient();
  const { state, dispatch } = useForm(schema);

  // Use the useMutation hook to update the endpoint data.
  const { mutateAsync } = api[endpoint].create.useMutation({
    onSuccess: async (newData: unknown) => {
      // Update the query data with the new data.
      const queryKey = getQueryKey(
        api[endpoint].get as any,
        undefined,
        "query"
      );
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData<unknown[]>(queryKey, (oldData) => [
        ...(oldData ?? []),
        newData,
      ]);
      return previousData;
    },
  });

  /**
   * Updates the form state when a field value changes.
   * Might end up putting this in the useForm hook and just calling it from there.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event object containing the field name and value.
   */
  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch({ type: "UPDATE_FIELD", payload: { field: name, value } });
  }

  /**
   * Validates and submits the form data to the endpoint.
   */
  async function onSubmit() {
    const validated = validate(state, schema);
    await mutateAsync(validated as any);
  }

  return { state, onChange, onSubmit };
}

/**
 * Hook to retrieve admin query data.
 *
 * @param {Omit<AdminOptions, "schema">} options The options object containing the session and endpoint.
 */
export function useAdminQuery<T>({
  session,
  endpoint,
}: Omit<AdminOptions, "schema">) {
  // Use the useQuery hook to retrieve the endpoint data.
  const { data, isLoading } = (api[endpoint].get as any).useQuery(undefined, {
    enabled: session !== undefined,
  });

  // Return an object containing the endpoint data, loading status,
  // form state, and form event handlers.
  return {
    data: data as T, // "type-safe"
    isLoading,
  };
}
