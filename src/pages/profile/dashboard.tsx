import { Banner } from "@/components/banner";
import { Button } from "@/components/button";
import { Calendar } from "@/components/calendar";
import { NavLink } from "@/components/links";
import { Spinner } from "@/components/loading";
import { ProfileNavbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { api } from "@/utils/api";
import withAuthHOC, { type WithSession } from "@/utils/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { MdArrowRightAlt, MdCalendarMonth } from "react-icons/md";
import { RxClock } from "react-icons/rx";
import { Heading, ProfileLayout } from ".";
import { AppointmentItem } from "./appointments";

export const STATIC_RECENT_APPOINTMENTS = [
  {
    name: "Bilbo Baggins",
    title: "Math Tutoring",
    day: "Mar 29",
    date: new Date("2023-03-29T10:00:00.000Z"),
  },
];
const STATIC_RECENT_TUTORS = [
  {
    name: "Bilbo Baggins",
    day: "Mar 29",
    message:
      "I know that coming down was a pain in the butt, but thank you for visiting me I am so happy that you have...",
  },
  {
    name: "Bilbo Baggins",
    day: "Mar 29",
    message:
      "I know that coming down was a pain in the butt, but thank you for visiting me I am so happy that you have...",
  },
  {
    name: "Bilbo Baggins",
    day: "Mar 29",
    message:
      "I know that coming down was a pain in the butt, but thank you for visiting me I am so happy that you have...",
  },
];

function UpcomingAppointment() {
  const { data: upcomingAppointment } =
    api.appointment.getUpcomingAppointment.useQuery();

  return (
    <div className="space-y-4">
      <Heading
        link={{ href: "/profile/appointments", text: "All appointments" }}
      >
        Upcoming Appointment
      </Heading>
      <p>{JSON.stringify(upcomingAppointment)}</p>
      <p className="text-slate-600 text-sm">
        No upcoming appointments. You can find tutors{" "}
        <NavLink href="/search" variant="green">
          here.
        </NavLink>
      </p>
    </div>
  );
}

function RecentAppointments() {
  const { data: recentAppointments } =
    api.appointment.getRecentCompletedAppointments.useQuery({ take: 3 });

  return (
    <div className="space-y-4 flex-1">
      <Heading
        link={{ href: "/profile/appointments", text: "All appointments" }}
      ></Heading>
      {recentAppointments &&
        recentAppointments.map((item) => (
          <AppointmentItem {...(item as any)} key={item.id} />
        ))}
    </div>
  );
}

function RecentTutors() {
  return (
    <div className="space-y-4 flex-1">
      <Heading link={{ href: "/profile/messages", text: "All tutors" }}>
        Recent Tutors
      </Heading>
      {STATIC_RECENT_TUTORS.map(({ name, message, day }, index) => (
        <div
          key={index}
          className="bg-white flex items-center gap-4 p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg border-slate-200 border hover:border hover:border-green-400 duration-200"
        >
          <Image
            alt="Profile Image"
            className="rounded-lg flex self-start"
            src="https://randomuser.me/api/portraits/men/6.jpg"
            height={64}
            width={64}
          />
          <div>
            <div className="flex items-center flex-wrap justify-between">
              <h4 className="text-slate-800 font-semibold text-lg">{name}</h4>
              <p className="text-green-600 font-medium text-xs">{day}</p>
            </div>
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
              {message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Cal() {

  return (
    <div className="space-y-4">
      <Heading>Calendar</Heading>
      <Calendar dropdown controls/>
    </div>
  );
}

function Dashboard({ session }: WithSession) {
  return (
    <ProfileLayout session={session}>
      <div className="space-y-8">
        <Banner
          heading="Action Needed!"
          variant="warning"
          text="No payment method found for your account. Please add one now."
          button="Add payment option"
          href="/auth/payment"
          closable
        />
        <UpcomingAppointment />
        <div className="flex gap-8 md:flex-row flex-col">
          <RecentAppointments />
          <RecentTutors />
        </div>
      </div>

      <Cal />
    </ProfileLayout>
  );
}

export default withAuthHOC(Dashboard);
