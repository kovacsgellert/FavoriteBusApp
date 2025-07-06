import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RouteDto } from "../../models/RouteDto";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import Footer from "../../components/Footer";
import Chip from "../../components/Chip";
import {
  getFavoriteRoutes,
  isRouteFavorite,
  toggleFavoriteRoute,
} from "./favoriteRouteUtils";
import RouteListButton from "../../components/RouteListButton";

const ROUTE_TYPE_CHIP_PROPS = [
  {
    value: "BUS",
    selectedColor: "bg-yellow-700 text-yellow-100",
    unselectedColor: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "TROLLEY",
    selectedColor: "bg-green-700 text-green-100",
    unselectedColor: "bg-green-100 text-green-700",
  },
  {
    value: "TRAM",
    selectedColor: "bg-purple-700 text-purple-100",
    unselectedColor: "bg-purple-100 text-purple-700",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<RouteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [_, setFavoriteRoutes] = useState<string[]>(() => getFavoriteRoutes());

  useEffect(() => {
    setFavoriteRoutes(getFavoriteRoutes());
  }, []);

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

  const noFilterActive = selectedTypes.length === 0 && search.trim() === "";

  const routesToShow = useMemo(() => {
    if (noFilterActive) {
      return [
        ...routes.filter((route) => isRouteFavorite(route.name)),
        ...routes.filter((route) => !isRouteFavorite(route.name)),
      ];
    } else {
      return routes.filter((route) => {
        const matchesType =
          selectedTypes.length === 0 || selectedTypes.includes(route.type);
        const searchLower = search.toLowerCase();
        const matchesSearch =
          route.name.toLowerCase().includes(searchLower) ||
          route.longName.toLowerCase().includes(searchLower);
        return matchesType && matchesSearch;
      });
    }
  }, [routes, selectedTypes, search]);

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
          {ROUTE_TYPE_CHIP_PROPS.map((rt) => (
            <Chip
              key={rt.value}
              label={rt.value}
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
          {routesToShow.map((route) => {
            return (
              <RouteListButton
                key={route.id}
                route={route}
                isFavorite={isRouteFavorite(route.name)}
                onLongPress={() => {
                  const updated = toggleFavoriteRoute(route.name);
                  setFavoriteRoutes([...updated]);
                }}
                onShortPress={() => navigate(`/t/${route.name}`)}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
