import z, { ZodFirstPartyTypeKind, type ZodObjectDef } from "zod";
import withAuth, { type WithSession } from "@/utils/auth";
import { Role } from "@prisma/client";
import {
  type FormState,
  useForm,
  type FormFieldTypes,
  validate,
} from "@/utils/hooks/useFormReducer";

export const ProfileData = z.object({
  name: z.string(),
  biography: z.string(),
  test: z.number(),
});


function Admin({ session }: WithSession) {
  const { state, dispatch } = useForm(ProfileData);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    dispatch({ type: "UPDATE_FIELD", payload: { field: name, value } });
  }

  async function onSubmit() {
    const values = validate(state, ProfileData)
    console.log(values);
  }

  return (
    <>
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
      <div>{JSON.stringify({state})}</div>
      <button onClick={onSubmit}>Test</button>
    </>
  );
}

export default withAuth(Admin, { roles: [Role.USER] });
