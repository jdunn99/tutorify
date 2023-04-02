import { AppointmentItem } from "@/pages/profile/appointments";
import { STATIC_RECENT_APPOINTMENTS } from "@/pages/profile/dashboard";
import { api } from "@/utils/api";
import { useDateRange } from "@/utils/hooks/useDate";
import { Appointment } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import React, { useState } from "react";
import {
  MdCalendarMonth,
  MdChevronRight,
  MdEdit,
  MdKeyboardArrowDown,
  MdOutlineEdit,
  MdOutlinePeople,
  MdPeopleOutline,
} from "react-icons/md";
import { RxClock, RxDotsHorizontal } from "react-icons/rx";
import { Badge } from "./badge";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
} from "./dropdown";

interface CalendarProps {
  month: number;
  year: number;
  events: Record<string, number>;
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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

const relevantYears = [2023, 2024];

const views = ["Year", "Month"];
type View = (typeof views)[number];

interface ControlDropdownProps {
  heading: string | number;
  data: (string | number)[];
  onClick(target: string | number): void;
}

function ControlDropdown({ heading, data, onClick }: ControlDropdownProps) {
  return (
    <Dropdown
      heading={
        <span>
          {heading} <MdKeyboardArrowDown className="inline-block" />
        </span>
      }
      size="sm"
      variant="white"
      className="font-semibold"
    >
      <DropdownContent align="start" sideOffset={5}>
        {data.map((item, index) => (
          <DropdownItem
            key={item}
            onClick={() => onClick(index)}
            className={
              heading === data[index]
                ? "font-bold !text-green-600 bg-green-100"
                : ""
            }
          >
            {item}
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

interface DateWithEventsProps {
  date: Date;
  count: number;
}

interface Props {
  appointment: Appointment;
}
function Temp({ appointment }: Props) {
  const { startTime, endTime } = useDateRange(
    appointment.start,
    appointment.end
  );

  return (
    <DropdownItem className="flex items-center !cursor-default">
      <div>
        <div className="space-y-1 text-sm text-slate-600">
          <p className="text-green-600 font-semibold">{appointment.title}</p>
          <p className="flex items-center gap-1 ">
            <RxClock className="text-lg text-green-600" />
            {startTime} - {endTime}
          </p>
        </div>
      </div>
      <MdChevronRight className="text-lg text-slate-600" />
    </DropdownItem>
  );
}
function DateWithEvents({ date, count }: DateWithEventsProps) {
  const { data: appointments } = api.appointment.getAppointmentsForDay.useQuery(
    { date: date.toISOString().substring(0, 10) }
  );

  return (
    <React.Fragment>
      <Dropdown
        heading={date.getDate()}
        className="w-6 h-6 text-xs font-bold !text-white !border-none !rounded-full flex justify-center items-center"
        variant="base"
        size="xs"
      >
        <DropdownContent sideOffset={4} align="center" className="!p-0">
          <div className="flex pl-2 pr-8 items-center justify-between border-b bg-green-200 rounded-t-lg">
            <DropdownLabel >
              {date.toLocaleDateString("default", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </DropdownLabel>
            <span className="text-green-500 text-xs font-bold">{count}</span>
          </div>

          <div className="max-h-[30vh] overflow-y-auto px-2 rounded-b-lg">
            {appointments &&
              appointments.map((appointment) => (
                <Temp key={appointment.id} appointment={appointment} />
              ))}
          </div>
        </DropdownContent>
      </Dropdown>
      <p className="text-sm text-slate-600 font-medium">{count} events</p>
    </React.Fragment>
  );
}

interface FullCalendarProps {
  dates: Date[];
  onMonthChange(newMonth: number): void;
  onYearChange(newYear: number): void;
  month: number;
  year: number;
}

function FullCalendar({
  dates,
  month,
  year,
  onMonthChange,
  onYearChange,
}: FullCalendarProps) {
  <div className="rounded-lg overflow-hidden w-full shadow-lg flex-1">
    <div className="flex items-center px-8 py-4 bg-green-200  justify-between">
      <h2 className="text-green-800 font-bold">
        {months[month - 1]} {year}
      </h2>
      <div className="flex items-center gap-4">
        <ControlDropdown
          heading={months[month - 1]}
          onClick={onMonthChange}
          data={months}
        />
        <ControlDropdown
          heading={year}
          onClick={onYearChange}
          data={relevantYears}
        />
      </div>
    </div>
    <div className="grid grid-cols-7 ">
      {days.map((day) => (
        <div
          key={day}
          className="text-xs text-center font-semibold first:border-r first:border-l-0 border text-slate-800 bg-white px-4 py-2"
        >
          {day}
        </div>
      ))}
      {dates.map((slot) => {
        const condition = slot.getMonth() === month - 1;

        return (
          <div
            key={slot.toDateString()}
            className={`border aspect-[1.55]  text-xs text-slate-600 border-slate-200 ${
              condition ? "bg-white" : "bg-slate-100 text-slate-400"
            }`}
          >
            <div className="pt-4 px-4 flex items-center justify-between">
              {!condition ? (
                <p
                  className={`text-sm ${
                    condition ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {slot.getDate()}
                </p>
              ) : (
                <DateWithEvents date={slot} count={0} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>;
}

function Calendar({ month: _month, year: _year, events }: CalendarProps) {
  const [month, setMonth] = React.useState<number>(_month);
  const [year, setYear] = React.useState<number>(_year);

  function onMonthChange(newMonth: number) {
    setMonth(newMonth + 1);
  }

  function onYearChange(newYear: number) {
    setYear(relevantYears[newYear]);
  }

  const slots = React.useMemo(() => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const numDays = endDate.getDate();
    const firstWeekday = startDate.getDay();
    const lastWeekday = endDate.getDay();
    const dates: Date[] = [];

    // Add dates from previous month
    const prevMonthEndDate = new Date(year, month - 1, 0).getDate();
    let prevMonthStartDate = prevMonthEndDate - firstWeekday + 2;
    if (firstWeekday === 0) {
      prevMonthStartDate -= 7;
    }
    for (let i = prevMonthStartDate; i <= prevMonthEndDate; i++) {
      dates.push(new Date(year, month - 2, i));
    }

    // Add dates from current month
    for (let i = 1; i <= numDays; i++) {
      dates.push(new Date(year, month - 1, i));
    }

    // Add dates from next month
    const nextMonthStartDate = 1;
    const nextMonthEndDate = 7 - lastWeekday;
    for (let i = nextMonthStartDate; i <= nextMonthEndDate; i++) {
      dates.push(new Date(year, month, i));
    }

    return dates;
  }, [month, year]);

  return (
    <div className="flex items-start gap-8 flex-1">
      <div className="rounded-lg overflow-hidden w-full shadow-lg flex-1">
        <div className="grid grid-cols-7 ">
          {days.map((day) => (
            <div
              key={day}
              className="text-xs text-center font-semibold first:border-r first:border-l-0 border text-slate-800 bg-white px-4 py-2"
            >
              {day}
            </div>
          ))}
          {slots.map((slot) => {
            const condition = slot.getMonth() === month - 1;
            const count = events[slot.toISOString().substring(0, 10)];

            return (
              <div
                key={slot.toDateString()}
                className={`border aspect-[1.55]  text-xs text-slate-600 border-slate-200 ${
                  condition ? "bg-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                <div className="pt-4 px-4 flex items-center justify-between">
                  {typeof count === "undefined" ? (
                    <p
                      className={`text-sm ${
                        condition ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {slot.getDate()}
                    </p>
                  ) : (
                    <DateWithEvents date={slot} count={count} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
