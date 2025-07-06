const FAVORITES_KEY = "favoriteRoutes";

export function getFavoriteRoutes(): string[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setFavoriteRoutes(favorites: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function toggleFavoriteRoute(routeId: string) {
  const favorites = getFavoriteRoutes();
  const idx = favorites.indexOf(routeId);
  if (idx === -1) {
    favorites.push(routeId);
  } else {
    favorites.splice(idx, 1);
  }
  setFavoriteRoutes(favorites);
  return favorites;
}

export function isRouteFavorite(routeId: string): boolean {
  return getFavoriteRoutes().includes(routeId);
}
