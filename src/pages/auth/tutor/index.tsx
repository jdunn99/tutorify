import { Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import React from "react";
import withAuthHOC, { WithSession } from "@/utils/auth";

interface LayoutProps {
  absoluteMenu?: JSX.Element;
  children?: React.ReactNode;
}

export function TutorApplicationLayout({
  children,
  absoluteMenu,
}: LayoutProps) {
  return (
    <div className="h-screen overflow-y-hidden bg-slate-50">
      {absoluteMenu}
      <div className="flex h-full overflow-y-auto flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

function TutorRegister({ session }: WithSession) {
  const router = useRouter();

  const { mutateAsync: updateApplication } =
    api.tutor.updateApplication.useMutation();

  async function onClick() {
    await updateApplication({ applicationStatus: "subject_selection" });
    router.push("/auth/tutor/subject_selection");
  }

  return (
    <div className="h-screen overflow-y-hidden bg-slate-50">
      <div className="flex h-full overflow-y-auto flex-col">
        <Navbar />
        <main>
          <section className="py-36">
            <div className="mx-auto max-w-2xl bg-white p-8 rounded-lg shadow">
              <div className="prose mx-auto max-w-2xl">
                <h2>Welcome, {session.user.name}</h2>
                <p className="text-sm leading-7 text-slate-600">
                  Welcome to the tutorify tutor application form! Join our team
                  of passionate tutors and help students achieve their academic
                  goals. Apply below to make a positive impact on the lives of
                  students.
                </p>
              </div>
              <Button
                onClick={onClick}
                className="block mx-auto max-w-2xl text-center mt-8"
              >
                Get started
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default withAuthHOC(TutorRegister, { isTutor: true });
