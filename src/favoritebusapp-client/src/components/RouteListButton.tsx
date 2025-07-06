import { usePressActions } from "../hooks/usePressActions";
import { RouteDto } from "../models/RouteDto";

interface RouteListButtonProps {
  route: RouteDto;
  isFavorite: boolean;
  onShortPress: () => void;
  onLongPress: () => void;
}

const ROUTE_TYPE_COLORS = [
  {
    value: "BUS",
    color: "bg-yellow-700 text-yellow-100",
  },
  {
    value: "TROLLEY",
    color: "bg-green-700 text-green-100",
  },
  {
    value: "TRAM",
    color: "bg-purple-700 text-purple-100",
  },
];

export default function RouteListButton({
  route,
  isFavorite,
  onLongPress,
  onShortPress,
}: RouteListButtonProps) {
  const pressHandlers = usePressActions(onShortPress, onLongPress, 500);
  const typeColor =
    ROUTE_TYPE_COLORS.find((type) => type.value === route.type)?.color || "";

  return (
    <button
      key={route.name}
      {...pressHandlers}
      className="rounded-xl bg-white/10 hover:bg-white/20 shadow-md backdrop-blur-md p-3 flex flex-col items-start transition-all border border-transparent hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[70px] min-w-0 relative"
      title={`Go to daily timetable of ${route.name}`}
    >
      <span
        className={`flex flex-wrap items-center gap-2 text-lg font-bold mb-0.5 px-2 py-0.5 w-full`}
      >
        <span className={`rounded-3xl ${typeColor} px-2 py-0.5`}>
          {route.name}
        </span>
        <span className="block sm:hidden text-base font-medium text-blue-100 ml-2 whitespace-nowrap">
          {route.longName.replace(/\"/g, "").trim()}
        </span>
        {isFavorite && (
          <span className="ml-auto flex items-center" title="Favorite">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="#e53e3e"
              stroke="#e53e3e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block align-middle"
            >
              <path d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.36 16 21 16 21H12Z" />
            </svg>
          </span>
        )}
      </span>
      <span className="hidden sm:block text-base text-blue-100 font-medium">
        {route.longName.replace(/\"/g, "").trim()}
      </span>
    </button>
  );
}
