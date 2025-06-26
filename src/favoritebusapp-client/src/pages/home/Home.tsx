import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteDto } from "../../models/RouteDto";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Footer from "../../components/Footer";

const ROUTE_TYPES = [
  { label: "BUS", value: "BUS", color: "bg-green-700 text-green-100" },
  {
    label: "TROLLEY",
    value: "TROLLEY",
    color: "bg-yellow-700 text-yellow-100",
  },
  { label: "TRAM", value: "TRAM", color: "bg-purple-700 text-purple-100" },
];

function Chip({
  label,
  selected,
  onClick,
  color,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1 rounded-full font-semibold shadow-md border-2 transition-all duration-150 mr-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        selected
          ? `${color} border-white/80 scale-105`
          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
      }`}
      style={{ minWidth: 80 }}
    >
      {label}
    </button>
  );
}

export default function Home() {
  const [routes, setRoutes] = useState<RouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    ROUTE_TYPES.map((rt) => rt.value)
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/routes");
        if (!response.ok) {
          throw new Error("Failed to fetch routes. Status: " + response.status);
        }
        const data = await response.json();
        setRoutes(data.data || []);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.length === 1
          ? prev // Prevent unselecting all
          : prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const filteredRoutes = routes.filter((route) =>
    selectedTypes.includes(route.type)
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#1a6347] via-[#2e3c7e] to-[#15162c] text-white">
      <header className="z-10 flex flex-col items-center justify-center bg-white/10 py-8 shadow-lg backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">
          Favorite Bus Routes
        </h1>
        <p className="mt-2 text-blue-200 text-lg text-center max-w-2xl">
          Select a route to view its daily timetable and live vehicles.
        </p>
      </header>
      <div className="container mx-auto flex-1 px-2 py-6 md:px-8 lg:px-16 flex flex-col">
        <div className="flex flex-wrap items-center mb-4">
          {ROUTE_TYPES.map((rt) => (
            <Chip
              key={rt.value}
              label={rt.label}
              selected={selectedTypes.includes(rt.value)}
              onClick={() => toggleType(rt.value)}
              color={rt.color}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => navigate(`/t/${route.name}`)}
              className="rounded-xl bg-white/10 hover:bg-white/20 shadow-md backdrop-blur-md p-3 flex flex-col items-start transition-all border border-transparent hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[70px] min-w-0"
              title={`Go to ${route.name}`}
            >
              <span className="text-lg font-bold text-green-300 mb-0.5">
                {route.name}
              </span>
              <span className="text-base text-blue-100 font-medium">
                {route.longName.replace(/\"/g, "").trim()}
              </span>
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
