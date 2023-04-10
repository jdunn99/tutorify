import { Button } from "@/components/button";
import {
  DropdownInput,
  FormInput,
  generateArrayOptions,
  Input,
} from "@/components/input";
import { Container, Layout } from "@/components/layout";
import { Loading } from "@/components/loading";
import { Navbar } from "@/components/navbar";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { useForm } from "@/utils/hooks/useFormReducer";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { z } from "zod";

function Appointment({
  session,
  tutorId,
  _day,
  _time,
}: InferGetServerSidePropsType<typeof getServerSideProps> & WithSession) {
  const schema = React.useMemo(
    () =>
      z.object({
        day: z
          .string()
          .default(_day || "")
          .describe("date"),
        time: z.string().default(_time || ""),
        title: z.string().min(1),
        subject: z.string().min(1),
        description: z.string().min(1),
      }),
    [_day, _time]
  );
  const { state, onChange, validate } = useForm(schema);

  const { data: tutor, isLoading } = api.tutor.getById.useQuery(
    { id: tutorId || "" },
    { enabled: typeof tutorId === "string" }
  );
  const { mutateAsync: createAppointment } =
    api.appointment.create.useMutation();

  async function onSubmit() {
    const { result } = validate();
    if (!result) return;

    const { title, day, time, subject, description } = result;
    const start = new Date(`${day} ${time}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    await createAppointment({
      tutorId: tutor!.id,
      studentId: session.user.id,
      subjectId: subject,
      description,
      price: tutor!.tutorProfile!.hourlyRate || 0,
      title,
      status: "SCHEDULED",
      start,
      end,
    });
  }

  if (!tutor || isLoading) return <Loading />;

  return (
    <Layout navbar={false}>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8  ">
        <h1 className="text-2xl text-slate-800 font-bold mb-8">
          Appointment With{" "}
          <Link
            href={`/tutor/${tutor.id}`}
            className="underline text-green-500 hover:text-green-600 duration-100"
          >
            {tutor.name}
          </Link>
        </h1>

        <div className="flex items-start gap-4 flex-col sm:flex-row">
          <div className="w-full flex-[0.85] flex flex-col gap-8">
            <Container>
              <div>
                <h2 className="font-bold text-slate-800">Choose Day & Time</h2>
                <p className="text-sm text-slate-500">
                  Choose the day and time you with to meet with {tutor.name}.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  <FormInput
                    state={state.day}
                    onChange={onChange}
                    label="Day"
                  />

                  <DropdownInput
                    state={state.time}
                    label="Time"
                    onChange={onChange}
                    placeholder={_time || ""}
                  >
                    <option value={_time}>{_time}</option>
                  </DropdownInput>
                </div>
              </div>
            </Container>

            <Container>
              <div>
                <h2 className="font-bold text-slate-800">
                  Appointment Information
                </h2>
                <p className="text-sm text-slate-500">
                  Enter some basic information about your appointment.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-col sm:flex-row">
                <FormInput
                  onChange={onChange}
                  state={state.title}
                  label="Title"
                />

                <DropdownInput
                  state={state.subject}
                  label="Subject"
                  onChange={onChange}
                  placeholder={"Subject" || ""}
                >
                  {tutor.tutorProfile
                    ? tutor.tutorProfile.subjects
                      ? tutor.tutorProfile.subjects.map(({ name, id }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))
                      : null
                    : null}
                </DropdownInput>
              </div>
              <FormInput
                onChange={onChange}
                state={state.description}
                label="Description"
                textarea
                height="h-40"
              />
            </Container>
          </div>
          <div className="w-full flex-[0.33]">
            <Container size="small">
              <div className="flex items-center gap-2 border-b pb-4">
                <Image
                  alt="Profile Image"
                  className="rounded-lg"
                  src="https://randomuser.me/api/portraits/men/6.jpg"
                  height={32}
                  width={32}
                />

                <div>
                  <h1 className="text-sm font-bold text-green-600">
                    {tutor.name}
                  </h1>
                  <p
                    className="text-slate-500 block font-medium text-xs"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tutor.tutorProfile!.headline}
                  </p>
                </div>
              </div>
              <div className="flex items-center font-medium justify-between border-b pt-4 pb-2 text-xs">
                <p className="text-green-600">Hourly rate</p>
                <p className="font-bold">
                  ${tutor.tutorProfile!.hourlyRate}.00
                </p>
              </div>

              <div className="flex items-center font-medium justify-between border-b pb-2 text-xs">
                <p className="text-green-600">Fees and taxes</p>
                <p className="font-bold">$0.00</p>
              </div>

              <div className="flex items-center justify-between pt-4 text-sm">
                <p className="font-semibold">Total:</p>
                <p className="font-bold">$0.00</p>
              </div>
              <Button className="w-full" onClick={onSubmit}>
                Pay $0.00
              </Button>
            </Container>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  if (!query || typeof query === "undefined")
    return { redirect: { destination: "/search" } };

  const { tutorId, time, day } = query;
  if (typeof tutorId !== "string")
    return { redirect: { destination: "/search" } };

  return {
    props: {
      tutorId: tutorId,
      _time: typeof time === "string" ? time : undefined,
      _day: typeof day === "string" ? day : undefined,
    },
  };
}
export default withAuthHOC(Appointment);
