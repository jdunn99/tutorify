import React from "react";

export function useDate(date: Date) {
  const { day, time, past } = React.useMemo(() => {
    const day = date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });

    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const past = date.getTime() < new Date().getTime();

    return { day, time, past };
  }, [date]);

  return { day, time, past };
}

export function useDateRange(start: Date, end: Date) {
  const { day, startTime, endTime } = React.useMemo(() => {
    const day = start.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
    });

    const startTime = start.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const endTime = end.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return { day, startTime, endTime }
  }, [start, end]);

  return { day, startTime, endTime }
}
