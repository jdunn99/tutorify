import { Avatar } from "@/components/avatar";
import { Calendar } from "@/components/calendar";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
} from "@/components/dropdown";
import { Spinner } from "@/components/loading";
import { api } from "@/utils/api";
import withAuthHOC, { WithSession } from "@/utils/auth";
import { useDateRange } from "@/utils/hooks/useDate";
import { getInitials } from "@/utils/initials";
import { Appointment, AppointmentStatus } from "@prisma/client";
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

export function AppointmentDropdownHeader({
  appointment,
}: AppointmentDropdownProps) {
  const { title, start, end } = appointment;
  const { day, startTime, endTime } = useDateRange(start, end);

  return (
    <React.Fragment>
      <p className="font-semibold text-slate-800 px-2">{title}</p>
      <div className="px-2 space-y-1 text-sm text-slate-600">
        <p className="flex items-center gap-1 ">
          <MdCalendarMonth className="text-lg text-green-600" />
          {day}
        </p>
        <p className="flex items-center gap-1 ">
          <RxClock className="text-lg text-green-600" />
          {startTime} - {endTime}
        </p>
      </div>
    </React.Fragment>
  );
}

interface AppointmentDropdownProps {
  appointment: Appointment;
}

function AppointmentDropdown({ appointment }: AppointmentDropdownProps) {
  const { status, id } = appointment;

  return (
    <Dropdown
      heading={<RxDotsHorizontal className="text-xl" />}
      className="block"
      variant="ghostColored"
    >
      <DropdownContent>
        <AppointmentDropdownHeader appointment={appointment} />
        <AppointmentActions status={status} id={id} />
      </DropdownContent>
    </Dropdown>
  );
}

interface AppointmentActionsProps {
  status: AppointmentStatus;
  id: string;
}
export function AppointmentActions({ id, status }: AppointmentActionsProps) {
  return (
    <React.Fragment>
      <DropdownLabel>Actions</DropdownLabel>
      {status === "COMPLETED" && (
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
  image?: boolean;
};

export function AppointmentItem(appointment: AppointmentItemProps) {
  const { start, end, title, description, id, tutor, image } = appointment;
  const { day, startTime, endTime } = useDateRange(start, end);
  const {
    user: { name },
  } = tutor;

  return (
    <React.Fragment>
      <div className="flex items-center gap-6">
        {image ? (
          <Avatar src={tutor.user.image} size="lg">
            {getInitials(tutor.user.name)}
          </Avatar>
        ) : null}

        <div>
          {image ? (
            <h4 className="text-sm font-medium text-green-600">{name}</h4>
          ) : null}
          <p
            className="text-xl text-slate-800 font-bold"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </p>
          {image ? (
            <p
              className="text-xs text-slate-400"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </p>
          ) : null}
          <div className="flex gap-2 text-slate-600 font-medium pt-1">
            <MdCalendarMonth className="text-green-500" />
            <p className="text-xs border-r border-slate-300 pr-2">{day}</p>
            <RxClock className="text-green-500" />
            <p className="text-xs ">
              {startTime} - {endTime}
            </p>
          </div>
        </div>
      </div>
      <AppointmentDropdown appointment={appointment} />
    </React.Fragment>
  );
}

function Appointments({ session }: WithSession) {
  const [date, setDate] = React.useState<string>("");
  const { data: appointments, isLoading } =
    api.appointment.getAppointmentsForDay.useQuery(
      { date },
      { enabled: date.length > 0 }
    );

  return (
    <ProfileLayout session={session}>
      <Heading>
        {date.length > 0 ? `Appointments - ${date}` : "Appointments"}
      </Heading>
      <div className="flex items-start justify-center gap-8 flex-col-reverse sm:flex-row">
        {appointments ? (
          <div className="space-y-2 max-h-[calc(100vh-250px)] flex-1 overflow-y-auto">
            {appointments.map((item) => (
              <div
                key={item.id}
                className="bg-white flex items-center justify-between shadow-md rounded-lg border border-slate-200 px-6 py-1 hover:shadow-lg duration-200"
              >
                <AppointmentItem {...(item as AppointmentItemProps)} image />
              </div>
            ))}
          </div>
        ) : isLoading && date.length > 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner />{" "}
          </div>
        ) : null}
        <div className="p-4 flex-1">
          <Calendar
            controls={typeof appointments === "undefined" && date.length === 0}
            onEventClick={setDate}
          />
        </div>
      </div>
    </ProfileLayout>
  );
}

export default withAuthHOC(Appointments);
