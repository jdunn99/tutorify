import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Spinner } from "@/components/loading";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/prisma";
import { api } from "@/utils/api";
import { FieldConfig, useForm, validate } from "@/utils/hooks/useFormReducer";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";

/* Zod Schemas */

const BasicInfoSchema = z.object({
  age: z.number().int().min(18).max(99).default(18),
  phone: z.string().describe("tel").min(10),
  address: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1), // enum ?
  zip: z.string().min(5),
  country: z.string().min(1),
});

const AuthorizationSchema = z.object({
  isWorkAuthorized: z.boolean().describe("checkbox"),
  needsVisaSponsorship: z.boolean().describe("checkbox"),
  hasVisaDependency: z.boolean().describe("checkbox"),
});

const TechnicalSchema = z.object({
  hasInternetConnection: z.boolean().describe("checkbox"),
  hasTechnicalKnowledge: z.boolean().describe("checkbox"),
  hasMicrophone: z.boolean().describe("checkbox"),
  hasWebcam: z.boolean().describe("checkbox"),
});

const EducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string(),
  fieldOfStudy: z.string(),
  educationYearStarted: z.string().min(4).max(4),
  educationYearEnded: z.string().optional(),
  educationMonthStarted: z.string(),
  educationMonthEnded: z.string().optional(),
});

const EmploymentSchema = z.object({
  employmentTitle: z.string().nonempty(),
  employmentType: z.string(),
  companyName: z.string().min(1),
  employmentMonthStarted: z.string(),
  employmentYearStarted: z.string(),
  employmentMonthEnded: z.string(),
  employmentYearEnded: z.string(),
});

const schema = z
  .object({})
  .merge(AuthorizationSchema)
  .merge(BasicInfoSchema)
  .merge(TechnicalSchema)
  .merge(EducationSchema)
  .merge(EmploymentSchema);

type State = {
  value: string | number | boolean;
  config: FieldConfig<any>;
  error?: string;
};

interface InputProps {
  state: State;
  label?: string;
  children?: React.ReactNode;
}

interface BooleanInputProps {
  state: State;
  heading: string;
  labels?: string[];
}

interface DropdownInputProps extends InputProps {
  placeholder: string;
}

function RegistrationSection({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) {
  return (
    <React.Fragment>
      <h1 className="text-xl font-bold text-slate-900 ">{heading}</h1>
      {children}
    </React.Fragment>
  );
}

/*
 * Generates array of options where the value is a 100 year range
 * */
function generateYearOptions(): JSX.Element[] {
  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    yearOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }
  return yearOptions;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const degrees = [
  "No degree",
  "Associate",
  "Bachelor's",
  "Master's",
  "Doctoral",
  "Professional Degree",
  "Other",
];

const employmentType = ["Full time", "Part time", "Contract", "Other"];

/*
 * Generates an array of options given a list of keys
 */
function generateArrayOptions(keys: string[]): JSX.Element[] {
  const options = [];
  for (let i = 0; i < keys.length; i++) {
    options.push(
      <option key={i + 1} value={keys[i]}>
        {keys[i]}
      </option>
    );
  }

  return options;
}

export default function TutorRegister({
  session,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { state, onChange, dispatch } = useForm(schema, `tutor/application`);
  const [index, setIndex] = React.useState<number>(0);
  const { mutateAsync: submitApplication } =
    api.tutor.submitApplication.useMutation();

  const router = useRouter();

  /**
   * Submit validated state to our api endpoint.
   */
  const onSubmit = React.useCallback(async () => {
    const { result, errors } = validate(state, schema);
    if (!result || errors) return;

    setIndex(6);
    // mutate to tutor api
    const success = await submitApplication({ id, data: result });
    if (success) router.push(`/profile/${id}`);
  }, [state, submitApplication, id, router]);

  const memoizedState = React.useMemo(() => JSON.stringify(state), [state]);
  const storageCallback = React.useCallback(
    () => localStorage.setItem(`tutor/application`, memoizedState),
    [memoizedState]
  );

  /*
   * Handle clicking the next button. Maybe should remove hardcoded values in the future
   */
  const handleNext = React.useCallback(
    <T extends z.ZodTypeAny>(schema: T) => {
      const { errors } = validate(state, schema);
      storageCallback();

      if (errors) {
        dispatch({ type: "VALIDATE", payload: { errors } });
        return;
      }

      if (index === 5) onSubmit(); // submit
      setIndex(index + 1);
    },
    [index, state, dispatch, storageCallback, onSubmit]
  );

  /*
   * Handle clicking the prev button
   */
  function handlePrev() {
    setIndex((index) => (index <= 1 ? index : index - 1));
  }

  /*
   * Render buttons to change between sections in the form.
   */
  function IndexButtons<T extends z.ZodTypeAny>({ schema }: { schema: T }) {
    return (
      <div className="flex items-center gap-2 justify-center w-full">
        <Button onClick={handlePrev} disabled={index === 1}>
          Prev
        </Button>
        <Button onClick={() => handleNext(schema)}>
          {index === 5 ? "Submit" : "Next"}
        </Button>
      </div>
    );
  }

  /* INPUTS */

  /*
   * Render a standard input
   */
  function FormInput({ state, label }: InputProps) {
    let { value, config, error } = state;
    const { type, label: name } = config;

    if (typeof value === "boolean") value = "";

    return (
      <label
        htmlFor={label}
        className="text-sm flex-1 block w-full font-semibold"
      >
        {label}
        <Input
          type={type}
          className={`mt-2 font-normal w-full ${
            error ? "border border-red-500" : ""
          }`}
          value={value}
          onChange={onChange}
          name={name}
          placeholder={label}
        />
        <span className="font-normal text-xs text-red-500">{error}</span>
      </label>
    );
  }

  /*
   * Render a checkbox to represent boolean inputs.
   */
  function BooleanInput({
    state,
    labels = ["Yes", "No"],
    heading,
  }: BooleanInputProps) {
    const { value, config, error } = state;
    const { type, label: name } = config;

    /*
     * Override the value to a boolean in the in our default onChange behavior
     */
    function onCheckboxChange(
      event: React.ChangeEvent<HTMLInputElement>,
      value: boolean
    ) {
      const { name: field, checked } = event.target;

      if (checked)
        dispatch({ type: "UPDATE_FIELD", payload: { field, value } });
    }

    return (
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-900">{heading}</p>
        {error ? (
          <span className="font-normal text-xs text-red-500">
            Value is required
          </span>
        ) : null}
        {labels.map((label, index) => (
          <label key={label} className="block">
            <input
              className="mr-1"
              type={type}
              name={name}
              checked={index === 0 ? value === true : value === false}
              onChange={(event) => {
                onCheckboxChange(event, index === 0 ? true : false);
              }}
            />{" "}
            {label}
          </label>
        ))}
      </div>
    );
  }

  /*
   * Renders an array of strings into a select component
   */
  function DropdownInput({
    state,
    label,
    placeholder,
    children,
  }: DropdownInputProps) {
    const { value, config, error } = state;
    const { label: name } = config;

    return (
      <label
        htmlFor={name}
        className="text-sm flex-1 block w-full font-semibold"
      >
        {label}
        <select
          className={`mt-2 font-normal w-full p-2 ${
            error ? "border border-red-500" : ""
          }`}
          value={value.toString().length === 0 ? "none" : value.toString()}
          onChange={onChange}
          name={name}
        >
          <option value="none" disabled>
            {placeholder}
          </option>
          {children}
        </select>
        <span className="font-normal text-xs text-red-500">{error}</span>
      </label>
    );
  }

  // Static welcome section
  function Welcome() {
    return (
      <RegistrationSection heading={`Welcome, ${session.user.name!}`}>
        <p className="text-sm leading-7 text-slate-600">
          Welcome to the tutorify tutor application form! Join our team of
          passionate tutors and help students achieve their academic goals.
          Apply below to make a positive impact on the lives of students.
        </p>
        <Button className="w-full" onClick={() => setIndex(1)}>
          Get started
        </Button>
      </RegistrationSection>
    );
  }

  // Doing components like {FormInput(...)} will prevent rerenders of the input.
  function BasicInfo() {
    return (
      <RegistrationSection heading="Basic Info">
        <div className="flex items-start gap-4">
          {FormInput({ state: state.age, label: "Age" })}
          {FormInput({ state: state.phone, label: "Phone Number" })}
        </div>
        {FormInput({ state: state.address, label: "Address" })}

        <div className="flex items-start gap-4">
          {FormInput({ state: state.city, label: "City" })}
          {FormInput({ state: state.state, label: "State" })}
          {FormInput({ state: state.zip, label: "Postal Code" })}
        </div>

        {FormInput({ state: state.country, label: "Country" })}
        <IndexButtons schema={BasicInfoSchema} />
      </RegistrationSection>
    );
  }

  function WorkAuthorization() {
    return (
      <RegistrationSection heading="Work Authorization">
        {BooleanInput({
          state: state.isWorkAuthorized,
          labels: [
            "I have authorization to work in the U.S",
            "I do not have authorization to work in the U.S",
          ],
          heading: "Please choose from the following:",
        })}
        {BooleanInput({
          state: state.needsVisaSponsorship,
          heading:
            "Will you now or in the future require sponsorship for employment visa status (e.g., H-1B visa, F1-visa, and/or OPT Status)?",
        })}
        {BooleanInput({
          state: state.hasVisaDependency,
          heading:
            "Is your work authorization dependent upon the status of a visa(for example, but not limited to F1 or H-1B)?",
        })}
        <IndexButtons schema={AuthorizationSchema} />
      </RegistrationSection>
    );
  }

  function TechnicalSpecs() {
    return (
      <RegistrationSection heading="Technical Specifications">
        {BooleanInput({
          state: state.hasInternetConnection,
          heading:
            "Do you have regular access to a high-speed internet connection?",
        })}
        {BooleanInput({
          state: state.hasTechnicalKnowledge,
          heading:
            "Do you have basic computer knowledge with the ability to edit certain files including, but not limited to, Office files (.docx, .xlsx, .pptx)",
        })}
        {BooleanInput({
          state: state.hasMicrophone,
          heading: "Do you possess a headset or speaker/microphone setup?",
        })}
        {BooleanInput({
          state: state.hasWebcam,
          heading: "Do you possess a webcam or integrated camera?",
        })}
        <IndexButtons schema={TechnicalSchema} />
      </RegistrationSection>
    );
  }

  function Education() {
    return (
      <RegistrationSection heading="Education">
        {FormInput({ state: state.school, label: "School" })}
        {DropdownInput({
          label: "Degree earned",
          placeholder: "Degree earned",
          state: state.degree,
          children: generateArrayOptions(degrees),
        })}
        {FormInput({ state: state.fieldOfStudy, label: "Field of Study" })}
        <div className="flex items-end gap-4 w-full">
          {DropdownInput({
            label: "Start date",
            placeholder: "Month started",
            state: state.educationMonthStarted,
            children: generateArrayOptions(months),
          })}
          {DropdownInput({
            placeholder: "Year started",
            state: state.educationYearStarted,
            children: generateYearOptions(),
          })}
        </div>

        <div className="flex items-start gap-4 w-full">
          {DropdownInput({
            label: "End date (or expected)",
            placeholder: "Month ended",
            state: state.educationMonthEnded,
            children: generateArrayOptions(months),
          })}
          {DropdownInput({
            state: state.educationYearEnded,
            placeholder: "Year ended",
            children: generateYearOptions(),
          })}
        </div>
        <IndexButtons schema={EducationSchema} />
      </RegistrationSection>
    );
  }

  const [_resume, setResume] = React.useState<File | undefined>();
  const [stillWorks, setStillWorks] = React.useState<boolean>(false);

  function Experience() {
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { target } = event;
      const file = target.files?.[0];

      setResume(file);
    }

    return (
      <RegistrationSection heading="Experience">
        {FormInput({ state: state.employmentTitle, label: "Title" })}

        {DropdownInput({
          label: "Employment type",
          placeholder: "Employment type",
          state: state.employmentType,
          children: generateArrayOptions(employmentType),
        })}
        {FormInput({ state: state.companyName, label: "Company Name" })}
        <div className="flex items-end gap-4 w-full">
          {DropdownInput({
            label: "Start date",
            placeholder: "Month started",
            state: state.employmentMonthStarted,
            children: generateArrayOptions(months),
          })}
          {DropdownInput({
            placeholder: "Year started",
            state: state.employmentYearStarted,
            children: generateYearOptions(),
          })}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              className="mr-2"
              onClick={() => setStillWorks(!stillWorks)}
            />
            I still work here.
          </label>
        </div>
        {!stillWorks ? (
          <div className="flex items-end gap-4 w-full">
            {DropdownInput({
              label: "End date",
              placeholder: "Month ended",
              state: state.employmentMonthEnded,
              children: generateArrayOptions(months),
            })}
            {DropdownInput({
              state: state.employmentYearEnded,
              placeholder: "Year ended",
              children: generateYearOptions(),
            })}
          </div>
        ) : null}
        <div>
          <p className="text-sm leading-7 text-slate-600">
            Please sumbit your resume below in .pdf form
          </p>
          <input type="file" onChange={handleFileChange} />
        </div>
        <IndexButtons schema={EmploymentSchema} />
      </RegistrationSection>
    );
  }

  function handleRender() {
    switch (index) {
      case 1:
        return BasicInfo();
      case 2:
        return WorkAuthorization();
      case 3:
        return TechnicalSpecs();
      case 4:
        return Education();
      case 5:
        return Experience();
      case 6:
        return <Spinner />;
      default:
        return <Welcome />;
    }
  }

  return (
    <section className="bg-slate-50 h-screen py-8 flex flex-col items-center justify-center">
      <div className="w-full p-6 sm:p-8">
        <div className="max-w-screen-lg space-y-6  mx-auto bg-white p-8 rounded">
          {handleRender()}
        </div>
      </div>
    </section>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: "/auth/signin" };
  }

  // Make sure the user is not a tutor
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { tutorProfile: true },
  });

  if (!profile || profile.tutorProfile !== null)
    return { redirect: { destination: "/" } };

  return {
    props: {
      session,
      id: profile.id,
    },
  };
}
