import type { MonthEntry } from "./types";

const MESES_PT: Record<string, number> = {
  jan: 1, janeiro: 1,
  fev: 2, fevereiro: 2,
  mar: 3, marco: 3, março: 3,
  abr: 4, abril: 4,
  mai: 5, maio: 5,
  jun: 6, junho: 6,
  jul: 7, julho: 7,
  ago: 8, agosto: 8,
  set: 9, setembro: 9,
  out: 10, outubro: 10,
  nov: 11, novembro: 11,
  dez: 12, dezembro: 12,
};

/** Aceita "2024-03", "03/2024", "3/24", "mar/2024", "março 2024", "2024-03-15", etc. */
export function parseRef(input: string): string | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;

  // YYYY-MM ou YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
  if (iso) {
    const y = Number(iso[1]);
    const m = Number(iso[2]);
    if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, "0")}`;
  }

  // MM/YYYY ou DD/MM/YYYY ou MM/YY
  const slash = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (slash) {
    if (slash[3]) {
      // DD/MM/YYYY
      const m = Number(slash[2]);
      let y = Number(slash[3]);
      if (y < 100) y += 2000;
      if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, "0")}`;
    } else {
      // MM/YYYY ou MM/YY
      const m = Number(slash[1]);
      let y = Number(slash[2]);
      if (y < 100) y += 2000;
      if (m >= 1 && m <= 12) return `${y}-${String(m).padStart(2, "0")}`;
    }
  }

  // mes-pt seguido de ano: "mar/2024", "março 2024", "mar-24"
  const named = s.match(/^([a-zçãéíóú]+)[\s/\-]+(\d{2,4})$/);
  if (named) {
    const key = named[1]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const m = MESES_PT[key];
    let y = Number(named[2]);
    if (y < 100) y += 2000;
    if (m) return `${y}-${String(m).padStart(2, "0")}`;
  }

  return null;
}

/** Aceita "1.234,56" (BR), "1,234.56" (US), "1234.56", "R$ 1.234". */
export function parseNumber(input: string): number | null {
  const raw = input.trim().replace(/^r\$\s*/i, "").replace(/\s/g, "");
  if (!raw) return null;
  let s = raw;
  // Se tem vírgula E ponto, decide pelo último (ele é o decimal).
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      // BR: ponto = milhar, vírgula = decimal
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      // US: vírgula = milhar, ponto = decimal
      s = s.replace(/,/g, "");
    }
  } else if (lastComma >= 0) {
    // só vírgula → decimal BR
    s = s.replace(/\./g, "").replace(",", ".");
  }
  // só ponto ou nenhum: já está em formato JS
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export type BulkRow =
  | { ok: true; line: number; entry: MonthEntry; raw: string }
  | { ok: false; line: number; error: string; raw: string };

/**
 * Parseia conteúdo colado de planilha (TSV/CSV/;).
 * Espera 2 ou 3 colunas: mês, patrimônio, [aportes].
 * Detecta e ignora cabeçalho.
 */
export function parseBulkPaste(text: string): BulkRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  // Detecta separador no primeiro registro: tab > ; > , (vírgula é última pois
  // pode aparecer dentro de números BR).
  const sample = lines[0];
  const sep =
    sample.includes("\t") ? "\t"
    : sample.includes(";") ? ";"
    : ",";

  const split = (l: string) => l.split(sep).map((c) => c.trim());

  // Pula primeira linha se for cabeçalho (mês não parseia + patrim não parseia).
  const first = split(lines[0]);
  const looksHeader =
    first.length >= 2 &&
    parseRef(first[0]) === null &&
    parseNumber(first[1]) === null;
  const startIdx = looksHeader ? 1 : 0;

  const out: BulkRow[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const raw = lines[i];
    const cols = split(raw);
    const lineNum = i + 1;
    if (cols.length < 2) {
      out.push({ ok: false, line: lineNum, error: "Esperado pelo menos 2 colunas (mês e patrimônio)", raw });
      continue;
    }
    const ref = parseRef(cols[0]);
    if (!ref) {
      out.push({ ok: false, line: lineNum, error: `Mês inválido: "${cols[0]}"`, raw });
      continue;
    }
    const patrim = parseNumber(cols[1]);
    if (patrim === null) {
      out.push({ ok: false, line: lineNum, error: `Patrimônio inválido: "${cols[1]}"`, raw });
      continue;
    }
    let aportes = 0;
    if (cols.length >= 3 && cols[2] !== "") {
      const a = parseNumber(cols[2]);
      if (a === null) {
        out.push({ ok: false, line: lineNum, error: `Aporte inválido: "${cols[2]}"`, raw });
        continue;
      }
      aportes = a;
    }
    out.push({ ok: true, line: lineNum, raw, entry: { ref, patrimonio: patrim, aportes } });
  }
  return out;
}