import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Timetable from "../../components/Timetable";
import { CtpWeeklyTimetable } from "../../models/CtpWeeklyTimetable";
import Footer from "../../components/Footer";

export default function WeeklyTimetable() {
  const location = useLocation();

  const [weeklyTimetable, setWeeklyTimetable] =
    useState<CtpWeeklyTimetable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRouteNameFromLocationPath = () =>
    location.pathname.split("/").pop() || "25";

  useEffect(() => {
    const fetchWeeklyTimetable = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "/api/timetables/" + getRouteNameFromLocationPath()
        );
        if (!response.ok) {
          throw new Error(
            "Failed to fetch weekly timetable. Status: " + response.status
          );
        }
        const data = await response.json();
        setWeeklyTimetable(data.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWeeklyTimetable();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-900 to-blue-900">
        <div className="rounded-xl bg-white/10 px-8 py-6 shadow-xl backdrop-blur-md">
          <span className="block animate-pulse text-lg font-semibold text-white">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-900 to-pink-900">
        <div className="rounded-xl bg-white/10 px-8 py-6 shadow-xl backdrop-blur-md">
          <span className="block text-lg font-semibold text-white">
            Error: {error}
          </span>
        </div>
      </div>
    );
  }

  if (!weeklyTimetable || weeklyTimetable.dailyTimetables.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="rounded-xl bg-white/10 px-8 py-6 shadow-xl backdrop-blur-md">
          <span className="block text-lg font-semibold text-white">
            No data available
          </span>
        </div>
      </div>
    );
  }

  const getTimetableByType = (type: string) =>
    weeklyTimetable.dailyTimetables.find((t) => t.dayType === type);

  const types = [
    { key: "weekdays", label: "WEEKDAYS" },
    { key: "saturday", label: "SATURDAY" },
    { key: "sunday", label: "SUNDAY" },
  ];

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#1a6347] via-[#2e3c7e] to-[#15162c] text-white">
      <header className="z-10 flex flex-col items-center justify-center bg-white/10 py-2 shadow-lg backdrop-blur-md md:py-6 md:flex-row md:justify-between md:px-6 lg:px-12">
        <h1 className="text-lg font-extrabold tracking-tight text-center md:text-2xl lg:text-4xl">
          {weeklyTimetable.routeName}
          <span className="ml-2 text-blue-200">
            ({weeklyTimetable.routeLongName.replace(/"/g, "").trim()})
          </span>
          <Link
            to={"/t/" + getRouteNameFromLocationPath()}
            className="inline-flex items-center rounded bg-green-600 px-3 py-1 text-white font-bold shadow-lg hover:bg-green-800 hover:scale-105 transition-all text-xs md:text-sm ml-2 h-6 md:h-7 border-2 border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            title="View Daily Timetable"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10m-12 8V7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Today
          </Link>
        </h1>
      </header>
      <div className="container mx-auto flex flex-grow flex-col gap-1 overflow-hidden px-2 py-2 sm:px-0 sm:py-4 md:flex-row md:gap-2 md:px-0 lg:px-0">
        {types.map(({ key, label }) => {
          const timetable = getTimetableByType(key);
          if (!timetable) return null;
          return (
            <section
              key={key}
              className="flex flex-1 w-full flex-col gap-2 min-w-0 min-h-0 bg-white/5 rounded-2xl shadow-md p-2 md:p-4"
            >
              <h2 className="text-lg font-bold text-center text-green-200 mb-1 tracking-wider">
                {label}
              </h2>
              <div className="flex flex-row gap-2 min-h-0 flex-1 md:h-auto md:gap-4">
                <div className="w-1/2 min-w-0 overflow-auto">
                  <Timetable
                    header={timetable.inStopName}
                    values={timetable.inStopTimes}
                    timeNow={null}
                  />
                </div>
                <div className="w-1/2 min-w-0 overflow-auto">
                  <Timetable
                    header={timetable.outStopName}
                    values={timetable.outStopTimes}
                    timeNow={null}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>
      <Footer />
    </main>
  );
}
