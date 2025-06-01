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
      setLastUpdated(new Date()); // Set last updated timestamp
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
    // Initial data fetch
    fetchWeeklyTimetable();
    fetchVehicles();

    // Set up interval for vehicles refresh every 30 seconds
    const vehiclesRefreshInterval = setInterval(() => {
      fetchVehicles();
    }, 30000);

    // Clean up interval on component unmount
    return () => {
      clearInterval(vehiclesRefreshInterval);
    };
  }, []);

  if (weeklyTimetableLoading) {
    return <div>Loading...</div>;
  }

  if (weeklyTimetableError) {
    return <div>Error: {weeklyTimetableError}</div>;
  }

  if (!weeklyTimetable || weeklyTimetable.dailyTimetables.length === 0) {
    return <div>No data available</div>;
  }

  const todaysType = getTodaysType();
  const todaysTimetable = weeklyTimetable.dailyTimetables.find(
    (timetable: CtpDailyTimetable) => timetable.dayType === todaysType
  )!;

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
              timeNow={lastUpdated ? formatTime(lastUpdated) : ""}
            />
          </div>
          <div className="w-1/2 overflow-auto">
            <Timetable
              header={todaysTimetable.outStopName}
              values={todaysTimetable.outStopTimes}
              timeNow={lastUpdated ? formatTime(lastUpdated) : ""}
            />
          </div>
        </div>
        <div className="h-1/2 md:h-auto md:w-2/3">
          <Map vehicles={vehicles} />
        </div>
      </div>
      <footer className="mt-auto py-2 text-center text-sm text-gray-300">
        Gellért Kovács, 2025
        {lastUpdated && (
          <span className="ml-4">
            Vehicles last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </footer>
    </main>
  );
}
