import { Button } from "@/components/button";
import {
  DropdownInput,
  FormInput,
  generateArrayOptions,
} from "@/components/input";

import { api } from "@/utils/api";
import withAuthHOC from "@/utils/auth";
import { useForm } from "@/utils/hooks/useFormReducer";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { TutorApplicationLayout } from ".";

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

const schema = z.object({
  headline: z.string(),
  biography: z.string(),
  hourlyRate: z.number().nonnegative(),
  school: z.string().min(1),
  degree: z.string(),
  fieldOfStudy: z.string(),
  educationYearStarted: z.string().min(4).max(4),
  educationYearEnded: z.string().optional(),
  educationMonthStarted: z.string(),
  educationMonthEnded: z.string().optional(),
  employmentTitle: z.string().nonempty(),
  employmentType: z.string(),
  companyName: z.string().min(1),
  employmentMonthStarted: z.string(),
  employmentYearStarted: z.string(),
  employmentMonthEnded: z.string(),
  employmentYearEnded: z.string(),
});

function ApplicationProfile() {
  const { state, onChange, validate } = useForm(schema);
  const { mutateAsync: update } = api.tutor.updateApplication.useMutation();
  const [stillWorks, setStillWorks] = React.useState<boolean>(false);

  const router = useRouter();

  async function onSubmit() {
    const { result } = validate();
    if (!result) return;

    const {
      school,
      degree,
      fieldOfStudy,
      educationYearEnded,
      educationYearStarted,
      educationMonthEnded,
      educationMonthStarted,
      employmentTitle,
      employmentType,
      companyName,
      employmentYearEnded,
      employmentMonthEnded,
      employmentYearStarted,
      employmentMonthStarted,
      ...rest
    } = result;

    await update({
      profile: {
        education: {
          school,
          degree,
          fieldOfStudy,
          yearStarted: educationYearStarted,
          yearEnded: educationYearEnded,
          monthStarted: educationMonthStarted,
          monthEnded: educationMonthEnded,
        },
        employment: {
          title: employmentTitle,
          type: employmentType,
          companyName,
          yearStarted: employmentYearStarted,
          yearEnded: employmentYearEnded,
          monthStarted: employmentMonthStarted,
          monthEnded: employmentMonthEnded,
        },
        ...rest,
      },
      applicationStatus: "profile",
    });

    router.push("/");
  }

  return (
    <TutorApplicationLayout>
      <div className="prose mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-green-600">Complete your profile.</h1>
          <p>Give me some information about the test</p>
        </div>
        <div>
          <h2 className="text-slate-800">Photo</h2>
          <input type="file" />
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
        </div>
        <div className="w-full mx-auto">
          <Button className="block mx-auto text-center" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </TutorApplicationLayout>
  );
}

export default withAuthHOC(ApplicationProfile, { isTutor: true });
