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
  displayCity: string;
  displayState: string;
  address: string;
  distance: string;
  confirmed: boolean;
  detecting: boolean;
  detected: Location | null;
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

async function fetchCityFromApi(lat?: number, lon?: number): Promise<Location> {
  try {
    const qs =
      lat != null && lon != null
        ? `?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
        : "";
    const res = await fetch(`/api/location/city${qs}`, { cache: "no-store" });
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as Partial<Location>;
    return normalizeLocation(data);
  } catch {
    return FALLBACK;
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
  const [location, setLocationState] = useState<Location | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const [detected, setDetected] = useState<Location | null>(null);
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
    setHydrated(true);

    let cancelled = false;
    setDetecting(true);

    detectCityViaGeolocation().then((result) => {
      if (cancelled) return;
      const next = normalizeLocation(result);
      setDetected(next);
      setDetecting(false);

      // Sem confirmação ainda: pré-seleciona a detecção no modal
      if (!readStored()) {
        setLocationState(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLocation = useCallback((next: Location) => {
    const normalized = normalizeLocation(next);
    setLocationState(normalized);
    setConfirmed(true);
    persistConfirmed(normalized);
    setModalOpen(false);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => {
    if (confirmed) setModalOpen(false);
  }, [confirmed]);

  const value = useMemo<LocationContextValue>(() => {
    const current =
      location ?? detected ?? (hydrated ? FALLBACK : FALLBACK);
    const presence = getStorePresence(
      current.city,
      current.state,
      current.stateLabel,
    );

    return {
      location: confirmed ? current : location,
      setLocation,
      displayCity: confirmed ? current.city : current.city,
      displayState: confirmed ? current.state : current.state,
      address: presence.address,
      distance: presence.distance,
      confirmed,
      detecting,
      detected,
      modalOpen,
      openModal,
      closeModal,
    };
  }, [
    location,
    detected,
    hydrated,
    confirmed,
    detecting,
    modalOpen,
    setLocation,
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
