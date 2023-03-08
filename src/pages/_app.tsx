import "@/styles/globals.css";
import type { AppProps, AppType } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "inspector";
import { api } from "@/utils/api";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(App);
