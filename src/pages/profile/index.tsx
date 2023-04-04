import { Footer } from "@/components/footer";
import { NavLink } from "@/components/links";
import { ProfileNavbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import type { WithSession } from "@/utils/auth";
import { useRouter } from "next/router";
import React from "react";
import { MdArrowRightAlt } from "react-icons/md";

interface HeadingProps {
  link?: {
    href: string;
    text: string;
  };
  children: React.ReactNode;
}

export function Heading({ link, children }: HeadingProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-slate-700 m-0 text-xl font-semibold">{children}</h3>
      {link && (
        <NavLink href={link.href} variant="green">
          {link.text} <MdArrowRightAlt className="inline-block" />
        </NavLink>
      )}
    </div>
  );
}

export function ProfileLayout({
  children,
  padding=true,
  session,
}: { children?: React.ReactNode; padding?: boolean } & WithSession) {
  const router = useRouter();

  const heading = React.useMemo(() => {
    const split = router.pathname.split("/");
    const route = split[split.length - 1];

    return route.charAt(0).toUpperCase() + route.slice(1);
  }, [router.pathname]);

  const className = padding
    ? "px-8 py-12 max-w-7xl mx-auto space-y-8"
    : "";

  return (
    <div className="flex">
      <Sidebar pathname={router.pathname} />
      <div className="flex-1">
        <ProfileNavbar session={session} route={heading} />{" "}
        <div className="h-[calc(100vh-73px)] overflow-y-hidden bg-slate-50">
          <div className="h-full overflow-y-auto ">
            <section className={className}>
              {children}
              <Footer />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return null;
}

export function getServerSideProps() {
  return { redirect: { destination: "/profile/dashboard" } };
}
