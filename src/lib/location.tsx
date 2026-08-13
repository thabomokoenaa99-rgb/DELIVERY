"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { citiesByState } from "@/data/store";
import { getStorePresence } from "@/lib/store-location";

export type Location = {
  state: string;
  stateLabel: string;
  city: string;
};

type StoredLocation = Location & { confirmed: boolean };

type LocationContextValue = {
  location: Location | null;
  setLocation: (location: Location) => void;
  acceptGps: () => Promise<boolean>;
  displayCity: string;
  displayState: string;
  address: string;
  distance: string;
  confirmed: boolean;
  detecting: boolean;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const STORAGE_KEY = "bellanapoli-location";

const FALLBACK: Location = {
  state: "SP",
  stateLabel: "São Paulo",
  city: "São Paulo",
};

const LocationContext = createContext<LocationContextValue | null>(null);

function normalizeLocation(raw: Partial<Location> | null): Location {
  const city = raw?.city?.trim() || FALLBACK.city;
  const state = raw?.state?.trim().toUpperCase() || FALLBACK.state;
  const stateLabel = raw?.stateLabel?.trim() || FALLBACK.stateLabel;
  return { state, stateLabel, city };
}

function readStored(): StoredLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as Partial<StoredLocation>;
    if (!parsed.confirmed) return null;
    return { ...normalizeLocation(parsed), confirmed: true };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistConfirmed(location: Location) {
  const payload: StoredLocation = { ...normalizeLocation(location), confirmed: true };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

async function fetchCityFromApi(lat: number, lon: number): Promise<Location | null> {
  try {
    const qs = `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(`/api/location/city${qs}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<Location>;
    if (!data.city?.trim()) return null;
    return normalizeLocation(data);
  } catch {
    return null;
  }
}

function detectCityViaGeolocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
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
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 20_000,
        maximumAge: 0,
      },
    );
  });
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setLocationState(normalizeLocation(stored));
      setConfirmed(true);
      setModalOpen(false);
    } else {
      setModalOpen(true);
    }
  }, []);

  const setLocation = useCallback((next: Location) => {
    const normalized = normalizeLocation(next);
    setLocationState(normalized);
    setConfirmed(true);
    persistConfirmed(normalized);
    setModalOpen(false);
  }, []);

  const acceptGps = useCallback(async () => {
    setDetecting(true);
    try {
      const result = await detectCityViaGeolocation();
      if (!result) return false;
      setLocation(result);
      return true;
    } finally {
      setDetecting(false);
    }
  }, [setLocation]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    if (confirmed) setModalOpen(false);
  }, [confirmed]);

  const value = useMemo<LocationContextValue>(() => {
    const current = location ?? FALLBACK;
    const presence = getStorePresence(
      current.city,
      current.state,
      current.stateLabel,
    );

    return {
      location: confirmed ? current : location,
      setLocation,
      acceptGps,
      displayCity: current.city,
      displayState: current.state,
      address: presence.address,
      distance: presence.distance,
      confirmed,
      detecting,
      modalOpen,
      openModal,
      closeModal,
    };
  }, [
    location,
    confirmed,
    detecting,
    modalOpen,
    setLocation,
    acceptGps,
    openModal,
    closeModal,
  ]);

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
