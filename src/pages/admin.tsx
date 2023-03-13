import z from "zod";
import withAuth, { type WithSession } from "@/utils/auth";
import { Subject } from "@prisma/client";
import { useAdminMutation, useAdminQuery } from "@/utils/hooks/useAdminData";
import Link from "next/link";
import React from "react";
import { Sidebar } from "@/components/sidebar";

export const ProfileData = z.object({
  name: z.string(),
  biography: z.string(),
  test: z.number(),
});

const SubjectSchema = z.object({
  name: z.string(),
});

function Subject({ session }: WithSession) {
  const { data: subjectData, isLoading } = useAdminQuery<Subject[]>({
    session,
    endpoint: "user",
  });
  const { state, onChange, onSubmit } = useAdminMutation({
    schema: SubjectSchema,
    endpoint: "user",
  });

  if (isLoading) return <div>Loading...</div>;

  return subjectData !== undefined ? (
    <div>
      {subjectData.map((subject) => (
        <span key={subject.id}>
          {subject.id} {subject.name}
        </span>
      ))}
      <div className="flex flex-col gap-4">
        {Object.entries(state).map((entry) => {
          const [name, { value, config }] = entry;

          return (
            <input
              type={config.type}
              key={name}
              name={name}
              onChange={onChange}
              value={value}
              placeholder={name}
            />
          );
        })}
      </div>
      <button onClick={onSubmit}>Submit</button>
    </div>
  ) : null;
}


function Admin({ session }: WithSession) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen overflow-auto bg-white flex-1">
        <p>Hi</p>
      </div>
    </div>
  );
}

export default withAuth(Admin);
