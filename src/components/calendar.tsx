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

interface CalendarDropdownItemProps {
  date: string;
}
function CalendarDropdownItems({ date }: CalendarDropdownItemProps) {
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

interface CalendarHeaderProps {
  month: number;
  onMonthChange(newMonth: number): void;
  year: number;
  onYearChange(newYear: number): void;
  controls: Boolean;
}
function CalendarHeader({
  month,
  onMonthChange,
  year,
  onYearChange,
  controls,
}: CalendarHeaderProps) {
  function handleMonthChange(newMonth: number) {
    if (newMonth < 0) onMonthChange(11);
    else onMonthChange(newMonth);
  }

  return controls ? (
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
        variant="ghost"
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
        variant="ghost"
        size="xl"
        onClick={() => handleMonthChange(month % 12)}
      >
        <MdChevronRight />
      </Button>
    </div>
  );
}

interface CalendarDayProps {
  day: string;
  controls: boolean;
}
function CalendarDay({ day, controls }: CalendarDayProps) {
  return (
    <div
      className={`text-xs py-4 text-center bg-green-200 ${
        controls
          ? "border-l border-r"
          : "first:rounded-tl-lg  last:rounded-tl-lg"
      } font-semibold text-slate-800`}
    >
      {controls ? day : day.charAt(0)}
    </div>
  );
}

interface CalendarDropdownProps {
  heading: string;
  label: string;
  count: number;
  formattedDate: string;
}
function CalendarDropdown({
  heading,
  label,
  count,
  formattedDate,
}: CalendarDropdownProps) {
  return (
    <Dropdown
      heading={heading}
      className="w-6 h-6 text-xs font-bold !text-white !border-none !rounded-full flex justify-center items-center"
      variant="base"
      size="xs"
    >
      <DropdownContent sideOffset={4} align="center" className="!p-0">
        <div className="flex pl-2 pr-8 items-center justify-between border-b bg-green-200 rounded-t-lg">
          <DropdownLabel>{label}</DropdownLabel>
          <span className="text-green-500 text-xs font-bold">{count}</span>
        </div>

        <div className="max-h-[30vh] overflow-y-auto px-2 space-y-4 rounded-b-lg">
          <CalendarDropdownItems date={formattedDate} />
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

interface CalendarSlotWithEventsProps {
  slot: Date;
  onEventClick?(date: string): void;
  events: Record<string, number>;
  controls: boolean;
  dropdown: boolean;
}
function CalendarSlotWithEvents({
  slot,
  onEventClick,
  events,
  controls,
  dropdown,
}: CalendarSlotWithEventsProps) {
  const date = React.useMemo(() => slot.getDate(), [slot]);
  const formattedDate = React.useMemo(
    () => slot.toISOString().substring(0, 10),
    [slot]
  );
  const label = React.useMemo(
    () =>
      slot.toLocaleDateString("default", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
    [slot]
  );

  return (
    <React.Fragment>
      {dropdown ? (
        <CalendarDropdown
          formattedDate={formattedDate}
          heading={date.toString()}
          count={events[formattedDate]}
          label={label}
        />
      ) : (
        <Button
          className="w-6 h-6 text-xs font-bold !text-white !border-none !rounded-full flex justify-center items-center"
          size="xs"
          onClick={() => onEventClick && onEventClick(formattedDate)}
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
  );
}

interface CalendarSlotNoEventsProps {
  slot: Date;
  onDateClick?(date: Date): void;
  activeDate?: Date;
}
function CalendarSlotNoEvents({
  slot,
  onDateClick,
  activeDate = new Date(),
}: CalendarSlotNoEventsProps) {
  const sameDay = React.useCallback(
    (comp: Date) => {
      return (
        comp.getFullYear() === slot.getFullYear() &&
        comp.getMonth() === slot.getMonth() &&
        comp.getDate() === slot.getDate()
      );
    },
    [slot]
  );
  const date = React.useMemo(() => slot.getDate(), [slot]);

  const variant = sameDay(activeDate)
    ? "base"
    : sameDay(new Date())
    ? "secondary"
    : "ghostColored";

  return (
    <Button
      variant={variant}
      className={`w-6 h-6 text-xs font-bold !border-none !rounded-full flex justify-center items-center`}
      size="xs"
      onClick={() => onDateClick && onDateClick(slot)}
    >
      {date}
    </Button>
  );
}

interface CalendarSlotProps {
  slot: Date;
  isFirst: boolean;
  isLast: boolean;
  events?: Record<string, number>;
  dropdown: boolean;
  controls: boolean;
  onEventClick?(date: string): void;
  onDateClick?(date: Date): void;
  activeDate?: Date;
  month: number;
}
function CalendarSlot({
  month,
  slot,
  isFirst,
  isLast,
  events,
  dropdown,
  controls,
  onEventClick,
  onDateClick,
  activeDate,
}: CalendarSlotProps) {
  const isCurrentMonth = slot.getMonth() === month - 1;
  const date = React.useMemo(() => slot.getDate(), [slot]);
  const formattedDate = React.useMemo(
    () => slot.toISOString().substring(0, 10),
    [slot]
  );

  let cx = CALENDAR_ITEM_STYLE;
  cx += controls
    ? " aspect-[1.55] p-2 justify-between "
    : " aspect-[1.25] items-center justify-center ";
  if (isFirst) cx += " rounded-bl-lg ";
  if (isLast) cx += " rounded-br-lg ";

  if (!isCurrentMonth)
    return <div className={`${cx} bg-slate-100 text-slate-400`}>{date}</div>;

  cx += " bg-white";

  return (
    <div className={cx}>
      {typeof events !== "undefined" ? (
        events[formattedDate] ? (
          <CalendarSlotWithEvents
            slot={slot}
            onEventClick={onEventClick}
            events={events}
            controls={controls}
            dropdown={dropdown}
          />
        ) : (
          date
        )
      ) : (
        <CalendarSlotNoEvents
          activeDate={activeDate}
          slot={slot}
          onDateClick={onDateClick}
        />
      )}
    </div>
  );
}

const CALENDAR_ITEM_STYLE =
  "text-xs flex border border-slate-200 flex-1 font-semibold";

interface CalendarProps {
  controls?: boolean;
  dropdown?: boolean;
  onEventClick?(date: string): void;
  onDateClick?(date: Date): void;
  hasEvents?: boolean;
  activeDate?: Date;
}
export function Calendar({
  controls = false,
  hasEvents = true,
  dropdown,
  onEventClick,
  onDateClick,
  activeDate,
}: CalendarProps) {
  const { month, onMonthChange, slots, year, onYearChange } = useCalendar();
  const { data: countForMonth } = api.appointment.getCountForMonth.useQuery(
    undefined,
    { enabled: hasEvents }
  );

  const events = React.useMemo(
    () => countForMonth?.appointments,
    [countForMonth]
  );

  return (
    <div
      className={`flex-1 ${
        controls
          ? "rounded-lg overflow-hidden w-full shadow-lg"
          : "flex flex-col"
      }`}
    >
      <CalendarHeader
        month={month}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        controls={controls}
        year={year}
      />
      <div
        className={`grid grid-cols-7 flex-1 overflow-hidden h-full ${
          !controls && "shadow-xl rounded-lg border"
        }`}
      >
        {days.map((day) => (
          <CalendarDay day={day} key={day} controls={controls} />
        ))}
        {slots.map((slot, index) => (
          <CalendarSlot
            slot={slot}
            key={index}
            month={month}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
            activeDate={activeDate}
            controls={controls}
            isFirst={index === slots.length - 7}
            isLast={index === slots.length - 1}
            events={events}
            dropdown={dropdown || false}
          />
        ))}
      </div>
    </div>
  );
}
