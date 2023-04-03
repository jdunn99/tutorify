import { Button } from "@/components/button";
import { BooleanInput, FormInput } from "@/components/input";
import { api } from "@/utils/api";
import withAuthHOC from "@/utils/auth";
import { useForm } from "@/utils/hooks/useFormReducer";
import { useRouter } from "next/router";
import React from "react";
import { z } from "zod";
import { TutorApplicationLayout } from ".";

const schema = z.object({
  age: z.number().int().min(18).max(99).default(18),
  phone: z.string().describe("tel").min(10),
  address: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1), // enum ?
  zip: z.string().min(5),
  country: z.string().min(1),
  isWorkAuthorized: z.boolean().describe("checkbox"),
  needsVisaSponsorship: z.boolean().describe("checkbox"),
  hasVisaDependency: z.boolean().describe("checkbox"),
  hasInternetConnection: z.boolean().describe("checkbox"),
  hasTechnicalKnowledge: z.boolean().describe("checkbox"),
  hasMicrophone: z.boolean().describe("checkbox"),
  hasWebcam: z.boolean().describe("checkbox"),
});

function BasicInfo() {
  const router = useRouter();
  const { state, onChange, validate } = useForm(schema);
  const { mutateAsync: update } = api.tutor.updateApplication.useMutation();

  async function onClick() {
    const { result } = validate();
    if (!result) return;

    const { state, city, zip, address, address2, country, ...rest } = result;

    await update({
      basicInfo: {
        location: {
          city,
          state,
          zip,
          address,
          address2,
          country,
        },
        ...rest,
      },
      applicationStatus: "profile",
    });

    router.push("/auth/tutor/profile");
  }

  return (
    <TutorApplicationLayout>
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
          <div className="flex items-center gap-2">
            <Button onClick={onClick}>Next</Button>
          </div>
        </div>
      </div>
    </TutorApplicationLayout>
  );
}

export default withAuthHOC(BasicInfo, { isTutor: true });
