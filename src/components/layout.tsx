import { WithSession } from "@/utils/auth";
import { useRouter } from "next/router";
import React from "react";
import { Footer } from "./footer";
import { Navbar, ProfileNavbar } from "./navbar";
import { Sidebar } from "./sidebar";

const CONTAINER_SIZES = {
  base: "py-6 px-8 space-y-4",
  small: "p-4 space-y-4",
};

export function Container({
  heading,
  children,
  size = "base",
}: {
  heading?: string;
  children?: React.ReactNode;
  size?: keyof typeof CONTAINER_SIZES;
}) {
  return (
    <div className={`rounded-lg ${CONTAINER_SIZES[size]} border  bg-white `}>
      {heading ? (
        <h1 className="text-xl text-green-600 font-bold">{heading}</h1>
      ) : null}
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
    <div className={`${height} overflow-y-hidden bg-slate-50`}>
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
