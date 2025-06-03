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
      return "text-gray-400 line-through"; // Add line-through for past departures
    }
    if (value === nextDeparture) {
      return "text-green-400 font-bold";
    }
    return "text-white";
  };

  // Auto-scroll to position the next departure in the middle when component updates
  useEffect(() => {
    if (scrollContainerRef.current && nextDeparture) {
      const nextDepartureIndex = values.indexOf(nextDeparture);
      if (nextDepartureIndex === -1) return;
      const targetRow = scrollContainerRef.current.querySelector(
        `tr:nth-child(${nextDepartureIndex + 1})`
      );
      if (targetRow) {
        (targetRow as HTMLElement).scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      }
    }
  }, [nextDeparture, timeNow, values]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white/10 shadow-lg backdrop-blur-md">
      {/* Fixed header outside the scrollable area */}
      <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/90 shadow-md">
        {header}
      </div>
      {/* Scrollable body with ref */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <table className="w-full text-center text-base text-white">
          <tbody>
            {values.map((value, index) => (
              <tr
                key={index}
                className={`transition-colors duration-200 ${
                  value === nextDeparture
                    ? "bg-green-500/10"
                    : "hover:bg-white/5"
                }`}
              >
                <td
                  className={`px-6 py-3 ${getTextColor(
                    value
                  )} flex items-center justify-center gap-2`}
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
