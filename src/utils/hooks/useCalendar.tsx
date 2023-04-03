import React from "react";

export const relevantYears = [2023, 2024];
export function useCalendar() {
  const today = new Date();
  const [month, setMonth] = React.useState<number>(3);
  const [year, setYear] = React.useState<number>(today.getFullYear());

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

  return { today, month, onMonthChange, year, onYearChange, slots };
}
