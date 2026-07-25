"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { citiesByState } from "@/data/store";

type Location = {
  state: string;
  stateLabel: string;
  city: string;
};

type LocationContextValue = {
  location: Location;
  setLocation: (location: Location) => void;
  displayCity: string;
  displayState: string;
};

const STORAGE_KEY = "bellanapoli-location";

const DEFAULT_LOCATION: Location = {
  state: "SP",
  stateLabel: "São Paulo",
  city: "São Paulo",
};

const LocationContext = createContext<LocationContextValue | null>(null);

function normalizeLocation(raw: Partial<Location> | null): Location {
  const city = raw?.city?.trim() || DEFAULT_LOCATION.city;
  const state = raw?.state?.trim().toUpperCase() || DEFAULT_LOCATION.state;
  const stateLabel = raw?.stateLabel?.trim() || DEFAULT_LOCATION.stateLabel;

  return { state, stateLabel, city };
}

function readStoredLocation(): Location | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return normalizeLocation(JSON.parse(saved) as Partial<Location>);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistLocation(location: Location) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
}

async function fetchCityFromApi(lat?: number, lon?: number): Promise<Location> {
  try {
    const qs =
      lat != null && lon != null
        ? `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
        : "";
    const res = await fetch(`/api/location/city${qs}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_LOCATION;
    const data = (await res.json()) as Partial<Location>;
    return normalizeLocation(data);
  } catch {
    return DEFAULT_LOCATION;
  }
}

function detectCityViaGeolocation(): Promise<Location> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      void fetchCityFromApi().then(resolve);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        resolve(
          await fetchCityFromApi(
            position.coords.latitude,
            position.coords.longitude,
          ),
        );
      },
      async () => {
        resolve(await fetchCityFromApi());
      },
      {
        enableHighAccuracy: false,
        timeout: 8_000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  });
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredLocation();
    if (stored) {
      setLocationState(stored);
    }
    setHydrated(true);

    // Sempre tenta detectar de novo (IP/GPS) — sem modal manual
    detectCityViaGeolocation().then((detected) => {
      const next = normalizeLocation(detected);
      setLocationState(next);
      persistLocation(next);
    });
  }, []);

  const value = useMemo<LocationContextValue>(() => {
    const current = hydrated ? location : DEFAULT_LOCATION;

    return {
      location: current,
      displayCity: current.city,
      displayState: current.state,
      setLocation: (next) => {
        const normalized = normalizeLocation(next);
        setLocationState(normalized);
        persistLocation(normalized);
      },
    };
  }, [location, hydrated]);

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}

export { citiesByState };
