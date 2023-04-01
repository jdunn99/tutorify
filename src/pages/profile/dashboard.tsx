import { Banner } from "@/components/banner";
import { Button } from "@/components/button";
import Calendar from "@/components/calendar";
import { NavLink } from "@/components/links";
import { ProfileNavbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import withAuthHOC, { type WithSession } from "@/utils/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { MdArrowRightAlt } from "react-icons/md";
import { ProfileLayout } from ".";

interface DashboardHeadingProps {
  link?: {
    href: string;
    text: string;
  };
  children: React.ReactNode;
}

const STATIC_RECENT_APPOINTMENTS = [
  {
    name: "Bilbo Baggins",
    title: "Math Tutoring",
    day: "Mar 29",
    time: "10:00 AM - 11:00 AM",
  },
  {
    name: "Bilbo Baggins",
    title: "Math Tutoring",
    day: "Mar 29",
    time: "10:00 AM - 11:00 AM",
  },
  {
    name: "Bilbo Baggins",
    title: "Math Tutoring",
    day: "Mar 29",
    time: "10:00 AM - 11:00 AM",
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

function Heading({ link, children }: DashboardHeadingProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-slate-700 m-0 text-xl font-semibold">{children}</h3>
      {link && (
        <NavLink href={link.href} variant="green">
          {link.text} <MdArrowRightAlt className="inline-block" />
        </NavLink>
      )}
    </div>
  );
}

function UpcomingAppointment() {
  return (
    <div className="space-y-4">
      <Heading
        link={{ href: "/profile/appointments", text: "All appointments" }}
      >
        Upcoming Appointment
      </Heading>
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
  return (
    <div className="space-y-4 flex-1">
      <Heading
        link={{ href: "/profile/appointments", text: "All appointments" }}
      >
        Recent Appointments
      </Heading>
      {STATIC_RECENT_APPOINTMENTS.map(({ title, day, name, time }, index) => (
        <div
          key={index}
          className="bg-white flex flex-wrap items-center justify-between shadow-md rounded-lg border border-slate-200 px-4 py-3 cursor-pointer hover:shadow-lg hover:border hover:border-green-400 duration-200"
        >
          <div className="space-y-1 ">
            <h4 className="text-sm font-bold text-green-600">{title}</h4>
            <p className="text-xl text-slate-800 font-medium">{day}</p>
            <p className="text-xs text-slate-600 font-medium">{time}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Image
              alt="Profile Image"
              className="rounded-lg flex self-start"
              src="https://randomuser.me/api/portraits/men/6.jpg"
              height={32}
              width={32}
            />
            <p className=" text-xs text-slate-600 font-medium">{name}</p>
          </div>
        </div>
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
              className="text-slate-500  block font-medium text-xs"
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

function Temp() {
  const events = [
    {
      date: new Date("2023-04-05"),
      title: "Meeting with John",
    },
    {
      date: new Date("2023-04-12"),
      title: "Doctor's appointment",
    },
    {
      date: new Date("2023-04-24"),
      title: "Family picnic",
    },
  ];
  return (
    <div className="space-y-4">
      <Heading>Calendar</Heading>
      <Calendar month={3} year={2023} events={events} />
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

      <Temp />
    </ProfileLayout>
  );
}

export default withAuthHOC(Dashboard);
