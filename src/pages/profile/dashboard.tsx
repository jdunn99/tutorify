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
import { ConversationContent } from "./messages";

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

function Metrics() {
  const { data, isLoading } = api.user.getMetricsForRegularUser.useQuery();

  return (
    <div className="space-y-4">
      <Heading>Metrics</Heading>
      {typeof data !== "undefined" ? (
        <div className="grid grid-col-1 sm:grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4 rounded-lg bg-white border space-y-2">
            <h1 className="text-sm font-medium text-slate-800">
              Upcoming Appointment
            </h1>

            <div className="flex justify-between items-center">
              <AppointmentItem {...(data.upcomingAppointment as any)} />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white border space-y-2">
            <h1 className="text-sm font-medium text-slate-800">
              Appointments Booked
            </h1>
            <h1 className="text-3xl font-bold text-green-600">
              {data.metrics.booked}
            </h1>
          </div>

          <div className="p-4 rounded-lg bg-white border space-y-2">
            <h1 className="text-sm font-medium text-slate-800">
              Appointments Attended
            </h1>
            <h1 className="text-3xl font-bold text-green-600">
              {data.metrics.completed}
            </h1>
          </div>
        </div>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <p className="text-slate-600 text-sm">
          No upcoming appointments. You can find tutors{" "}
          <NavLink href="/search" variant="green">
            here.
          </NavLink>
        </p>
      )}
    </div>
  );
}

function RecentItems() {
  const { data: recentAppointments } =
    api.appointment.getRecentCompletedAppointments.useQuery({ take: 3 });
  const { data: recentMessages } = api.messages.getConversations.useQuery({
    take: 3,
  });

  /*
   * If the data returned is less than length 3 then we return some empty cells to maintain consistent grid 3x2 shape.
   */
  const fillCells = React.useCallback(
    (item: any[], max: number, container: "appointments" | "messages") => {
      const cells: JSX.Element[] = [];
      if (item.length === 0)
        return [
          <p key={container}>No items found</p>,
          ...Array.from({ length: max - 1 }, (_, i) => (
            <div key={i + container} />
          )),
        ];

      for (let i = 0; i < max; ++i) {
        if (item[i])
          cells.push(
            container === "appointments" ? (
              <div
                key={item[i].id}
                className="bg-white flex flex-wrap items-center justify-between shadow-md rounded-lg border border-slate-200 px-6 py-1 hover:shadow-lg duration-200"
              >
                <AppointmentItem {...item[i]} image />
              </div>
            ) : (
              <div
                key={i}
                className="bg-white flex items-center gap-4 p-[1.1rem] shadow-md rounded-lg cursor-pointer hover:shadow-lg border-slate-200 border hover:border hover:border-green-400 duration-200"
              >
                <ConversationContent conversation={item[i]} />{" "}
              </div>
            )
          );
        else cells.push(<div key={i + container + 10} />);
      }

      return cells;
    },
    []
  );

  return recentAppointments && recentMessages ? (
    <div className="space-y-4">
      <div className="hidden md:flex items-center gap-8">
        <Heading link={{ href: "/profile/appointments", text: "All tutors" }}>
          Recent Appointments
        </Heading>
        <Heading link={{ href: "/profile/messages", text: "All tutors" }}>
          Recent Tutors
        </Heading>
      </div>
      <div className="grid grid-cols-1 grid-rows-8 md:grid-cols-2 md:grid-rows-3 gap-y-4 gap-x-8 grid-flow-col">
        <div className="flex self-center md:hidden">
          <Heading
            link={{ href: "/profile/appointments", text: "All appointments" }}
          >
            Recent Appointments
          </Heading>
        </div>

        {fillCells(recentAppointments, 3, "appointments").map(
          (item: any) => item
        )}
        <div className=" flex self-center md:hidden">
          <Heading link={{ href: "/profile/messages", text: "All tutors" }}>
            Recent Tutors
          </Heading>
        </div>
        {fillCells(recentMessages, 3, "messages").map((item: any) => item)}
      </div>
    </div>
  ) : null;
}

function Cal() {
  return (
    <div className="space-y-4">
      <Heading>Calendar</Heading>
      <Calendar dropdown controls />
    </div>
  );
}

function Dashboard({ session }: WithSession) {
  return (
    <ProfileLayout session={session}>
      <div className="space-y-8">
        {/*<Banner
          heading="Action Needed!"
          variant="warning"
          text="No payment method found for your account. Please add one now."
          button="Add payment option"
          href="/auth/payment"
          closable
        />*/}
        <Metrics />
        <RecentItems />
      </div>

      <Cal />
    </ProfileLayout>
  );
}

export default withAuthHOC(Dashboard);
