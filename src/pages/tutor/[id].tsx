import { Badge } from "@/components/badge";
import { Button, ButtonLink } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { Layout } from "@/components/layout";
import { Navbar } from "@/components/navbar";
import { TutorCard } from "@/components/tutorCard";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/prisma";
import { api } from "@/utils/api";
import { Education, Employment, Subject } from "@prisma/client";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { MdLocationPin, MdStar, MdStarHalf } from "react-icons/md";
import { Heading } from "../profile";

function TutorContainer({
  heading,
  children,
}: {
  heading?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg p-6 border space-y-4 bg-white shadow-lg">
      <h1 className="text-xl text-green-600 font-bold">{heading}</h1>
      {children}
    </div>
  );
}

interface TutorHeadingProps {
  image?: string;
  name: string;
  headline: string;
  sessionsCount: number;
  hourlyRate: number;
  state: string;
  country: string;
  onClick(): void;
}

export function TutorHeading({
  image,
  onClick,
  name,
  headline,
  sessionsCount,
  hourlyRate,
  state,
  country,
}: TutorHeadingProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex gap-4 items-start">
        <Image
          alt="Profile Image"
          className="rounded-xl flex self-start"
          src="https://randomuser.me/api/portraits/men/6.jpg"
          height={96}
          width={96}
        />
        <div className="flex flex-col flex-1 justify-between h-24">
          <div>
            <h2 className="text-xl font-bold text-green-600">{name}</h2>
            <p className="text-slate-600 text-sm max-w-xl">{headline}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-600 border-r pr-2 border-r-green-300">
              <span className="font-bold text-green-600">{sessionsCount}</span>{" "}
              sessions
            </p>

            <p className="text-xs text-gray-600">
              <MdLocationPin className="inline-block text-sm text-green-600" />{" "}
              {state}, {country}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h4>
          <span className="font-bold text-2xl">${hourlyRate}</span>
          /hour.
        </h4>
        <div className="flex gap-2">
          <Button onClick={onClick}>Book Now</Button>
        </div>
      </div>
    </div>
  );
}

interface EducationExperienceItemProps {
  heading: string;
  subheading: string;
  startYear: string;
  endYear: string | null;
  detail: string;
}
function EducationExperienceItem({
  heading,
  subheading,
  startYear,
  endYear,
  detail,
}: EducationExperienceItemProps) {
  return (
    <div className="space-y-1">
      <h1 className="font-bold text-slate-800">{heading}</h1>
      <p className="text-slate-600 font-medium">{subheading}</p>
      <div className="flex gap-2">
        <p className="text-xs text-slate-600 border-r pr-2 border-green-300">
          {startYear} - {endYear || "Present"}
        </p>
        <p className="text-xs text-slate-600">{detail}</p>
      </div>
    </div>
  );
}

interface AboutSectionProps {
  subjects: { name: string }[];
  biography: string;
  education: Education;
  experience: Employment;
}
function AboutSection({
  subjects,
  biography,
  education,
  experience,
}: AboutSectionProps) {
  return (
    <TutorContainer heading="About">
      <div className="flex gap-2">
        {subjects.map(({ name }) => (
          <Badge key={name} variant="primary">
            {name}
          </Badge>
        ))}
      </div>
      <p className="font-medium text-sm text-slate-600">{biography}</p>

      <h1 className="text-lg text-green-600 font-bold">Education</h1>
      <EducationExperienceItem
        heading={education.school}
        subheading={education.fieldOfStudy}
        detail={education.degree}
        startYear={education.yearStarted}
        endYear={education.yearEnded}
      />
      <h1 className="text-lg text-green-600 font-bold">Experience</h1>
      <EducationExperienceItem
        heading={experience.title}
        subheading={experience.companyName}
        detail={experience.type}
        startYear={experience.yearStarted}
        endYear={experience.yearEnded}
      />
    </TutorContainer>
  );
}

function ReviewSection() {
  return (
    <TutorContainer heading="Reviews">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-lg font-bold text-slate-800 mr-2">4.8</h1>
          <MdStar className="text-green-500" />
          <MdStar className="text-green-500" />
          <MdStar className="text-green-500" />
          <MdStar className="text-green-500" />
          <MdStarHalf className="text-green-500" />
        </div>
        <p className="text-sm font-medium text-slate-600">7 reviews</p>
      </div>

      <div className="py-4 px-8 border rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-green-600">Jack Dunn</h1>
          <div className="flex items-center gap-0.5">
            <h1 className="text-lg font-bold text-slate-800 mr-2">5.0</h1>
            <MdStar className="text-green-500" />
            <MdStar className="text-green-500" />
            <MdStar className="text-green-500" />
            <MdStar className="text-green-500" />
            <MdStar className="text-green-500" />
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium">April 04, 2023</p>
        <p className="text-slate-600 text-sm font-medium pt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>
    </TutorContainer>
  );
}

function TutorProfile({
  session,
  profile,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { location, employment, education, subjects, user, _count } = profile;
  const [date, setDate] = React.useState<Date>(new Date());
  const ref = React.useRef<HTMLDivElement>(null);

  const { query } = useRouter();

  const slots: string[] = [];

  for (let i = 8; i <= 20; i++) {
    const hour = i > 12 ? i - 12 : i;
    const timeSlot = `${hour === 12 ? 12 : hour}:00 ${i < 12 ? "AM" : "PM"}`;
    slots.push(timeSlot);
  }

  const [slot, setSlot] = React.useState<string>();

  function onSlotClick(newSlot: string) {
    if (session === null) return;
    setSlot(newSlot);
  }

  function scroll() {
    if (typeof window !== "undefined" && ref.current)
      ref.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <Layout navbar={false}>
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        {JSON.stringify(query)}
        <TutorHeading
          onClick={scroll}
          state={location!.state}
          name={user!.name!}
          country={location!.country}
          hourlyRate={profile.hourlyRate!}
          sessionsCount={_count.appointments}
          headline={profile.headline!}
        />
        <AboutSection
          education={education!}
          biography={profile.biography!}
          subjects={subjects!}
          experience={employment!}
        />
        <div ref={ref}>
          <TutorContainer heading="Availability">
            <div className="flex items-end gap-4">
              <Calendar
                activeDate={date}
                onDateClick={setDate}
                hasEvents={false}
              />
              <div className="flex flex-col gap-2">
                {slots.map((timeSlot) => (
                  <ButtonLink
                    aria-disabled="true"
                    variant="open"
                    href={`/appointment?day=${date.toISOString().substring(0,10)}&time=${timeSlot}&tutorId=${id}`}
                    key={timeSlot}
                    className={`p-2 rounded-lg border ${session === null ? "pointer-events-none" : ""} ${
                      slot === timeSlot
                        ? "bg-green-200 text-green-600 font-semibold border-green-500 shadow-lg"
                        : ""
                    } cursor-pointer hover:border-green-500 shadow duration-100 hover:bg-green-200 hover:text-green-600 hover:font-semibold`}
                  >
                    {timeSlot}
                  </ButtonLink>
                ))}
              </div>
            </div>
          </TutorContainer>
        </div>
        <ReviewSection />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res, query } = context;
  const { id } = query;
  const session = await getServerAuthSession({ req, res });

  if (typeof id !== "string") return { notFound: true };

  const result = await prisma.tutor.findUnique({
    where: { userId: id },
    select: {
      location: true,
      employment: true,
      education: true,
      headline: true,
      id: true,
      subjects: {
        select: {
          name: true,
        },
      },
      biography: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      hourlyRate: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  if (!result) return { notFound: true };

  return {
    props: {
      session,
      profile: result,
      id,
    },
  };
}

export default TutorProfile;
