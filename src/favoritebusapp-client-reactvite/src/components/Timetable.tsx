import { useEffect, useRef } from "react";

type TimetableProps = {
  header: string;
  values: string[];
  timeNow: string;
};

export default function Timetable({ header, values, timeNow }: TimetableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nextDeparture = values.find((value) => value >= timeNow);

  const getTextColor = (value: string) => {
    if (value < timeNow) {
      return "text-red-500";
    }

    if (value >= timeNow) {
      return "text-green-500";
    }
  };

  // Auto-scroll to position the next departure in the middle when component updates
  useEffect(() => {
    if (scrollContainerRef.current && nextDeparture) {
      // Find the next departure row element and scroll directly to it
      const nextDepartureIndex = values.indexOf(nextDeparture);
      if (nextDepartureIndex === -1) return;

      // Find the row by index and scroll it into view
      const targetRow = scrollContainerRef.current.querySelector(
        `tr:nth-child(${nextDepartureIndex + 1})`,
      );
      if (targetRow) {
        targetRow.scrollIntoView({ block: "center" });
      }
    }
  }, [nextDeparture, timeNow, values]);

  return (
    <div className="flex h-full flex-col overflow-hidden shadow-md sm:rounded-lg">
      {/* Fixed header outside the scrollable area */}
      <div className="bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
        {header}
      </div>

      {/* Scrollable body with ref */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
          <tbody>
            {values.map((value, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <td
                  className={`px-6 py-4 ${getTextColor(value)} flex items-center justify-center gap-2`}
                >
                  <span>{value}</span>
                  {value === nextDeparture && (
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
