/* ═══════════════════════════════════════════════════════════════
   Luas cheias calculadas (T-55), sem tabela fixa que expira.
   Algoritmo de Jean Meeus, "Astronomical Algorithms" (2ª ed.), cap. 49:
   erro típico de poucos minutos. Validado contra a tabela do U.S. Naval
   Observatory em src/lib/lunar.test.ts.
   As datas são do fuso de São Paulo (onde a Ana atende).
   ═══════════════════════════════════════════════════════════════ */
import type { ParasiteCycle } from '../types';

const TZ = 'America/Sao_Paulo';
const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;
/** ΔT (TT − UT) em dias. ~69 s nesta década; o efeito na data é desprezível. */
const DELTA_T_DAYS = 69 / 86_400;

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const sin = (deg: number) => Math.sin(deg * RAD);

/** Instante (UTC) da lua cheia de índice k (k = inteiro + 0,5; k = 0,5 ≈ jan/2000). */
function fullMoonAt(k: number): Date {
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, T4 = T3 * T;

  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.00000015 * T3 + 0.00000000073 * T4;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4;
  const Om = 124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3;

  jde +=
    -0.40614 * sin(Mp) +
    0.17302 * E * sin(M) +
    0.01614 * sin(2 * Mp) +
    0.01043 * sin(2 * F) +
    0.00734 * E * sin(Mp - M) -
    0.00515 * E * sin(Mp + M) +
    0.00209 * E * E * sin(2 * M) -
    0.00111 * sin(Mp - 2 * F) -
    0.00057 * sin(Mp + 2 * F) +
    0.00056 * E * sin(2 * Mp + M) -
    0.00042 * sin(3 * Mp) +
    0.00042 * E * sin(M + 2 * F) +
    0.00038 * E * sin(M - 2 * F) -
    0.00024 * E * sin(2 * Mp - M) -
    0.00017 * sin(Om) -
    0.00007 * sin(Mp + 2 * M) +
    0.00004 * sin(2 * Mp - 2 * F) +
    0.00004 * sin(3 * M) +
    0.00003 * sin(Mp + M - 2 * F) +
    0.00003 * sin(2 * Mp + 2 * F) -
    0.00003 * sin(Mp + M + 2 * F) +
    0.00003 * sin(Mp - M + 2 * F) -
    0.00002 * sin(Mp - M - 2 * F) -
    0.00002 * sin(3 * Mp + M) +
    0.00002 * sin(4 * Mp);

  // Correções planetárias
  const A = [
    [299.77 + 0.107408 * k - 0.009173 * T2, 325],
    [251.88 + 0.016321 * k, 165],
    [251.83 + 26.651886 * k, 164],
    [349.42 + 36.412478 * k, 126],
    [84.66 + 18.206239 * k, 110],
    [141.74 + 53.303771 * k, 62],
    [207.14 + 2.453732 * k, 60],
    [154.84 + 7.30686 * k, 56],
    [34.52 + 27.261239 * k, 47],
    [207.19 + 0.121824 * k, 42],
    [291.34 + 1.844379 * k, 40],
    [161.72 + 24.198154 * k, 37],
    [239.56 + 25.513099 * k, 35],
    [331.55 + 3.592518 * k, 23]
  ];
  for (const [ang, coef] of A) jde += coef * 1e-6 * sin(ang);

  const jdUT = jde - DELTA_T_DAYS;
  return new Date((jdUT - 2440587.5) * DAY_MS);
}

const fmtData = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit'
});

/** Data (AAAA-MM-DD) no fuso de São Paulo. */
export function dataSaoPaulo(d: Date): string {
  return fmtData.format(d);
}

export interface FullMoon {
  /** Instante exato, em UTC */
  at: Date;
  /** Data local em São Paulo, AAAA-MM-DD */
  date: string;
}

/** As próximas `count` luas cheias cuja data local é >= `fromDate` (AAAA-MM-DD). */
export function fullMoonsFrom(fromDate: string, count: number): FullMoon[] {
  const [y, m, d] = fromDate.split('-').map(Number);
  const anoFrac = y + (m - 1) / 12 + (d - 1) / 365.25;
  let k = Math.floor((anoFrac - 2000) * 12.3685) - 2 + 0.5;

  const out: FullMoon[] = [];
  while (out.length < count) {
    const at = fullMoonAt(k);
    const date = dataSaoPaulo(at);
    if (date >= fromDate) out.push({ at, date });
    k += 1;
  }
  return out;
}

/** Soma dias a uma data AAAA-MM-DD (aritmética de calendário, sem fuso). */
export function addDias(iso: string, dias: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + dias)).toISOString().slice(0, 10);
}

/**
 * Os 5 ciclos de desparasitação a partir de `startDate` (AAAA-MM-DD).
 * Regra do protocolo: pode começar até o 3º dia da lua cheia, então uma lua
 * cheia cuja janela de 3 dias ainda não terminou em `startDate` ainda vale.
 */
export function buildParasiteCycles(startDate: string, userId: string): ParasiteCycle[] {
  const luas = fullMoonsFrom(addDias(startDate, -2), 5);
  return luas.map((lua, i) => {
    const n = i + 1;
    const mes = MESES[Number(lua.date.slice(5, 7)) - 1];
    return {
      id: `cycle_${n}`,
      user_id: userId,
      cycle_number: n,
      moon_name: `Ciclo ${String(n).padStart(2, '0')}: Lua Cheia de ${mes}`,
      moon_date: lua.date,
      day1_completed: false,
      day2_completed: false,
      day3_completed: false,
      charcoal_taken: false,
      h2o2_taken: false,
      completed: false
    };
  });
}
