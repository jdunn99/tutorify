import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import {
  type ClientSafeProvider,
  getProviders,
  type LiteralUnion,
  signIn,
} from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { useForm, validate } from "@/utils/hooks/useFormReducer";
import { z } from "zod";
import React from "react";
import { Button } from "@/components/button";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";
import type { BuiltInProviderType } from "next-auth/providers";
import { Navbar } from "@/components/navbar";

const CredentialsSchema = z.object({
  name: z.string(),
  email: z.string().email().describe("email"),
  password: z.string().min(6).describe("password"),
  "confirm password": z.string().min(6).describe("password"),
});

interface RegisterProps {
  providers?:
    | Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>
    | never[];
  isTutor?: boolean;
  redirectUrl?: string;
}

export function RegisterComponent({
  redirectUrl,
  providers,
  isTutor = false,
}: RegisterProps) {
  const { state, onChange, dispatch } = useForm(CredentialsSchema);
  const { mutateAsync: register } = api.user.register.useMutation();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { result, errors } = validate(state, CredentialsSchema);
    if (errors) dispatch({ type: "VALIDATE", payload: { errors } });

    if (!result) return;

    const { email, password, name, "confirm password": confirmed } = result;

    // should have some error handling in the future
    if (password !== confirmed) return;

    await register({ email, name, password, isTutor });
    await signIn("credentials", { email, password });

    if (typeof redirectUrl === "string") router.push(redirectUrl);
  }

  return (
    <div className="h-screen overflow-y-hidden bg-slate-50">
      <Navbar />
      <main className="h-[85vh] flex items-center justify-center">
        <section className="flex-1 mx-auto p-4">
          <div className="bg-white rounded-lg shadow mx-auto border border-slate-200 md:mt-0 sm:max-w-md p-8 space-y-4">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              {isTutor ? "Create your tutor account." : "Register."}
            </h1>
            <form className="space-y-4" onSubmit={onSubmit}>
              {Object.entries(state).map((entry) => {
                const [name, { value, config, error }] = entry;

                return (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium">
                      {name}
                      <input
                        className={`${
                          error ? "border border-red-500" : ""
                        } g-gray-50 border border-gray-300 mt-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                        type={config.type}
                        name={name}
                        onChange={onChange}
                        value={typeof value === "boolean" ? "" : value}
                        placeholder={name}
                      />
                    </label>
                    <span className="font-normal text-xs text-red-500">
                      {error}
                    </span>
                  </div>
                );
              })}

              <Button type="submit" className="w-full">
                {isTutor ? "Create your tutor account." : "Register."}
              </Button>
            </form>
            <p className="text-sm text-center">Or</p>
            {providers &&
              Object.values(providers).map((provider) =>
                provider.name === "Credentials" ? null : (
                  <div key={provider.name}>
                    <Button
                      className="w-full"
                      variant="open"
                      onClick={() => signIn(provider.id)}
                    >
                      Register with {provider.name}
                    </Button>
                  </div>
                )
              )}

            <p className="text-sm text-center">
              Already have an account? Sign in{" "}
              <Link
                href="/auth/signin"
                className="font-bold text-green-600 hover:underline"
              >
                here.
              </Link>
            </p>
            {!isTutor && (
              <p className="text-sm text-center">
                Interested in becoming a tutor?{" "}
                <Link
                  href="/auth/tutor"
                  className="font-bold text-green-600 hover:underline"
                >
                  Apply now.
                </Link>
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function SignUp({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <RegisterComponent providers={providers} redirectUrl="/" />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: {
      providers: providers ?? [],
    },
  };
}
