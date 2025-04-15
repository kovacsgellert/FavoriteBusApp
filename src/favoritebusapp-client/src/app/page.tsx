"use client";

import { useEffect, useState } from "react";
import type { CtpWeeklyTimetable } from "./timetable.model";
import Timetable from "./timetable";
import dynamic from "next/dynamic";

// leaflet requires dynamic import to avoid SSR issues
const DynamicMap = dynamic(() => import("./map"), { ssr: false });

export default function HomePage() {
  const [weeklyTimetable, setWeeklyTimetable] =
    useState<CtpWeeklyTimetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeeklyTimetable = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:5001/api/timetables");
      if (!response.ok) {
        throw new Error(
          "Failed to fetch weekly timetable. Status: " + response.status,
        );
      }
      const data = await response.json();
      setWeeklyTimetable(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  };

  const getTodaysType = () => {
    const today = new Date().getDay();
    switch (today) {
      case 0:
        return "sunday";
      case 6:
        return "saturday";
      default:
        return "weekdays";
    }
  };

  useEffect(() => {
    fetchWeeklyTimetable();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weeklyTimetable || weeklyTimetable.dailyTimetables.length === 0) {
    return <div>No data available</div>;
  }

  const todaysType = getTodaysType();
  const todaysTimetable = weeklyTimetable.dailyTimetables.find(
    (timetable) => timetable.dayType === todaysType,
  )!;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[#1a6347] to-[#15162c] text-white">
      <h1 className="py-3 text-center text-xl font-bold md:text-3xl">
        {todaysType.toUpperCase()} - {todaysTimetable.routeName} (
        {todaysTimetable.routeLongName})
      </h1>
      <div className="container mx-auto flex flex-grow flex-col gap-4 overflow-hidden px-4 md:flex-row">
        <div className="flex h-1/2 flex-row gap-4 md:h-auto md:w-1/2">
          <div className="w-1/2 overflow-auto">
            <Timetable
              header={todaysTimetable.inStopName}
              values={todaysTimetable.inStopTimes}
            />
          </div>
          <div className="w-1/2 overflow-auto">
            <Timetable
              header={todaysTimetable.outStopName}
              values={todaysTimetable.outStopTimes}
            />
          </div>
        </div>
        <div className="h-1/2 md:h-auto md:w-1/2">
          <DynamicMap />
        </div>
      </div>
      <footer className="mt-auto py-2 text-center text-sm text-gray-300">
        Gellért Kovács, 2025
      </footer>
    </main>
  );
}
