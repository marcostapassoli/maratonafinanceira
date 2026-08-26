/**
 * IPCA oficial — Banco Central do Brasil (SGS série 433: IPCA mensal IBGE).
 * Fonte: https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados
 * O BCB republica os dados oficiais publicados pelo IBGE.
 */

const SGS_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados";
const CACHE_KEY = "maratona-financeira/ipca-anual/v1";

type CachePayload = { fetchedAt: string; anos: Record<number, number> };

function loadCache(): CachePayload {
  if (typeof window === "undefined") return { fetchedAt: "", anos: {} };
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { fetchedAt: "", anos: {} };
    return JSON.parse(raw) as CachePayload;
  } catch {
    return { fetchedAt: "", anos: {} };
  }
}

function saveCache(p: CachePayload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(p));
  } catch {
    /* noop */
  }
}

/** Busca o IPCA acumulado de um ano civil específico (ex: 2024). null se ainda não publicado. */
export async function fetchIpcaAnual(ano: number): Promise<number | null> {
  const cache = loadCache();
  const cachedToday = cache.fetchedAt.slice(0, 10) === new Date().toISOString().slice(0, 10);
  if (cachedToday && cache.anos[ano] !== undefined) return cache.anos[ano];

  const url = `${SGS_URL}?formato=json&dataInicial=01/01/${ano}&dataFinal=31/12/${ano}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return cache.anos[ano] ?? null;
    const rows = (await res.json()) as { data: string; valor: string }[];
    if (!Array.isArray(rows) || rows.length < 12) {
      // Ano ainda incompleto (IPCA de dez só é publicado em jan do ano seguinte).
      return cache.anos[ano] ?? null;
    }
    // Acumulado anual = produto de (1 + ipca_mensal/100) - 1
    const acc = rows.reduce((p, r) => p * (1 + Number(r.valor) / 100), 1) - 1;
    const anos = { ...cache.anos, [ano]: acc };
    saveCache({ fetchedAt: new Date().toISOString(), anos });
    return acc;
  } catch {
    return cache.anos[ano] ?? null;
  }
}

/**
 * Aplica reajustes anuais retroativos pelo IPCA. Para cada ano civil já encerrado
 * (e ainda não aplicado), multiplica a renda pelo (1 + IPCA do ano).
 * Retorna nova renda + último ano aplicado, ou null se nada a aplicar.
 */
export async function aplicarReajustesIpca(
  rendaAtual: number,
  ultimoAjusteAno: number | null | undefined,
  dataInicio: string,
): Promise<{ renda: number; ano: number } | null> {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  // IPCA de um ano X só é publicado em janeiro de X+1 (em torno do dia 10).
  // Considera disponível apenas anos cujo dezembro já foi publicado.
  const ultimoAnoDisponivel = anoAtual - 1;
  const inicioAno = new Date(dataInicio).getFullYear();
  // Ponto de partida: ano após o último aplicado, ou ano de início do plano.
  const desde = (ultimoAjusteAno ?? inicioAno - 1) + 1;
  if (desde > ultimoAnoDisponivel) return null;

  let renda = rendaAtual;
  let aplicadoAte = ultimoAjusteAno ?? inicioAno - 1;
  for (let ano = desde; ano <= ultimoAnoDisponivel; ano++) {
    const ipca = await fetchIpcaAnual(ano);
    if (ipca === null) break; // ainda não publicado; tenta de novo amanhã.
    renda = renda * (1 + ipca);
    aplicadoAte = ano;
  }
  if (aplicadoAte === (ultimoAjusteAno ?? inicioAno - 1)) return null;
  return { renda: Math.round(renda), ano: aplicadoAte };
}
