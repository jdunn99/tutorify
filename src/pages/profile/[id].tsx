import React from "react";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
  type GetServerSideProps,
} from "next";
import { api } from "@/utils/api";
import { Container, ProfileLayout } from "@/components/layout";
import { UserDashboard } from "@/components/profile/dashboards";
import { getSession } from "next-auth/react";
import { getServerSession, Session } from "next-auth";
import { Role } from "@prisma/client";
import { MdApps, MdSchool, MdWork } from "react-icons/md";
import { Loading } from "@/components/loading";
import { Button } from "@/components/button";
import { prisma } from "@/server/prisma";
import { getServerAuthSession } from "@/server/auth";
import { Sidebar } from "@/components/sidebar";

function Temp(profile: any) {
  const ProfileHeading = () => (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          <p className="text-lg">Headline</p>
        </div>
        <div className="flex items-center flex-wrap justify-center md:justify-start map-2 gap-2">
          <Button>Book Now</Button>
          <Button variant="open">Send a Message</Button>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm">Selbyville, Delaware, USA</p>
        <p className="text-sm">
          Tutoring since {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 flex flex-col items-center justify-center text-center md:block md:text-left">
      <ProfileHeading />
      <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
        <span className="bg-sky-100 text-sky-800 text-xs font-medium  px-2.5 py-0.5 rounded">
          Math
        </span>
      </div>
      <div className="space-y-2 border-b-gray-100 pb-4 border-b">
        <h3 className="text-xl font-semibold">About</h3>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum
        </p>
      </div>
      <div className="space-y-2 border-b-gray-100 pb-4 border-b">
        <h3 className="text-xl font-semibold">Qualifications & Experience</h3>

        <div className="flex items-start gap-4">
          <div className="text-4xl bg-sky-100 text-sky-800 p-2 rounded">
            <MdWork />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-semibold">Software Engineer</h4>
            <p className="text-sm">Slotfocus</p>
            <p className="text-xs">2017-2019</p>
            <p className="pt-2 text-sm text-gray-600">
              Web developer/consultant for a casino analytics company. Mainly
              used React & Tableau software.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-4xl bg-sky-100 text-sky-800 p-2 rounded">
            <MdSchool />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-semibold">University of Delaware</h4>
            <p className="text-sm">Applied Mathematics</p>
            <p className="text-xs">2017-2019</p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Reviews</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Total Reviews
              </h5>
              <h1 className="text-3xl font-bold">102</h1>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Average Rating
              </h5>
              <h1 className="text-3xl font-bold">4.5</h1>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Total Reviews
              </h5>
              <h1 className="text-3xl font-bold">102</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Availability</h3>
      </div>
    </div>
  );
}

export default function Profile({
  profile,
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [active, setActive] = React.useState<string>("");

  return (
    <ProfileLayout active={active} handleClick={setActive}>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Se 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
      <p>Section 1</p>
    </ProfileLayout>
  );
}

export async function getServerSideProps({
  req,
  res,
  params,
}: GetServerSidePropsContext) {
  if (!params || !params.id || typeof params.id !== "string")
    return { redirect: { destination: "/" } };

  const session = await getServerAuthSession({
    req,
    res,
  });

  const profile = await prisma.profile.findUnique({
    where: { id: params.id },
    include: {
      tutorProfile: {
        include: { education: true, employment: true, location: true },
      },
    },
  });

  if (!profile || !profile.tutorProfile || profile.tutorProfile === null)
    return { notFound: true };
  if (
    profile.tutorProfile.status !== "ACTIVE" &&
    profile.userId !== session?.user.id
  )
    return { notFound: true };

  return {
    props: {
      session,
      profile,
    },
  };
}
