import z from "zod";
import withAuth, { type WithSession } from "@/utils/auth";
import { Subject } from "@prisma/client";
import { useAdminMutation, useAdminQuery } from "@/utils/hooks/useAdminData";
import Link from "next/link";
import React from "react";
import { Sidebar } from "@/components/sidebar";
import { ProfileLayout } from "@/components/layout";
import { UserDashboard } from "@/components/profile/dashboards";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export const ProfileData = z.object({
  name: z.string(),
  biography: z.string(),
  test: z.number(),
});

const SubjectSchema = z.object({
  name: z.string().describe(""),
  cheese: z.enum(["True", "False"]).describe("checkbox"),
  pasta: z.boolean().describe("password"),
});

function Subject() {
  const { data: session } = useSession();
  const DynamicSchema = React.useMemo(
    () =>
      z.object({
        name: z.string().default(session?.user.name || "as"),
      }),
    [session]
  );

  const { data: subjectData, isLoading } = useAdminQuery<Subject[]>({
    session: session || ({} as any),
    endpoint: "user",
  });
  const { state, onChange, onSubmit } = useAdminMutation({
    schema: DynamicSchema,
    endpoint: "user",
  });

  if (isLoading) return <div>Loading...</div>;

  return subjectData !== undefined ? (
    <div>
      {JSON.stringify(session)}
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

function Admin() {
  const [active, setActive] = React.useState<string>("Profile");

  function onClick(target: string) {
    setActive(target);
  }

  const { data } = api.profile.get.useQuery();

  return (
    <ProfileLayout active={active} onClick={onClick}>
      <div className="space-y-8">
        {JSON.stringify(data)}
        <UserDashboard />{" "}
      </div>{" "}
    </ProfileLayout>
  );
}

export default Subject;
