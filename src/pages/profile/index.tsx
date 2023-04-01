import { Footer } from "@/components/footer";
import { ProfileNavbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import type { WithSession } from "@/utils/auth";
import { useRouter } from "next/router";
import React from "react";

export function ProfileLayout({
  children,
  session,
}: { children?: React.ReactNode } & WithSession) {
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
        <div className="h-[calc(100vh-73px)] overflow-y-hidden bg-slate-50">
          <div className="h-full overflow-y-auto ">
            <section className="px-8 py-12 max-w-7xl mx-auto space-y-8">
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
