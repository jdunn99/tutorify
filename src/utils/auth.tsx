// Couldn't figure out a solution without using getInitialProps
// Would prefer to use getServerSideProps/getStaticProps because what if the component calling the HOC needs SSR/SSG
// TODO: Look into the above issue.
import { Role } from "@prisma/client";
import type { NextPage, NextPageContext } from "next";
import { type Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

/**
 * Defines options for authentication higher-order component.
 */
export type AuthOptions = {
  roles?: Role[];
  route?: string;
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
  Component: NextPage<T>,
  {
    route = "/unauthorized",
    roles = [Role.ADMIN, Role.SUPERUSER],
  }: AuthOptions = {}
): React.FC<T> {
  /**
   * Makes sure the user is verified and then renders the page component accordingly.
   *
   * @param props - The props to pass down to the page component.
   * @returns The page component or null if the user is not authenticated.
   */
  const Auth = (props: T) => {
    const { session } = props as WithSession & T;

    const verified = React.useMemo(
      () =>
        !(
          !session ||
          !session?.user ||
          !session.user.role ||
          !roles.includes(session.user.role)
        ),
      [session]
    );
    const router = useRouter();

    React.useEffect(() => {
      if (!verified) router.push(route);
    }, [router, verified]);

    return verified ? <Component {...props} /> : null;
  };

  /**
   * Fetches the session and passes it to the child component.
   *
   * @param ctx - The Next.js page context.
   * @returns An object containing the session and the page props.
   */
  Auth.getInitialProps = async (ctx: NextPageContext) => {
    const session = await getSession(ctx);
    const pageProps =
      Component.getInitialProps && (await Component.getInitialProps(ctx));

    return { session, ...pageProps };
  };

  return Auth;
}

export default withAuthHOC;
