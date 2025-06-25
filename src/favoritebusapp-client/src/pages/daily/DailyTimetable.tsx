import { useEffect, useState, useRef } from "react";
import Timetable from "../../components/Timetable";
import Map from "../../components/Map";
import { CtpDailyTimetable } from "../../models/CtpDailyTimetable";
import { CtpWeeklyTimetable } from "../../models/CtpWeeklyTimetable";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import { ActiveVehicleDto } from "../../models/ActiveVehicleDto";
import Footer from "../../components/Footer";

export default function DailyTimetable() {
  const VEHICLE_POLLING_INTERVAL_SECONDS = 20;
  const location = useLocation();

  const [weeklyTimetable, setWeeklyTimetable] =
    useState<CtpWeeklyTimetable | null>(null);
  const [weeklyTimetableLoading, setWeeklyTimetableLoading] = useState(true);
  const [weeklyTimetableError, setWeeklyTimetableError] = useState<
    string | null
  >(null);

  const [vehicles, setVehicles] = useState<ActiveVehicleDto[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [secondsToNextUpdate, setSecondsToNextUpdate] = useState(
    VEHICLE_POLLING_INTERVAL_SECONDS
  );

  const vehiclesRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRouteNameFromLocationPath = () =>
    location.pathname.split("/").pop() || "25";

  const fetchWeeklyTimetable = async () => {
    setWeeklyTimetableLoading(true);
    setWeeklyTimetableError(null);
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
      setWeeklyTimetableError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setWeeklyTimetableLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch(
        "/api/vehicles/" + getRouteNameFromLocationPath()
      );
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

  // Polling logic with visibility handling
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | null = null;

    const startVehiclePolling = () => {
      fetchVehicles();
      setSecondsToNextUpdate(VEHICLE_POLLING_INTERVAL_SECONDS);

      vehiclesRefreshIntervalRef.current = setInterval(() => {
        fetchVehicles();
        setSecondsToNextUpdate(VEHICLE_POLLING_INTERVAL_SECONDS);
      }, VEHICLE_POLLING_INTERVAL_SECONDS * 1000);

      countdownInterval = setInterval(() => {
        setSecondsToNextUpdate((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    };

    const stopVehiclePolling = () => {
      if (vehiclesRefreshIntervalRef.current) {
        clearInterval(vehiclesRefreshIntervalRef.current);
        vehiclesRefreshIntervalRef.current = null;
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopVehiclePolling();
      } else {
        startVehiclePolling();
      }
    };

    // Initial fetch and polling start
    fetchWeeklyTimetable();
    startVehiclePolling();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      stopVehiclePolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [location.pathname]);

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
            ({todaysTimetable.routeLongName.replace(/"/g, "").trim()})
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
          <Map
            vehicles={vehicles}
            stops={[todaysTimetable.inStopName, todaysTimetable.outStopName]}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
