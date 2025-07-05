import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteDto } from "../../models/RouteDto";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Footer from "../../components/Footer";
import Chip from "../../components/Chip";

const ROUTE_TYPES = [
  {
    label: "BUS",
    value: "BUS",
    selectedColor: "bg-yellow-700 text-yellow-100",
    unselectedColor: "bg-yellow-100 text-yellow-700",
  },
  {
    label: "TROLLEY",
    value: "TROLLEY",
    selectedColor: "bg-green-700 text-green-100",
    unselectedColor: "bg-green-100 text-green-700",
  },
  {
    label: "TRAM",
    value: "TRAM",
    selectedColor: "bg-purple-700 text-purple-100",
    unselectedColor: "bg-purple-100 text-purple-700",
  },
];

export default function Home() {
  const [routes, setRoutes] = useState<RouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // By default, no chip is selected
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
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
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // If no chip is selected, show all routes
  const filteredRoutes = routes.filter((route) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(route.type);
    const searchLower = search.toLowerCase();
    const matchesSearch =
      route.name.toLowerCase().includes(searchLower) ||
      route.longName.toLowerCase().includes(searchLower);
    return matchesType && matchesSearch;
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#1a6347] via-[#2e3c7e] to-[#15162c] text-white">
      <header className="z-10 flex flex-col items-center justify-center bg-white/10 py-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="bg-white/80 rounded-full p-2 flex items-center justify-center shadow">
            <img
              src="bus-purple.png"
              alt="Logo"
              className="h-6 w-6 md:h-8 md:w-8 object-contain"
            />
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center m-0">
            Favorite Bus App
          </h1>
        </div>
      </header>
      <div className="container mx-auto flex-1 px-1 py-3 sm:px-2 sm:py-6 md:px-8 lg:px-16 flex flex-col">
        <div className="flex flex-row flex-wrap items-center justify-center mb-4 gap-1 md:gap-2">
          {ROUTE_TYPES.map((rt) => (
            <Chip
              key={rt.value}
              label={rt.label}
              selected={selectedTypes.includes(rt.value)}
              onClick={() => toggleType(rt.value)}
              selectedColor={rt.selectedColor}
              unselectedColor={rt.unselectedColor}
            />
          ))}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search routes..."
            className="ml-0.5 md:ml-2 px-2 py-0.5 sm:px-2 sm:py-1 rounded-lg border border-white/30 bg-white/10 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all flex-shrink-0"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredRoutes.map((route) => {
            const typeColors = ROUTE_TYPES.find(
              (rt) => rt.value === route.type
            );
            const typeColor = typeColors?.selectedColor || "text-green-300";
            return (
              <button
                key={route.id}
                onClick={() => navigate(`/t/${route.name}`)}
                className="rounded-xl bg-white/10 hover:bg-white/20 shadow-md backdrop-blur-md p-3 flex flex-col items-start transition-all border border-transparent hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[70px] min-w-0"
                title={`Go to ${route.name}`}
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
                </span>
                <span className="hidden sm:block text-base text-blue-100 font-medium">
                  {route.longName.replace(/\"/g, "").trim()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
