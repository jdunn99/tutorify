import z from "zod";
import withAuth, { type WithSession } from "@/utils/auth";
import { useQueryClient } from "@tanstack/react-query";
import { Subject } from "@prisma/client";
import { useForm, validate } from "@/utils/hooks/useFormReducer";
import {
  useAdminData,
  useAdminMutation,
  useAdminQuery,
} from "@/utils/hooks/useAdminData";

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
    endpoint: "subject",
  });
  const { state, onChange, onSubmit } = useAdminMutation({
    schema: SubjectSchema,
    endpoint: "subject",
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
  const { state, dispatch } = useForm(ProfileData);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch({ type: "UPDATE_FIELD", payload: { field: name, value } });
  }

  async function onSubmit() {
    const values = validate(state, ProfileData);
    console.log(values);
  }

  return <Subject session={session} />;
}

export default withAuth(Admin);
