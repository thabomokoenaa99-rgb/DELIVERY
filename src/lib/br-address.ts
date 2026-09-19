export const STATE_LABELS: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

export type Address = {
  state: string;
  stateLabel: string;
  city: string;
  street?: string;
  neighborhood?: string;
  zipCode?: string;
  number?: string;
};

export type ViaCep = {
  erro?: boolean | string;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

export function digits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCep(value: string) {
  const d = digits(value).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function opt(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function buildAddress(raw: {
  city?: string | null;
  state?: string | null;
  stateLabel?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  zipCode?: string | null;
  number?: string | null;
}): Address | null {
  const city = opt(raw.city);
  if (!city) return null;
  const code = (raw.state ?? "").trim().toUpperCase();
  if (code && !STATE_LABELS[code]) return null;
  const state = STATE_LABELS[code] ? code : "SP";
  const rawZip = digits(raw.zipCode ?? "");
  const zipCode = rawZip.length === 8 ? rawZip : undefined;

  return {
    state,
    stateLabel: STATE_LABELS[state] ?? opt(raw.stateLabel) ?? "São Paulo",
    city: /^sao paulo$/i.test(city)
      ? "São Paulo"
      : /^rio de janeiro$/i.test(city)
        ? "Rio de Janeiro"
        : city,
    street: opt(raw.street),
    neighborhood: opt(raw.neighborhood),
    zipCode,
    number: opt(raw.number),
  };
}

export function addressFromViaCep(data: ViaCep): Address | null {
  if (data.erro) return null;
  return buildAddress({
    city: data.localidade,
    state: data.uf,
    street: data.logradouro,
    neighborhood: data.bairro,
    zipCode: data.cep,
  });
}

const viaCepSample = addressFromViaCep({
  cep: "01310-100",
  logradouro: "Avenida Paulista",
  bairro: "Bela Vista",
  localidade: "São Paulo",
  uf: "SP",
});
if (
  digits("01310-100") !== "01310100" ||
  formatCep("01310100") !== "01310-100" ||
  viaCepSample?.street !== "Avenida Paulista" ||
  viaCepSample.zipCode !== "01310100" ||
  addressFromViaCep({ erro: true, localidade: "X", uf: "SP" }) !== null
) {
  throw new Error("consulta de CEP quebrou");
}
