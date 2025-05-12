import { useEffect, useState } from "react";
import type {
  CtpWeeklyTimetable,
  TranzyVehicle,
  CtpDailyTimetable,
} from "./models";
import Timetable from "./components/Timetable";
import Map from "./components/Map";
import { API_URL } from "./constants";

export default function App() {
  const [weeklyTimetable, setWeeklyTimetable] =
    useState<CtpWeeklyTimetable | null>(null);
  const [weeklyTimetableLoading, setWeeklyTimetableLoading] = useState(true);
  const [weeklyTimetableError, setWeeklyTimetableError] = useState<
    string | null
  >(null);

  const [vehicles, setVehicles] = useState<TranzyVehicle[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchWeeklyTimetable = async () => {
    setWeeklyTimetableLoading(true);
    setWeeklyTimetableError(null);
    try {
      const response = await fetch(`${API_URL}/timetables`);
      if (!response.ok) {
        throw new Error(
          "Failed to fetch weekly timetable. Status: " + response.status,
        );
      }
      const data = (await response.json()) as CtpWeeklyTimetable;
      setWeeklyTimetable(data);
    } catch (err: unknown) {
      setWeeklyTimetableError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching timetable",
      );
    } finally {
      setWeeklyTimetableLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles`);
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles. Status: " + response.status);
      }
      const data = (await response.json()) as TranzyVehicle[];
      setVehicles(data);
      setLastRefreshed(new Date()); // Set last updated timestamp
    } catch (err: unknown) {
      console.log(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while fetching vehicles",
      );
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

  const getTimeNow = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    void fetchWeeklyTimetable();
    void fetchVehicles();

    // Set up interval to refresh vehicles every 30 seconds
    const vehiclesRefreshInterval = setInterval(() => {
      void fetchVehicles();
    }, 30000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(vehiclesRefreshInterval);
    };
  }, []);

  if (weeklyTimetableLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-4 border-gray-200"></div>
      </div>
    );
  }

  if (weeklyTimetableError) {
    return <div>Error: {weeklyTimetableError}</div>;
  }

  if (!weeklyTimetable || weeklyTimetable.dailyTimetables.length === 0) {
    return <div>No data available</div>;
  }

  const todaysType = getTodaysType();
  const todaysTimetable = weeklyTimetable.dailyTimetables.find(
    (timetable: CtpDailyTimetable) => timetable.dayType === todaysType,
  );

  if (!todaysTimetable) {
    return <div>No timetable for today</div>;
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[#1a6347] to-[#15162c] text-white">
      <h1 className="py-3 text-center text-xl font-bold md:text-3xl">
        {todaysType.toUpperCase()} - {todaysTimetable.routeName} (
        {todaysTimetable.routeLongName})
      </h1>
      <div className="container mx-auto flex flex-grow flex-col gap-4 overflow-hidden px-4 md:flex-row">
        <div className="flex h-1/2 flex-row gap-4 md:h-auto md:w-1/3">
          <div className="w-1/2 overflow-auto">
            <Timetable
              header={todaysTimetable.inStopName}
              values={todaysTimetable.inStopTimes}
              timeNow={lastRefreshed ? getTimeNow(lastRefreshed) : ""}
            />
          </div>
          <div className="w-1/2 overflow-auto">
            <Timetable
              header={todaysTimetable.outStopName}
              values={todaysTimetable.outStopTimes}
              timeNow={lastRefreshed ? getTimeNow(lastRefreshed) : ""}
            />
          </div>
        </div>
        <div className="h-1/2 md:h-auto md:w-2/3">
          <Map vehicles={vehicles} />
        </div>
      </div>
      <footer className="mt-auto py-2 text-center text-sm text-gray-300">
        Developed by Gellért Kovács, 2025
        <span className="ml-4">
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
        </span>
      </footer>
    </main>
  );
}
