/** Divide o SHA-1 em prefixo enviado e sufixo verificado localmente (k-anonymity). */
export function splitHash(sha1Hex: string) {
  const hash = sha1Hex.toUpperCase();
  return { prefix: hash.slice(0, 5), suffix: hash.slice(5) };
}

/** Procura o sufixo na resposta "SUFIXO:CONTAGEM" do Pwned Passwords. */
export function countInRange(body: string, suffix: string): number {
  const target = suffix.toUpperCase();
  for (const line of body.split(/\r?\n/)) {
    const [candidate, count] = line.trim().split(':');
    if (candidate === target) return Number(count) || 0;
  }
  return 0;
}

export function exposureLevel(count: number): 'limpa' | 'baixa' | 'alta' | 'critica' {
  if (count <= 0) return 'limpa';
  if (count < 10) return 'baixa';
  if (count < 1000) return 'alta';
  return 'critica';
}

/** Entropia aproximada em bits pelo alfabeto presente. */
export function entropyBits(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  return pool ? Math.round(password.length * Math.log2(pool)) : 0;
}

export type Breach = {
  name: string;
  date: string;
  records: number;
  data: string[];
  domain: string;
  risk: string;
};

/** Normaliza a resposta breach-analytics do XposedOrNot. */
export function parseXonBreaches(json: unknown): Breach[] {
  const list = (json as { ExposedBreaches?: { breaches_details?: Record<string, unknown>[] } })
    ?.ExposedBreaches?.breaches_details;
  if (!Array.isArray(list)) return [];
  return list.map(item => ({
    name: String(item['breach'] ?? ''),
    date: String(item['xposed_date'] ?? ''),
    records: Number(item['xposed_records']) || 0,
    data: String(item['xposed_data'] ?? '').split(';').map(value => value.trim()).filter(Boolean),
    domain: String(item['domain'] ?? ''),
    risk: String(item['password_risk'] ?? ''),
  })).sort((a, b) => b.date.localeCompare(a.date));
}