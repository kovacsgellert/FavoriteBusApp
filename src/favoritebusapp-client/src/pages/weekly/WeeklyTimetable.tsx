import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Timetable from "../../components/Timetable";
import { CtpWeeklyTimetable } from "../../models/CtpWeeklyTimetable";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

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
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!weeklyTimetable || weeklyTimetable.dailyTimetables.length === 0) {
    return <ErrorMessage message="No data available" />;
  }

  const getTimetableByType = (type: string) =>
    weeklyTimetable.dailyTimetables.find((t) => t.dayType === type);

  const timetableTypes = ["weekdays", "saturday", "sunday"];

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#1a6347] via-[#2e3c7e] to-[#15162c] text-white">
      <header className="z-10 flex flex-row items-center justify-between bg-white/10 py-4 shadow-lg backdrop-blur-md md:px-6 lg:px-12">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center gap-2">
            <span className="text-xl md:text-2xl lg:text-4xl font-extrabold tracking-tight text-center">
              {weeklyTimetable.routeName}
            </span>
            <span className="text-blue-200 text-xl md:text-2xl lg:text-4xl font-extrabold">
              ({weeklyTimetable.routeLongName.replace(/"/g, "").trim()})
            </span>
          </div>
        </div>
        {/* Right: Buttons */}
        <div className="flex flex-row items-center gap-2 ml-4 pr-2 sm:pr-0">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded bg-white/20 hover:bg-white/40 text-blue-900 hover:text-blue-700 p-2 shadow-lg transition-all border-2 border-transparent hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            title="Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5"
              />
            </svg>
          </Link>
          <Link
            to={"/t/" + getRouteNameFromLocationPath()}
            className="inline-flex items-center justify-center rounded bg-white/20 hover:bg-white/40 text-green-900 hover:text-green-700 p-2 shadow-lg transition-all border-2 border-transparent hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            title="View Daily Timetable (Map)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
              />
            </svg>
          </Link>
        </div>
      </header>
      <div className="container mx-auto flex flex-grow flex-col gap-1 overflow-hidden px-2 py-2 sm:px-0 sm:py-4 md:flex-row md:gap-2 md:px-0 lg:px-0">
        {timetableTypes.map((type) => {
          const timetable = getTimetableByType(type);
          if (!timetable) return null;
          return (
            <section
              key={type}
              className="flex flex-1 w-full flex-col gap-2 min-w-0 min-h-0 bg-white/5 rounded-2xl shadow-md p-2 md:p-4"
            >
              <h2 className="text-lg font-bold text-center text-green-200 mb-1 tracking-wider">
                {type.toUpperCase()}
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
