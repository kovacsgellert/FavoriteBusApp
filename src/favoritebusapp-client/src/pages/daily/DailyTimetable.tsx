import { useEffect, useState, useRef } from "react";
import Timetable from "../../components/Timetable";
import Map from "../../components/Map";
import { CtpDailyTimetable } from "../../models/CtpDailyTimetable";
import { CtpWeeklyTimetable } from "../../models/CtpWeeklyTimetable";
import { useLocation, Link } from "react-router-dom";
import { ActiveVehicleDto } from "../../models/ActiveVehicleDto";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Countdown from "../../components/Countdown";

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
        throw Error("Failed to fetch vehicles. Status: " + response.status);
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
    const startVehiclePolling = () => {
      fetchVehicles();

      // Clear previous intervals before starting new ones
      if (vehiclesRefreshIntervalRef.current) {
        clearInterval(vehiclesRefreshIntervalRef.current);
      }

      vehiclesRefreshIntervalRef.current = setInterval(() => {
        fetchVehicles();
      }, VEHICLE_POLLING_INTERVAL_SECONDS * 1000);
    };

    const stopVehiclePolling = () => {
      if (vehiclesRefreshIntervalRef.current) {
        clearInterval(vehiclesRefreshIntervalRef.current);
        vehiclesRefreshIntervalRef.current = null;
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
    return <Loading />;
  }

  if (weeklyTimetableError) {
    return <ErrorMessage message={weeklyTimetableError} />;
  }

  if (!weeklyTimetable || weeklyTimetable.dailyTimetables.length === 0) {
    return <ErrorMessage message="No data available" />;
  }

  const todaysType = getTodaysType();
  const todaysTimetable = weeklyTimetable.dailyTimetables.find(
    (timetable: CtpDailyTimetable) => timetable.dayType === todaysType
  )!;
  
  if (!todaysTimetable) {
    return (
      <ErrorMessage
        message={`No timetable available for today. Route ${getRouteNameFromLocationPath()} is probably not in service on ${todaysType}.`}
      />
    );
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#1a6347] via-[#2e3c7e] to-[#15162c] text-white">
      <header className="z-10 flex flex-col md:flex-row items-center justify-between bg-white/10 py-4 shadow-lg backdrop-blur-md md:px-6 lg:px-12">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className="flex flex-row items-center justify-center gap-2">
            <span className="text-xl md:text-2xl lg:text-4xl font-extrabold tracking-tight text-center">
              {todaysTimetable.routeName}
            </span>
            <span className="text-blue-200 text-xl md:text-2xl lg:text-4xl font-extrabold">
              ({todaysTimetable.routeLongName.replace(/"/g, "").trim()})
            </span>
          </div>
          <div className="mt-1 text-green-300 text-lg md:text-xl lg:text-2xl font-extrabold">
            {todaysType.toUpperCase()}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 mt-2 w-full justify-center md:mt-0 md:ml-4 md:pr-2 md:w-auto md:justify-end">
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
            to={"/w/" + getRouteNameFromLocationPath()}
            className="inline-flex items-center justify-center rounded bg-white/20 hover:bg-white/40 text-green-900 hover:text-green-700 p-2 shadow-lg transition-all border-2 border-transparent hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            title="Weekly Timetable"
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
                d="M8 7V3m8 4V3m-9 8h10m-12 8V7a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </Link>
        </div>
      </header>
      <div className="container mx-auto flex flex-grow flex-col gap-4 overflow-hidden px-1 py-2 sm:px-2 sm:py-4 md:flex-row md:gap-8 md:px-4 lg:px-8">
        <div className="flex flex-row gap-2 h-2/5 md:h-auto md:w-1/3 md:gap-4">
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
        <div className="h-3/5 min-h-[250px] md:h-auto md:w-2/3 relative">
          <Map
            vehicles={vehicles}
            stops={[todaysTimetable.inStopName, todaysTimetable.outStopName]}
          />
          {/* Overlay: Last updated and countdown in bottom right, above map controls */}
          <div
            className="absolute right-1 bottom-5 z-[1001] bg-black/70 text-white rounded-lg px-3 py-1 flex flex-row items-center gap-2 shadow-md text-xs md:text-sm pointer-events-none select-none"
            style={{ maxWidth: "90vw" }}
          >
            {lastUpdated && (
              <span>
                Updated at: {lastUpdated.toLocaleTimeString()} &nbsp;|
                &nbsp;Next update in{" "}
                <Countdown
                  seconds={VEHICLE_POLLING_INTERVAL_SECONDS}
                  lastUpdated={lastUpdated}
                />
              </span>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
