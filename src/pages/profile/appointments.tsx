import Calendar from "@/components/calendar";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
} from "@/components/dropdown";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { useDate, useDateRange } from "@/utils/hooks/useDate";
import { Appointment } from "@prisma/client";
import Image from "next/image";
import React from "react";
import {
  MdCalendarMonth,
  MdOutlineEdit,
  MdOutlinePeople,
  MdOutlineReviews,
} from "react-icons/md";
import { RxClock, RxDotsHorizontal } from "react-icons/rx";
import { Heading, ProfileLayout } from ".";
import { STATIC_RECENT_APPOINTMENTS } from "./dashboard";

interface AppointmentDropdownProps {
  appointment: AppointmentItemProps;
  day: string;
  startTime: string;
  endTime: string;
}

function AppointmentDropdown({
  appointment,
  day,
  startTime,
  endTime,
}: AppointmentDropdownProps) {
  const { title, status, id } = appointment;

  return (
    <Dropdown
      heading={<RxDotsHorizontal className="text-xl" />}
      className="block"
      variant="ghostColored"
    >
      <DropdownContent>
        <DropdownLabel>{title}</DropdownLabel>
        <div className="px-2 space-y-1 text-sm text-slate-600 pb-4 border-b border-slate-100">
          <p className="flex items-center gap-1 ">
            <MdCalendarMonth className="text-lg text-green-600" />
            {day}
          </p>
          <p className="flex items-center gap-1 ">
            <RxClock className="text-lg text-green-600" />
            {startTime} - {endTime}
          </p>
        </div>
        <AppointmentActions past={status === "COMPLETED"} id={id} />
      </DropdownContent>
    </Dropdown>
  );
}

interface AppointmentActionsProps {
  past: boolean;
  id: string;
}
function AppointmentActions({ past, id }: AppointmentActionsProps) {
  return (
    <React.Fragment>
      <DropdownLabel>Actions</DropdownLabel>
      {past && (
        <DropdownItem icon={<MdOutlineReviews />}>Add Review</DropdownItem>
      )}
      <DropdownItem icon={<MdOutlineEdit />}>Edit Appointment</DropdownItem>
      <DropdownItem icon={<MdOutlinePeople />}>View Tutor Profile</DropdownItem>
    </React.Fragment>
  );
}

type AppointmentItemProps = Appointment & {
  tutor: {
    user: {
      name: string;
      image: string;
    };
  };
};

export function AppointmentItem(appointment: AppointmentItemProps) {
  const { start, end, title, description, id, tutor } = appointment;
  const { day, startTime, endTime } = useDateRange(start, end);
  const {
    user: { name },
  } = tutor;

  return (
    <div className="bg-white flex flex-wrap items-center justify-between shadow-md rounded-lg border border-slate-200 px-6 py-0.5 hover:shadow-lg duration-200">
      <div className="flex items-center gap-6">
        <Image
          alt="Profile Image"
          className="rounded-lg flex"
          src="https://randomuser.me/api/portraits/men/6.jpg"
          height={64}
          width={64}
        />

        <div className="space-y-1 py-2">
          <h4 className="text-sm font-medium text-green-600">{name}</h4>
          <p className="text-xl text-slate-800 font-bold">{title}</p>
          <p className="text-xs text-slate-400">{description}</p>
          <div className="flex gap-2 text-slate-600 font-medium">
            <MdCalendarMonth className="text-green-500" />
            <p className="text-xs border-r border-slate-300 pr-2">{day}</p>
            <RxClock className="text-green-500" />
            <p className="text-xs ">
              {startTime} - {endTime}
            </p>
          </div>
        </div>
      </div>
      <AppointmentDropdown
        appointment={appointment}
        endTime={endTime}
        startTime={startTime}
        day={day}
      />
    </div>
  );
}

function Appointments({ session }: WithSession) {
  const { data: appointments } =
    api.appointment.getRecentCompletedAppointments.useQuery();
  const { data: countForMonth } = api.appointment.getCountForMonth.useQuery();
  

  return (
    <ProfileLayout session={session}>
      <Heading>Appointments</Heading>
      <div className="flex items-start gap-4">
        <div className=" space-y-2">
          {appointments?.map((item) => (
            <AppointmentItem {...(item as AppointmentItemProps)} key={item.id} />
          ))}
        </div>
        <Calendar
          month={3}
          year={2023}
          events={
            typeof countForMonth !== "undefined"
              ? (countForMonth.appointments as Record<string, number>)
              : {}
          }
        />
      </div>
    </ProfileLayout>
  );
}

export default withAuthHOC(Appointments);
