"use client";

import { useEffect, useState } from "react";
import type { CtpWeeklyTimetable } from "./types";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

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

  let dailyTimetable = weeklyTimetable.dailyTimetables[0]!;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a6347] to-[#15162c] text-white">
      <div className="container mx-auto flex flex-row gap-4 px-4">
        <div className="w-1/4">
          <Timetable
            header={dailyTimetable.inStopName}
            values={dailyTimetable.inStopTimes}
          />
        </div>
        <div className="w-1/4">
          <Timetable
            header={dailyTimetable.outStopName}
            values={dailyTimetable.outStopTimes}
          />
        </div>
        <div className="h-80vh w-1/2">
          <MapContainer
            center={[46.7712, 23.6236]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[46.7712, 23.6236]}>
              <Popup>Cluj-Napoca City Center</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}

function Timetable({ header, values }: TimetableProps) {
  return (
    <div className="h-80vh overflow-y-auto shadow-md sm:rounded-lg">
      <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              {header}
            </th>
          </tr>
        </thead>
        <tbody>
          {values.map((value, index) => (
            <tr className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <td className="px-6 py-4">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type TimetableProps = {
  header: string;
  values: string[];
};
