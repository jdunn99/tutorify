import { Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Spinner } from "@/components/loading";
import { Navbar } from "@/components/navbar";
import { api } from "@/utils/api";
import withAuthHOC from "@/utils/auth";
import { useRouter } from "next/router";
import React from "react";

const coreSubjectMapping = {
  MATH: "Math",
  SCIENCE: "Science",
  SOCIAL_STUDIES: "Social Studies",
  LANGUAGE_ARTS: "Language Arts",
};

function SubjectSection() {
  const router = useRouter();
  const [subjectsSelected, setSubjectsSelected] = React.useState<string[]>([]);
  const { data: groupedSubjects } = api.subject.getGroupedSubjects.useQuery();
  const { mutateAsync: update } = api.tutor.updateApplication.useMutation();

  function onCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { target } = event;
    const { value, checked } = target;

    if (!checked) {
      setSubjectsSelected(subjectsSelected.filter((id) => id !== value));
    } else {
      if (subjectsSelected.length >= 5) return;
      setSubjectsSelected([...subjectsSelected, value]);
    }
  }

  async function onClick() {
    await update({
      applicationStatus: "basic_info",
      subjects: subjectsSelected,
    });
    router.push("/auth/tutor/basic_info");
  }

  return (
    <div className="h-screen overflow-y-hidden bg-slate-50">
      <div className="absolute p-8 md:p-16 w-full bottom-0 ">
        <div className="text-right space-y-4">
          <p className="text-sm text-gray-600">
            {subjectsSelected.length}{" "}
            {subjectsSelected.length === 1 ? "subject" : "subjects"} selected.
          </p>
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="open"
              disabled={subjectsSelected.length === 0}
              onClick={() => setSubjectsSelected([])}
            >
              Clear
            </Button>
            <Button disabled={subjectsSelected.length === 0} onClick={onClick}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <div className="flex h-full overflow-y-auto flex-col">
        <Navbar />
        <main>
          <section className="py-10">
            <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-slate-800">Select your subjects.</h1>
              <p>
                Select 1–5 subjects you&apos;d like to tutor. You can add more
                later once you&apos;re done signing up.{" "}
              </p>
              {groupedSubjects ? (
                groupedSubjects.map(({ coreSubject, subjects }) => (
                  <div key={coreSubject} className="border-b pb-16">
                    <h2>{coreSubjectMapping[coreSubject]}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:text-left lg:grid-cols-3 gap-x-8">
                      {subjects.map(({ name, id }) => (
                        <div key={id}>
                          <label className="bg-white rounded-full shadow py-2 px-4">
                            <input
                              checked={subjectsSelected.includes(id)}
                              value={id}
                              onChange={onCheckboxChange}
                              type="checkbox"
                              className="mr-2 accent-green-600"
                            />
                            {name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <Spinner />
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default withAuthHOC(SubjectSection, { isTutor: true });
