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
import { buildAddress, digits, type Address } from "@/lib/br-address";
import { getStorePresence } from "@/lib/store-location";

export type Location = Address;

type StoredLocation = Location & { confirmed: boolean };

type LocationContextValue = {
  location: Location | null;
  setLocation: (location: Location) => void;
  detectGps: () => Promise<Location | null>;
  lookupCep: (cep: string) => Promise<Location | null>;
  displayCity: string;
  displayState: string;
  address: string;
  distance: string;
  confirmed: boolean;
  detecting: boolean;
  ready: boolean;
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
  return (
    buildAddress(raw ?? {}) ?? {
      ...FALLBACK,
      street: raw?.street?.trim() || undefined,
      neighborhood: raw?.neighborhood?.trim() || undefined,
      zipCode: digits(raw?.zipCode ?? "").slice(0, 8) || undefined,
      number: raw?.number?.trim() || undefined,
    }
  );
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

async function fetchLocation(qs: string): Promise<Location | null> {
  try {
    const res = await fetch(`/api/location/city?${qs}`, { cache: "no-store" });
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
          await fetchLocation(
            `lat=${encodeURIComponent(position.coords.latitude)}&lon=${encodeURIComponent(position.coords.longitude)}`,
          ),
        );
      },
      () => resolve(null),
      {
        enableHighAccuracy: false,
        timeout: 8_000,
        maximumAge: 300_000,
      },
    );
  });
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setLocationState(normalizeLocation(stored));
      setConfirmed(true);
      setModalOpen(false);
    }
    setReady(true);
  }, []);

  const setLocation = useCallback((next: Location) => {
    const normalized = normalizeLocation(next);
    setLocationState(normalized);
    setConfirmed(true);
    persistConfirmed(normalized);
    setModalOpen(false);
  }, []);

  const detectGps = useCallback(async () => {
    setDetecting(true);
    try {
      return await detectCityViaGeolocation();
    } finally {
      setDetecting(false);
    }
  }, []);

  const lookupCep = useCallback(async (raw: string) => {
    const cep = digits(raw);
    if (cep.length !== 8) return null;
    setDetecting(true);
    try {
      return await fetchLocation(`cep=${encodeURIComponent(cep)}`);
    } finally {
      setDetecting(false);
    }
  }, []);

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
      detectGps,
      lookupCep,
      displayCity: current.city,
      displayState: current.state,
      address: presence.address,
      distance: presence.distance,
      confirmed,
      detecting,
      ready,
      modalOpen,
      openModal,
      closeModal,
    };
  }, [
    location,
    confirmed,
    detecting,
    ready,
    modalOpen,
    setLocation,
    detectGps,
    lookupCep,
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
