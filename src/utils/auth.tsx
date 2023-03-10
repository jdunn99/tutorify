// Couldn't figure out a solution without using getInitialProps
// Would prefer to use getServerSideProps/getStaticProps because what if the component calling the HOC needs SSR/SSG
// TODO: Look into the above issue.
import { Role } from "@prisma/client";
import type { NextPage, NextPageContext } from "next";
import { type Session } from "next-auth";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export type AuthOptions = {
  roles?: Role[];
  route?: string;
};

export interface WithSession {
  session: Session;
}

const withAuthHOC = <T extends object>(
  Component: NextPage<T>,
  { roles = [Role.USER, Role.SUPERUSER], route = "/unauthorized" }: AuthOptions
) => {
  /*
   * Make sure the user is verified and then render accordingly.
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

  /*
   * Fetch the session and pass to our child component
   */
  Auth.getInitialProps = async (ctx: NextPageContext) => {
    const session = await getSession(ctx);
    const pageProps =
      Component.getInitialProps && (await Component.getInitialProps(ctx));

    return { session, ...pageProps };
  };

  return Auth;
};

export default withAuthHOC;
