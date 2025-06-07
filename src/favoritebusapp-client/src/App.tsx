import { useEffect, useState } from "react";
import Timetable from "./components/Timetable";
import Map from "./components/Map";
import { CtpDailyTimetable } from "./models/CtpDailyTimetable";
import { CtpWeeklyTimetable } from "./models/CtpWeeklyTimetable";
import { TranzyVehicle } from "./models/TranzyVehicle";
import "leaflet/dist/leaflet.css";

export default function HomePage() {
  const [weeklyTimetable, setWeeklyTimetable] =
    useState<CtpWeeklyTimetable | null>(null);
  const [weeklyTimetableLoading, setWeeklyTimetableLoading] = useState(true);
  const [weeklyTimetableError, setWeeklyTimetableError] = useState<
    string | null
  >(null);

  const [vehicles, setVehicles] = useState<TranzyVehicle[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsToNextUpdate, setSecondsToNextUpdate] = useState(30);

  const fetchWeeklyTimetable = async () => {
    setWeeklyTimetableLoading(true);
    setWeeklyTimetableError(null);
    try {
      const response = await fetch("api/timetables/25");
      if (!response.ok) {
        throw new Error(
          "Failed to fetch weekly timetable. Status: " + response.status
        );
      }
      const data = await response.json();
      setWeeklyTimetable(data.data);
    } catch (err: unknown) {
      setWeeklyTimetableError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setWeeklyTimetableLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("api/vehicles/25");
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles. Status: " + response.status);
      }
      const data = await response.json();
      setVehicles(data.data);
      setLastUpdated(new Date());
    } catch (err: unknown) {
    } finally {
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

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    fetchWeeklyTimetable();
    fetchVehicles();

    // Set up interval for vehicles refresh every 30 seconds
    const vehiclesRefreshInterval = setInterval(() => {
      fetchVehicles();
      setSecondsToNextUpdate(30);
    }, 30000);

    // Countdown timer for next update
    const countdownInterval = setInterval(() => {
      setSecondsToNextUpdate((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Clean up intervals on component unmount
    return () => {
      clearInterval(vehiclesRefreshInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  if (weeklyTimetableLoading) {
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

  if (weeklyTimetableError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-900 to-pink-900">
        <div className="rounded-xl bg-white/10 px-8 py-6 shadow-xl backdrop-blur-md">
          <span className="block text-lg font-semibold text-white">
            Error: {weeklyTimetableError}
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

  const todaysType = getTodaysType();
  const todaysTimetable = weeklyTimetable.dailyTimetables.find(
    (timetable: CtpDailyTimetable) => timetable.dayType === todaysType
  )!;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#1a6347] via-[#2e3c7e] to-[#15162c] text-white">
      <header className="z-10 flex flex-col items-center justify-center bg-white/10 py-6 shadow-lg backdrop-blur-md md:flex-row md:justify-between md:px-6 lg:px-12">
        <h1 className="text-xl font-extrabold tracking-tight text-center md:text-2xl lg:text-4xl">
          {todaysTimetable.routeName}
          <span className="ml-2 text-blue-200">
            ({todaysTimetable.routeLongName})
          </span>
          <br />
          <span className="text-green-300">{todaysType.toUpperCase()}</span>
        </h1>
        <div className="mt-2 text-xs text-gray-200 md:mt-0 md:text-sm">
          {lastUpdated && (
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()} &nbsp;|
              &nbsp;Next update in {secondsToNextUpdate}s
            </span>
          )}
        </div>
      </header>
      <div className="container mx-auto flex flex-grow flex-col gap-4 overflow-hidden px-1 py-2 sm:px-2 sm:py-4 md:flex-row md:gap-8 md:px-4 lg:px-8">
        <div className="flex flex-row gap-2 h-1/2 md:h-auto md:w-1/3 md:gap-4">
          <div className="w-1/2 min-w-0 overflow-auto">
            <Timetable
              header={todaysTimetable.inStopName}
              values={todaysTimetable.inStopTimes}
              timeNow={lastUpdated ? formatTime(lastUpdated) : ""}
            />
          </div>
          <div className="w-1/2 min-w-0 overflow-auto">
            <Timetable
              header={todaysTimetable.outStopName}
              values={todaysTimetable.outStopTimes}
              timeNow={lastUpdated ? formatTime(lastUpdated) : ""}
            />
          </div>
        </div>
        <div className="h-1/2 min-h-[250px] md:h-auto md:w-2/3">
          <Map vehicles={vehicles} />
        </div>
      </div>
      <footer className="mt-auto py-3 text-center bg-white/5 shadow-inner backdrop-blur-md">
        <span className="inline-flex items-center font-semibold tracking-wide text-gray-300 text-base">
          © 2025 Gellért Kovács
          <a
            href="https://github.com/kovacsgellert/FavoriteBusApp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center ml-2 underline hover:text-blue-200"
            aria-label="GitHub Repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.083-0.729 0.083-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </span>
      </footer>
    </main>
  );
}
