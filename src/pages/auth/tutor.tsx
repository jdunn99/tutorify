import { Button } from "@/components/button";
import { Footer } from "@/components/footer";
import {
  BooleanInput,
  DropdownInput,
  FormInput,
  generateArrayOptions,
  Input,
  TextArea,
} from "@/components/input";
import { Spinner } from "@/components/loading";
import { Navbar } from "@/components/navbar";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/prisma";
import { api } from "@/utils/api";
import {
  FieldConfig,
  FormState,
  useForm,
  validate,
} from "@/utils/hooks/useFormReducer";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { RegisterComponent } from "./register";

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
  headline: z.string().min(1).max(65),
  biography: z.string().min(1),
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

const coreSubjectMapping = {
  MATH: "Math",
  SCIENCE: "Science",
  SOCIAL_STUDIES: "Social Studies",
  LANGUAGE_ARTS: "Language Arts",
};

interface FormProps {
  onChange(event: React.ChangeEvent<HTMLElement>, value?: any): void;
  state: FormState;
}
interface SectionProps {
  next?(): void;
  prev?(): void;
}
type SectionWithFormProps = SectionProps & FormProps;

interface SubjectProps extends SectionProps {
  subjectsSelected: string[];
  setSubjectsSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

function SubjectSection({
  subjectsSelected,
  setSubjectsSelected,
}: SubjectProps) {
  const { data: groupedSubjects } = api.subject.getGroupedSubjects.useQuery();

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

  return (
    <section className="py-10">
      <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-slate-800">Select your subjects.</h1>
        <p>
          Select 1–5 subjects you&apos;d like to tutor. You can add more later
          once you&apos;re done signing up.{" "}
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
  );
}

export default function TutorRegister() {
  const { state, onChange, dispatch } = useForm(schema, `tutor/application`);
  const [index, setIndex] = React.useState<number>(0);
  const { mutateAsync: submitApplication } =
    api.tutor.submitApplication.useMutation();

  const router = useRouter();

  /**
   * Submit validated state to our api endpoint.
   */
  // const onSubmit = React.useCallback(async () => {
  //   const { result, errors } = validate(state, schema);
  //   if (!result || errors) return;
  //
  //   setIndex(6);
  //   // mutate to tutor api
  //   const success = await submitApplication({ id, data: result });
  //   if (success) router.push(`/profile`);
  // }, [state, submitApplication, id, router]);

  const handleNext = React.useCallback(
    <T extends z.ZodTypeAny>(schema: T) => {
      const { errors } = validate(state, schema);

      if (errors) {
        dispatch({ type: "VALIDATE", payload: { errors } });
        return;
      }

      setIndex((index) => index + 1);
    },
    [dispatch, state]
  );

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

  // Static welcome section
  function Welcome() {
    return (
      <React.Fragment>
        <p className="text-sm leading-7 text-slate-600">
          Welcome to the tutorify tutor application form! Join our team of
          passionate tutors and help students achieve their academic goals.
          Apply below to make a positive impact on the lives of students.
        </p>
        <Button className="w-full" onClick={() => setIndex(1)}>
          Get started
        </Button>
      </React.Fragment>
    );
  }

  function BasicInfo() {
    return (
      <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-green-600">Basic Information</h1>
        <p className="text-slate-600">
          Enter some basic information about yourself.
        </p>
        <div className="mb-16 space-y-6">
          <h2 className="text-slate-800">Location</h2>
          <div className="flex items-start gap-4">
            <FormInput state={state.age} label="Age" onChange={onChange} />
            <FormInput
              state={state.phone}
              label="Phone Number"
              onChange={onChange}
            />
          </div>
          <FormInput
            state={state.address}
            label="Address"
            onChange={onChange}
          />
          <FormInput
            state={state.address2}
            label="Address (cont)."
            onChange={onChange}
          />

          <div className="flex items-start gap-4">
            <FormInput state={state.city} label="City" onChange={onChange} />
            <FormInput state={state.state} label="State" onChange={onChange} />
          </div>

          <div className="flex items-start gap-4">
            <FormInput
              state={state.zip}
              label="Postal Code"
              onChange={onChange}
            />
            <FormInput
              state={state.country}
              label="Country"
              onChange={onChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16 ">
          <div>
            <h2 className="text-slate-800">Work Authorization</h2>
            <BooleanInput
              state={state.isWorkAuthorized}
              labels={[
                "I have authorization to work in the U.S",
                "I do not have authorization to work in the U.S",
              ]}
              heading="Please choose from the following:"
              onChange={onChange}
            />
            <BooleanInput
              state={state.needsVisaSponsorship}
              heading="Will you now or in the future require sponsorship for employment visa status (e.g., H-1B visa, F1-visa, and/or OPT Status)?"
              onChange={onChange}
            />
            <BooleanInput
              state={state.hasVisaDependency}
              heading="Is your work authorization dependent upon the status of a visa(for example, but not limited to F1 or H-1B)?"
              onChange={onChange}
            />
          </div>
          <div>
            <h2 className="text-slate-800">Technical Information</h2>
            <BooleanInput
              state={state.hasInternetConnection}
              heading="Do you have regular access to a high-speed internet connection?"
              onChange={onChange}
            />

            <BooleanInput
              onChange={onChange}
              state={state.hasTechnicalKnowledge}
              heading="Do you have basic computer knowledge with the ability to edit certain files including, but not limited to, Office files (.docx, .xlsx, .pptx)"
            />
            <BooleanInput
              onChange={onChange}
              state={state.hasMicrophone}
              heading="Do you possess a headset or speaker/microphone setup?"
            />
            <BooleanInput
              onChange={onChange}
              state={state.hasWebcam}
              heading="Do you possess a webcam or integrated camera?"
            />
          </div>
          <div></div>
        </div>
        <IndexButtons schema={BasicInfoSchema} />
      </div>
    );
  }

  function Education() {
    return (
      <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-green-600">Complete your profile.</h1>
          <p>Give me some information about the test</p>
        </div>
        <div>
          <h2 className="text-slate-800">Photo</h2>
          <input
            type="file"
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg  file:text-sm file:font-semibold file:bg-white file:text-green-600 hover:file:bg-green-50 file:shadow-sm file:border-green-400 file:border file:outline-none"
          />
        </div>
        <div>
          <h2 className="text-slate-800">Heading</h2>
          {FormInput({
            onChange,
            state: state.headline,
            label: "Heading",
            textarea: true,
          })}
        </div>
        <div>
          <h2 className="text-slate-800">Biography</h2>
          {FormInput({
            onChange,
            state: state.biography,
            label: "Biography",
            textarea: true,
            height: "h-[20vh]",
          })}
        </div>
        <div className="space-y-8">
          <h2 className="text-slate-800">Education</h2>
          <FormInput state={state.school} label="School" onChange={onChange} />
          <DropdownInput
            onChange={onChange}
            label="Degree earned"
            placeholder="Degree earned"
            state={state.degree}
          >
            {generateArrayOptions(degrees)}
          </DropdownInput>
          <FormInput
            onChange={onChange}
            state={state.fieldOfStudy}
            label="Field of Study"
          />
          <div className="flex items-end gap-4 w-full">
            <DropdownInput
              onChange={onChange}
              label="Start date"
              placeholder="Month started"
              state={state.educationMonthStarted}
            >
              {generateArrayOptions(months)}
            </DropdownInput>
            <DropdownInput
              onChange={onChange}
              placeholder="Year started"
              state={state.educationYearStarted}
            >
              {generateYearOptions()}
            </DropdownInput>
          </div>
          <div className="flex items-end gap-4 w-full">
            <DropdownInput
              onChange={onChange}
              label="End date (or expected)"
              placeholder="Month ended"
              state={state.educationMonthEnded}
            >
              {generateArrayOptions(months)}
            </DropdownInput>
            <DropdownInput
              onChange={onChange}
              state={state.educationYearEnded}
              placeholder="Year ended"
            >
              {generateYearOptions()}
            </DropdownInput>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-slate-800">Experience</h2>
          <FormInput
            onChange={onChange}
            state={state.employmentTitle}
            label="Title"
          />

          <DropdownInput
            onChange={onChange}
            label="Employment type"
            placeholder="Employment type"
            state={state.employmentType}
          >
            {generateArrayOptions(employmentType)}
          </DropdownInput>
          <FormInput
            onChange={onChange}
            state={state.companyName}
            label="Company Name"
          />
          <div className="flex items-end gap-4 w-full">
            <DropdownInput
              onChange={onChange}
              label="Start date"
              placeholder="Month started"
              state={state.employmentMonthStarted}
            >
              {generateArrayOptions(months)}
            </DropdownInput>
            <DropdownInput
              onChange={onChange}
              placeholder="Year started"
              state={state.employmentYearStarted}
            >
              {generateYearOptions()}
            </DropdownInput>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                className="mr-2 accent-green-600"
                onClick={() => setStillWorks(!stillWorks)}
              />
              I still work here.
            </label>
          </div>
          {!stillWorks ? (
            <div className="flex items-end gap-4 w-full">
              <DropdownInput
                onChange={onChange}
                label="End date"
                placeholder="Month ended"
                state={state.employmentMonthEnded}
              >
                {generateArrayOptions(months)}
              </DropdownInput>
              <DropdownInput
                onChange={onChange}
                state={state.employmentYearEnded}
                placeholder="Year ended"
              >
                {generateYearOptions()}
              </DropdownInput>
            </div>
          ) : null}
          <div>
            <p className="text-sm leading-7 text-slate-600">
              Please sumbit your resume below in .pdf form
            </p>
            <input type="file" />
          </div>
        </div>{" "}
        <IndexButtons schema={EducationSchema} />
      </div>
    );
  }

  const [stillWorks, setStillWorks] = React.useState<boolean>(false);
  const { data: session } = useSession();

  const [subjectsSelected, setSubjectsSelected] = React.useState<string[]>([]);

  return typeof session === "undefined" || session === null ? (
    <RegisterComponent isTutor />
  ) : (
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
            <Button disabled={subjectsSelected.length === 0}>Next</Button>
          </div>
        </div>
      </div>
      <div className="flex h-full overflow-y-auto flex-col">
        <Navbar />
        <main>
          <section className="py-8">
            <SubjectSection
              subjectsSelected={subjectsSelected}
              setSubjectsSelected={setSubjectsSelected}
            />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
