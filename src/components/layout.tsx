import { WithSession } from "@/utils/auth";
import { useRouter } from "next/router";
import React from "react";
import { Footer } from "./footer";
import { Navbar, ProfileNavbar } from "./navbar";
import { Sidebar } from "./sidebar";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto p-24 bg-white overflow-x-hidden sm:px-6 md:px-8 max-w-screen-lg">
      {children}
    </div>
  );
}

interface LayoutProps {
  padding?: boolean;
  children?: React.ReactNode;
  navbar?: boolean;
}
export function Layout({
  children,
  navbar = true,
  padding = true,
}: LayoutProps) {
  const className = padding ? "px-8 py-12 max-w-7xl mx-auto space-y-8" : "";

  const height = navbar ? "h-[calc(100vh-73px)]" : "h-screen";

  return (
    <div
      className={`${height} overflow-y-hidden bg-slate-50`}
    >
      <div className="h-full overflow-y-auto ">
        <section className={className}>
          {children}
          <Footer />
        </section>
      </div>
    </div>
  );
}

interface ProfileLayoutProps extends WithSession {
  children?: React.ReactNode;
  padding?: boolean;
}
export function ProfileLayout({
  children,
  padding = true,
  session,
}: ProfileLayoutProps) {
  const router = useRouter();

  const heading = React.useMemo(() => {
    const split = router.pathname.split("/");
    const route = split[split.length - 1];

    return route.charAt(0).toUpperCase() + route.slice(1);
  }, [router.pathname]);

  return (
    <div className="flex">
      <Sidebar pathname={router.pathname} />
      <div className="flex-1">
        <ProfileNavbar session={session} route={heading} />{" "}
        <Layout padding={padding}>{children}</Layout>{" "}
      </div>
    </div>
  );
}
