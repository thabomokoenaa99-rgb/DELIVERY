/** Presence local da loja adaptada à cidade do cliente. */

export type StorePresence = {
  address: string;
  distance: string;
  neighborhood: string;
  city: string;
  state: string;
  stateLabel: string;
};

const STREET_PREFIXES = ["Rua", "Av.", "Travessa", "Alameda"] as const;

const STREET_NAMES = [
  "das Flores",
  "São João",
  "Dom Pedro II",
  "XV de Novembro",
  "da Independência",
  "dos Ipês",
  "Brasil",
  "Getúlio Vargas",
  "das Palmeiras",
  "São José",
  "Santa Luzia",
  "do Comércio",
  "Barão do Rio Branco",
  "Tiradentes",
  "das Acácias",
  "Nossa Senhora Aparecida",
  "José de Alencar",
  "dos Pinheiros",
  "da Paz",
  "Santos Dumont",
] as const;

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function formatKm(km: number): string {
  return `${km.toFixed(1).replace(".", ",")}km de você`;
}

/**
 * Gera endereço e distância estáveis para a cidade (mesma cidade = mesmo resultado).
 * Mantém o endereço original quando a cidade for Jardim Maria Estela / SP.
 */
export function getStorePresence(
  city: string,
  state: string,
  stateLabel?: string,
): StorePresence {
  const cityName = city.trim() || "São Paulo";
  const stateCode = (state.trim() || "SP").toUpperCase();
  const label = stateLabel?.trim() || stateCode;

  if (
    /^jardim maria estela$/i.test(cityName) &&
    stateCode === "SP"
  ) {
    return {
      city: "Jardim Maria Estela",
      state: "SP",
      stateLabel: "São Paulo",
      neighborhood: "Jardim Maria Estela",
      address:
        "Rua Irmão Pio, 44 - Jardim Maria Estela, São Paulo - SP",
      distance: formatKm(1.6),
    };
  }

  const seed = hashSeed(`${cityName}|${stateCode}`);
  const prefix = STREET_PREFIXES[seed % STREET_PREFIXES.length];
  const street = STREET_NAMES[(seed >>> 3) % STREET_NAMES.length];
  const number = (seed % 880) + 12;
  const neighborhood = cityName;
  const km = ((seed % 28) + 8) / 10; // 0,8km … 3,5km

  return {
    city: cityName,
    state: stateCode,
    stateLabel: label,
    neighborhood,
    address: `${prefix} ${street}, ${number} - ${neighborhood}, ${cityName} - ${stateCode}`,
    distance: formatKm(km),
  };
}
