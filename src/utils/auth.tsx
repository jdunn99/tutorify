// Couldn't figure out a solution without using getInitialProps
// Would prefer to use getServerSideProps/getStaticProps because what if the component calling the HOC needs SSR/SSG
// TODO: Look into the above issue.
import { RegisterComponent } from "@/pages/auth/register";
import { Role } from "@prisma/client";
import type { NextPage, NextPageContext } from "next";
import { type Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import React from "react";

/**
 * Defines options for authentication higher-order component.
 */
export type AuthOptions = {
  roles?: Role[];
  route?: string;
  isTutor?: boolean;
};

/**
 * Defines a session object containing authenticated user information.
 */
export interface WithSession {
  session: Session;
}

/**
 * Higher-order component that wraps a Next.js page component and adds authentication logic.
 *
 * @param Component - The Next.js page component to wrap.
 * @param roles - An array of roles allowed to access the page (default: [Role.ADMIN, Role.SUPERUSER]).
 * @param route - The URL to redirect to if the user is not authenticated (default: "/unauthorized").
 * @returns The wrapped page component.
 */
function withAuthHOC<T extends object>(
  Component: NextPage<T & { session: Session }>,
  {
    route = "/unauthorized",
    roles = [Role.ADMIN, Role.SUPERUSER],
    isTutor = false,
  }: AuthOptions = {}
): React.FC<T> {

  /**
   * Makes sure the user is verified and then renders the page component accordingly.
   *
   * @param props - The props to pass down to the page component.
   * @returns The page component or null if the user is not authenticated.
   */
  const Auth = (props: T) => {
    const { data: session } = useSession();

    if (typeof session === "undefined") return null;
    if (session === null) return <RegisterComponent isTutor={isTutor} />;

    return <Component {...props} session={session} />;
  };

  return Auth;
}

export default withAuthHOC;
