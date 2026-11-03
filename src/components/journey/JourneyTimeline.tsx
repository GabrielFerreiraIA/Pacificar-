import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Linha do tempo dos 21 dias.
   - Agrupada por semana (Semana 1, 2 e 3), com divisor entre elas.
   - Rolagem lateral com snap; o dia selecionado é centralizado sozinho.
   - Sombras nas bordas só aparecem quando há mais dias daquele lado; em telas
     com mouse também há setas e dá para arrastar.
   - Teclado: ← → Home End trocam de dia (só entre os liberados).
   - Respeita prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════ */

interface Props {
  totalDays: number;
  selectedDay: number;
  /** Último dia liberado (hoje). Os seguintes ficam com cadeado. */
  unlockedUntil: number;
  /** Dias com check-in feito. */
  loggedDays: Set<number>;
  milestones?: number[];
  onSelect: (day: number) => void;
}

const WEEK_SIZE = 7;

export const JourneyTimeline: React.FC<Props> = ({
  totalDays,
  selectedDay,
  unlockedUntil,
  loggedDays,
  milestones = [7, 14, 21],
  onSelect
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });
  const firstCenter = useRef(true);
  // barra de rolagem própria: largura e posição do "polegar" em %
  const [thumb, setThumb] = useState({ w: 100, x: 0 });
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbDrag = useRef<{ startX: number; startLeft: number } | null>(null);
  // tremidinha: some depois que a pessoa mexe na faixa
  const [nudge, setNudge] = useState<'left' | 'right' | null>(null);
  const interacted = useRef(false);
  const edges = useRef({ left: false, right: false });
  const markInteracted = () => {
    interacted.current = true;
    setNudge(null);
  };

  const reduceMotion = () =>
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    edges.current = { left, right };
    setCanLeft(left);
    setCanRight(right);
    const ratio = el.clientWidth / el.scrollWidth;
    setThumb({ w: Math.min(100, ratio * 100), x: (el.scrollLeft / el.scrollWidth) * 100 });
  }, []);

  // Centraliza o dia selecionado (sem animação na primeira vez e com movimento reduzido)
  useEffect(() => {
    const el = scrollerRef.current;
    const chip = el?.querySelector<HTMLElement>(`[data-day="${selectedDay}"]`);
    if (!el || !chip) return;
    const left = chip.offsetLeft - (el.clientWidth - chip.offsetWidth) / 2;
    el.scrollTo({
      left: Math.max(0, left),
      behavior: firstCenter.current || reduceMotion() ? 'auto' : 'smooth'
    });
    firstCenter.current = false;
  }, [selectedDay]);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges]);

  // De vez em quando os dias "tremem" para o lado onde há mais conteúdo (até 4 vezes, nunca com movimento reduzido)
  useEffect(() => {
    if (reduceMotion()) return;
    let vezes = 0;
    let fim: number | undefined;
    const tremer = () => {
      if (interacted.current || document.hidden) return;
      const { left, right } = edges.current;
      if (!left && !right) return;
      vezes++;
      setNudge(right ? 'left' : 'right');
      fim = window.setTimeout(() => setNudge(null), 1150);
    };
    const primeiro = window.setTimeout(tremer, 1600);
    const ciclo = window.setInterval(() => {
      if (vezes >= 4 || interacted.current) return window.clearInterval(ciclo);
      tremer();
    }, 7000);
    return () => {
      window.clearTimeout(primeiro);
      window.clearTimeout(fim);
      window.clearInterval(ciclo);
    };
  }, []);

  // Arrastar o polegar da barra de rolagem (mouse e toque) ou tocar no trilho para pular
  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    markInteracted();
    const r = track.getBoundingClientRect();
    const onThumb = (e.target as HTMLElement).dataset.thumb === '1';
    if (!onThumb) {
      // centraliza o polegar onde tocou
      const frac = (e.clientX - r.left) / r.width;
      el.scrollTo({ left: frac * el.scrollWidth - el.clientWidth / 2, behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
    thumbDrag.current = { startX: e.clientX, startLeft: onThumb ? el.scrollLeft : frac0(e, r, el) };
    track.setPointerCapture(e.pointerId);
  };
  const frac0 = (e: React.PointerEvent, r: DOMRect, el: HTMLDivElement) =>
    ((e.clientX - r.left) / r.width) * el.scrollWidth - el.clientWidth / 2;
  const onTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const track = trackRef.current;
    const d = thumbDrag.current;
    if (!el || !track || !d) return;
    const escala = el.scrollWidth / track.getBoundingClientRect().width;
    el.scrollTo({ left: d.startLeft + (e.clientX - d.startX) * escala, behavior: 'auto' });
  };
  const onTrackPointerUp = () => (thumbDrag.current = null);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: reduceMotion() ? 'auto' : 'smooth' });
  };

  // Teclado: roving tabindex entre os dias liberados
  const move = (to: number) => {
    const d = Math.min(Math.max(to, 1), unlockedUntil);
    if (d === selectedDay) return;
    onSelect(d);
    requestAnimationFrame(() =>
      scrollerRef.current?.querySelector<HTMLElement>(`[data-day="${d}"]`)?.focus({ preventScroll: true })
    );
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') move(selectedDay + 1);
    else if (e.key === 'ArrowLeft') move(selectedDay - 1);
    else if (e.key === 'Home') move(1);
    else if (e.key === 'End') move(unlockedUntil);
    else return;
    e.preventDefault();
  };

  // Arrastar com o mouse (toque já rola sozinho)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !scrollerRef.current) return;
    drag.current = { down: true, moved: false, startX: e.clientX, startLeft: scrollerRef.current.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.down || !scrollerRef.current) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      // só depois do limiar: um clique simples continua chegando no cartão
      scrollerRef.current.setPointerCapture(e.pointerId);
    }
    if (d.moved) scrollerRef.current.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    // o clique logo depois de arrastar não deve trocar de dia
    window.setTimeout(() => (drag.current.moved = false), 0);
  };

  // Esmaece o próprio conteúdo nas bordas com mais dias (sem caixa de cor sobre o fundo)
  const fade = '2.75rem';
  const mask = `linear-gradient(to right, ${canLeft ? 'transparent' : '#000'} 0, #000 ${fade}, #000 calc(100% - ${fade}), ${
    canRight ? 'transparent' : '#000'
  } 100%)`;

  const weeks = Array.from({ length: Math.ceil(totalDays / WEEK_SIZE) }, (_, w) =>
    Array.from({ length: WEEK_SIZE }, (_, i) => w * WEEK_SIZE + i + 1).filter(d => d <= totalDays)
  );

  return (
    <div className="relative -mx-5">
      <div
        ref={scrollerRef}
        role="tablist"
        aria-label="Selecionar dia da jornada"
        onScroll={updateEdges}
        onKeyDown={e => {
          markInteracted();
          onKeyDown(e);
        }}
        onWheel={markInteracted}
        onTouchStart={markInteracted}
        onPointerDown={e => {
          markInteracted();
          onPointerDown(e);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={e => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`no-scrollbar flex select-none overflow-x-auto overscroll-x-contain px-5 pb-2 pt-1 ${
          dragging ? 'cursor-grabbing' : 'snap-x snap-proximity scroll-smooth sm:cursor-grab'
        }`}
        style={{ scrollPaddingInline: '1.25rem', maskImage: mask, WebkitMaskImage: mask }}
      >
        <div role="presentation" className={`flex ${nudge === 'left' ? 'nudge-left' : nudge === 'right' ? 'nudge-right' : ''}`}>
        {weeks.map((days, w) => (
          <div
            key={w}
            role="presentation"
            className={`shrink-0 ${w > 0 ? 'ml-4 border-l border-line pl-4' : ''}`}
          >
            <p className="eyebrow sticky left-11 mb-2 w-max text-[10.5px]">Semana {w + 1}</p>
            <div className="flex gap-1.5">
              {days.map(n => {
                const active = selectedDay === n;
                const logged = loggedDays.has(n);
                const locked = n > unlockedUntil;
                const today = n === unlockedUntil;
                const milestone = milestones.includes(n);

                return (
                  <button
                    key={n}
                    type="button"
                    role="tab"
                    data-day={n}
                    aria-selected={active}
                    tabIndex={active ? 0 : -1}
                    disabled={locked}
                    aria-label={
                      locked
                        ? `Dia ${n}, ainda bloqueado`
                        : `Dia ${n}${today ? ', hoje' : ''}${logged ? ', check-in feito' : ''}${
                            milestone ? ', dia do relatório' : ''
                          }`
                    }
                    onClick={() => onSelect(n)}
                    className={`press relative flex h-[72px] w-[52px] shrink-0 snap-center flex-col items-center justify-center gap-1 rounded-field border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 ${
                      locked
                        ? 'cursor-not-allowed border-dashed border-line bg-transparent text-ink-3/60'
                        : active
                          ? 'border-leaf-600 bg-leaf-600 text-white shadow-leaf'
                          : logged
                            ? 'border-leaf-200 bg-leaf-50 text-leaf-700 hover:border-leaf-300'
                            : today
                              ? 'border-ochre-300 bg-ochre-50 text-ochre-700 ring-1 ring-ochre-200'
                              : 'border-line bg-surface text-ink-2 hover:border-leaf-200'
                    }`}
                  >
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider ${
                        active ? 'text-leaf-100' : today && !logged ? 'text-ochre-600' : 'text-ink-3'
                      }`}
                    >
                      {today ? 'Hoje' : 'Dia'}
                    </span>
                    <span className="tnum font-display text-[22px] font-semibold leading-none">{n}</span>
                    {locked ? (
                      <Lock className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
                    ) : logged ? (
                      <Check
                        className={`h-3.5 w-3.5 ${active ? 'text-leaf-100' : 'text-leaf-500'}`}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          active ? 'bg-white/70' : today ? 'bg-ochre-400' : 'bg-line'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {milestone && (
                      <span
                        className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 ${
                          active ? 'border-leaf-600 bg-ochre-200' : 'border-canvas bg-ochre-400'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        </div>
        {/* respiro final para o último dia poder centralizar */}
        <span className="w-2 shrink-0" aria-hidden="true" />
      </div>

      {/* Barra de rolagem visível: mostra onde você está nos 21 dias e dá para arrastar */}
      {thumb.w < 99.5 && (
        <div
          ref={trackRef}
          aria-hidden="true"
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={onTrackPointerUp}
          onPointerCancel={onTrackPointerUp}
          className="mx-5 mt-1 cursor-pointer touch-none py-2"
        >
          <div className="relative h-1.5 rounded-full bg-line-soft">
            <div
              data-thumb="1"
              className="absolute inset-y-0 rounded-full bg-leaf-400 transition-colors hover:bg-leaf-500 active:bg-leaf-600"
              style={{ width: `${thumb.w}%`, left: `${thumb.x}%` }}
            />
          </div>
        </div>
      )}

      {/* Setas para quem usa mouse (no celular basta deslizar) */}
      {canLeft && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Ver dias anteriores"
          className="press absolute left-2 top-[46px] hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-leaf-sm hover:text-leaf-700 sm:flex"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
      {canRight && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Ver próximos dias"
          className="press absolute right-2 top-[46px] hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-leaf-sm hover:text-leaf-700 sm:flex"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
