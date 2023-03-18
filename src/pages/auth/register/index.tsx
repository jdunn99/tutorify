import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";
import { useForm, validate } from "@/utils/hooks/useFormReducer";
import { z } from "zod";
import React from "react";
import { Button } from "@/components/button";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Link from "next/link";

const CredentialsSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  "confirm password": z.string().min(6),
});

export default function SignUp({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { state, onChange } = useForm(CredentialsSchema);
  const { mutateAsync: register } = api.user.register.useMutation();
  const { mutateAsync: createProfile } = api.profile.create.useMutation();
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const {
      email,
      name,
      password,
      "confirm password": confirmed,
    } = validate(state, CredentialsSchema);

    // should have some error handling in the future
    if (password !== confirmed) return;

    await register({ email, name, password });
    await signIn("credentials", { email, password });

    router.push("/");
  }

  return (
    <section className="bg-slate-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 h-screen mx-auto md:h-screen lg:py-0 bg-slate-50">
        <div className="w-full bg-white rounded-lg shadow border border-slate-200 md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              Register
            </h1>
            <form className="space-y-4" onSubmit={onSubmit}>
              {Object.entries(state).map((entry) => {
                const [name, { value, config }] = entry;

                return (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium">
                      {name}
                      <input
                        className="g-gray-50 border border-gray-300 mt-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        type={config.type}
                        name={name}
                        onChange={onChange}
                        value={value}
                        placeholder={name}
                      />
                    </label>
                  </div>
                );
              })}

              <Button type="submit" className="w-full">
                Register.
              </Button>
            </form>
            <p className="text-sm text-center">Or</p>
            {Object.values(providers).map((provider) =>
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
                className="font-bold text-sky-600 hover:underline"
              >
                here.
              </Link>
            </p>
            <p className="text-sm text-center">
              Interested in becoming a tutor?{" "}
              <Link
                href="/auth/register/tutor"
                className="font-bold text-sky-600 hover:underline"
              >
                Apply now.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
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
