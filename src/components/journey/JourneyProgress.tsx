import React, { useEffect, useState } from 'react';
import { CalendarCheck, Flag, Flame, Hourglass } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Cabeçalho de progresso da jornada (Home).
   - Dia atual em destaque + anel com o percentual de check-ins.
   - Barra segmentada: um segmento por dia, agrupada em 3 semanas, com o
     estado de cada dia (feito, hoje, sem registro, ainda bloqueado) e o
     marco do relatório no fim de cada semana.
   - Três números: check-ins, sequência atual e dias até o fim.
   ═══════════════════════════════════════════════════════════════ */

interface Props {
  totalDays: number;
  /** Último dia liberado (hoje). */
  today: number;
  selectedDay: number;
  loggedDays: Set<number>;
  milestones?: number[];
}

const WEEK = 7;

/** Dias seguidos com check-in, contando de hoje (ou de ontem, se hoje ainda está pendente) para trás. */
const sequenciaAtual = (today: number, logged: Set<number>) => {
  let d = logged.has(today) ? today : today - 1;
  let n = 0;
  while (d >= 1 && logged.has(d)) {
    n++;
    d--;
  }
  return n;
};

const Ring: React.FC<{ value: number }> = ({ value }) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  // começa vazio e enche na entrada (o CSS de movimento reduzido zera a transição)
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(t);
  }, [value]);

  return (
    <div className="relative h-[68px] w-[68px] shrink-0" aria-hidden="true">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-leaf-100" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className="stroke-leaf-600 transition-[stroke-dashoffset] duration-1000 ease-out"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
        />
      </svg>
      <span className="tnum absolute inset-0 flex items-center justify-center text-[15px] font-bold text-leaf-800">
        {Math.round(value)}%
      </span>
    </div>
  );
};

export const JourneyProgress: React.FC<Props> = ({
  totalDays,
  today,
  selectedDay,
  loggedDays,
  milestones = [7, 14, 21]
}) => {
  const feitos = [...loggedDays].filter(d => d <= totalDays).length;
  const pct = (feitos / totalDays) * 100;
  const seq = sequenciaAtual(today, loggedDays);
  const faltam = Math.max(0, totalDays - today);
  const semanas = Array.from({ length: Math.ceil(totalDays / WEEK) }, (_, w) =>
    Array.from({ length: WEEK }, (_, i) => w * WEEK + i + 1).filter(d => d <= totalDays)
  );

  const resumo = `${feitos} de ${totalDays} dias registrados. Hoje é o dia ${today}.${
    seq > 1 ? ` Sequência de ${seq} dias seguidos.` : ''
  }`;

  return (
    <div className="space-y-5">
      {/* Dia atual + anel */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Sua jornada</p>
          <p className="mt-1.5 flex items-baseline gap-1.5 font-display text-ink">
            <span className="text-[17px] text-ink-2">Dia</span>
            <span className="tnum text-[40px] leading-none">{today}</span>
            <span className="tnum text-[17px] text-ink-3">de {totalDays}</span>
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-2">
            {faltam === 0
              ? 'Último dia. Você chegou até aqui!'
              : faltam === 1
                ? 'Falta 1 dia para concluir. Quase lá!'
                : `Faltam ${faltam} dias para concluir.`}
          </p>
        </div>
        <Ring value={pct} />
      </div>

      {/* Barra segmentada por semana */}
      <div role="img" aria-label={resumo}>
        <div className="flex gap-2.5">
          {semanas.map((dias, w) => (
            <div key={w} className="min-w-0 flex-1">
              <div className="flex gap-[3px]">
                {dias.map(d => {
                  const feito = loggedDays.has(d);
                  const ehHoje = d === today;
                  const futuro = d > today;
                  const sel = d === selectedDay;
                  return (
                    <span key={d} className="relative flex-1">
                      <span
                        className={`block h-2.5 rounded-full transition-colors duration-300 ${
                          feito
                            ? 'bg-leaf-500'
                            : ehHoje
                              ? 'today-pulse bg-ochre-400'
                              : futuro
                                ? 'bg-line-soft'
                                : 'bg-ochre-100'
                        }`}
                      />
                      {/* indica o dia aberto na faixa abaixo */}
                      {sel && (
                        <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-ink-2" />
                      )}
                    </span>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center justify-between gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">
                <span className="truncate">Semana {w + 1}</span>
                {milestones.includes(dias[dias.length - 1]) && (
                  <span
                    className={`flex shrink-0 items-center gap-0.5 ${
                      dias[dias.length - 1] <= today ? 'text-ochre-600' : 'text-ink-3/70'
                    }`}
                    title={`Relatório do dia ${dias[dias.length - 1]}`}
                  >
                    <Flag className="h-3 w-3" strokeWidth={2.2} aria-hidden="true" />
                    {dias[dias.length - 1]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Números da jornada */}
      <dl className="grid grid-cols-3 divide-x divide-line-soft rounded-field bg-canvas py-3">
        {[
          { icon: CalendarCheck, valor: feitos, rotulo: 'check-ins', cor: 'text-leaf-600' },
          { icon: Flame, valor: seq, rotulo: seq === 1 ? 'dia seguido' : 'dias seguidos', cor: 'text-ochre-600' },
          { icon: Hourglass, valor: faltam, rotulo: faltam === 1 ? 'dia restante' : 'dias restantes', cor: 'text-lunar-600' }
        ].map(({ icon: Icon, valor, rotulo, cor }) => (
          <div key={rotulo} className="flex flex-col items-center gap-1 px-2 text-center">
            <dt className="sr-only">{rotulo}</dt>
            <dd className="flex items-center gap-1.5">
              <Icon className={`h-4 w-4 ${cor}`} strokeWidth={2} aria-hidden="true" />
              <span className="tnum font-display text-[22px] leading-none text-ink">{valor}</span>
            </dd>
            <dd className="text-[11.5px] leading-tight text-ink-3" aria-hidden="true">
              {rotulo}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
