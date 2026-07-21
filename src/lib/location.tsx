"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { brazilianStates, citiesByState } from "@/data/store";

type Location = {
  state: string;
  stateLabel: string;
  city: string;
};

type LocationContextValue = {
  location: Location | null;
  setLocation: (location: Location) => void;
  displayCity: string;
  displayState: string;
};

const STORAGE_KEY = "bellanapoli-location";

const LocationContext = createContext<LocationContextValue | null>(null);

async function detectLocationByIp(): Promise<Location | null> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const data = (await res.json()) as {
      region_code?: string;
      city?: string;
      region?: string;
    };
    if (!data.region_code || !data.city) return null;
    const stateLabel =
      brazilianStates.find((s) => s.value === data.region_code)?.label ??
      data.region ??
      data.region_code;
    return {
      state: data.region_code,
      stateLabel,
      city: data.city,
    };
  } catch {
    return null;
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLocationState(JSON.parse(saved) as Location);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    detectLocationByIp().then((detected) => {
      if (detected) {
        setLocationState(detected);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(detected));
      }
    });
  }, []);

  const value = useMemo<LocationContextValue>(() => {
    const displayCity = location?.city ?? "Sua Região";
    const displayState = location?.state ?? "UF";

    return {
      location,
      displayCity,
      displayState,
      setLocation: (next) => {
        setLocationState(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      },
    };
  }, [location]);

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
