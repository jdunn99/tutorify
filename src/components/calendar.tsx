import {
  AppointmentActions,
  AppointmentDropdownHeader,
} from "@/pages/profile/appointments";
import { api } from "@/utils/api";
import { useCalendar } from "@/utils/hooks/useCalendar";
import { useDateRange } from "@/utils/hooks/useDate";
import { Appointment } from "@prisma/client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { RxClock } from "react-icons/rx";
import { Button } from "./button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DROPDOWN_CONTENT_VARIANTS,
} from "./dropdown";
import { Spinner } from "./loading";

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

interface CalendarDropdownProps {
  date: string;
}
function CalendarDropdownItems({ date }: CalendarDropdownProps) {
  const { data: appointments } = api.appointment.getAppointmentsForDay.useQuery(
    {
      date,
    }
  );

  return appointments ? (
    <React.Fragment>
      {appointments.map((appointment) => (
        <DropdownMenu.Sub key={appointment.id}>
          <DropdownMenu.SubTrigger className="DropdownMenuTrigger flex items-center outline-none cursor-pointer hover:bg-green-50">
            <div>
              <AppointmentDropdownHeader appointment={appointment} />
            </div>
            <MdChevronRight />
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent
              sideOffset={2}
              className={DROPDOWN_CONTENT_VARIANTS.base}
            >
              <AppointmentActions
                id={appointment.id}
                status={appointment.status}
              />
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      ))}
    </React.Fragment>
  ) : (
    <div className="flex items-center justify-center p-4">
      <Spinner />
    </div>
  );
}

interface ControlDropdownProps {
  heading: string | number;
  data: (string | number)[];
  onClick(target: string | number): void;
  variant?: "ghost" | "white";
}

function ControlDropdown({
  heading,
  data,
  onClick,
  variant = "white",
}: ControlDropdownProps) {
  return (
    <Dropdown
      heading={
        <span>
          {heading} <MdKeyboardArrowDown className="inline-block" />
        </span>
      }
      size="sm"
      variant={variant}
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

const CALENDAR_ITEM_STYLE = "text-xs flex border border-slate-200 flex-1";

interface SmallCalendarProps {
  onClick?: React.Dispatch<React.SetStateAction<string>>;
  controls?: boolean;
  dropdown?: boolean;
}
export function Calendar({ onClick, controls, dropdown }: SmallCalendarProps) {
  const { month, onMonthChange, slots, year, onYearChange } = useCalendar();
  const { data: countForMonth } = api.appointment.getCountForMonth.useQuery();

  const events = React.useMemo(
    () => countForMonth?.appointments || {},
    [countForMonth]
  );

  function handleMonthChange(newMonth: number) {
    if (newMonth < 0) onMonthChange(11);
    else onMonthChange(newMonth);
  }

  return (
    <div
      className={`flex-1 ${
        controls
          ? "rounded-lg overflow-hidden w-full shadow-lg"
          : "flex flex-col"
      }`}
    >
      {controls ? (
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
      ) : (
        <div className="flex items-center px-8 py-4 justify-center">
          <Button
            onClick={() => handleMonthChange(month - 2)}
            variant="ghostColored"
            size="xl"
          >
            <MdChevronLeft />
          </Button>
          <div className="flex items-center gap-4">
            <ControlDropdown
              heading={months[month - 1]}
              onClick={onMonthChange}
              data={months}
              variant="ghost"
            />
          </div>
          <Button
            variant="ghostColored"
            size="xl"
            onClick={() => handleMonthChange(month % 12)}
          >
            <MdChevronRight />
          </Button>
        </div>
      )}
      <div className="grid grid-cols-7 flex-1 overflow-hidden h-full">
        {days.map((day) => (
          <div
            key={day}
            className={`text-xs py-4 text-center ${
              controls
                ? "border-l borer-r first:border-l-0 last:border-r-0"
                : ""
            } font-semibold text-slate-800`}
          >
            {controls ? day : day.charAt(0)}
          </div>
        ))}
        {slots.map((slot, index) => {
          const isCurrentMonth = slot.getMonth() === month - 1;
          const date = slot.getDate();

          let cx = CALENDAR_ITEM_STYLE;
          cx += controls
            ? " aspect-[1.55] p-2 justify-between "
            : " aspect-[1.25] items-center justify-center ";
          if (index === 0 && !controls) cx += " rounded-tl-lg ";
          if (index === 6 && !controls) cx += " rounded-tr-lg ";
          if (index === slots.length - 7) cx += " rounded-bl-lg ";
          if (index === slots.length - 1) cx += " rounded-br-lg ";

          if (!isCurrentMonth)
            return (
              <div
                key={slot.toDateString()}
                className={`${cx} bg-slate-100 text-slate-400`}
              >
                {date}
              </div>
            );

          cx += " bg-white";
          const formattedDate = slot.toISOString().substring(0, 10);

          return (
            <div key={slot.toDateString()} className={cx}>
              {events[formattedDate] ? (
                <React.Fragment>
                  {dropdown ? (
                    <Dropdown
                      heading={slot.getDate()}
                      className="w-6 h-6 text-xs font-bold !text-white !border-none !rounded-full flex justify-center items-center"
                      variant="base"
                      size="xs"
                    >
                      <DropdownContent
                        sideOffset={4}
                        align="center"
                        className="!p-0"
                      >
                        <div className="flex pl-2 pr-8 items-center justify-between border-b bg-green-200 rounded-t-lg">
                          <DropdownLabel>
                            {slot.toLocaleDateString("default", {
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                            })}
                          </DropdownLabel>
                          <span className="text-green-500 text-xs font-bold">
                            {events[formattedDate]}
                          </span>
                        </div>

                        <div className="max-h-[30vh] overflow-y-auto px-2 space-y-4 rounded-b-lg">
                          <CalendarDropdownItems date={formattedDate} />
                        </div>
                      </DropdownContent>
                    </Dropdown>
                  ) : (
                    <Button
                      className="w-6 h-6 text-xs font-bold !text-white !border-none !rounded-full flex justify-center items-center"
                      size="xs"
                      onClick={() => onClick && onClick(formattedDate)}
                    >
                      {date}
                    </Button>
                  )}

                  {controls && (
                    <p className="text-sm text-slate-600 font-medium">
                      {events[formattedDate]} events
                    </p>
                  )}
                </React.Fragment>
              ) : (
                date
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
