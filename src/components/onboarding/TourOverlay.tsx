import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Logo } from '../ui/Primitives';
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Tour de boas-vindas — o app se apresenta sozinho na primeira vez.

   Cada passo aponta para um elemento marcado com data-tour="<id>".
   Se o alvo não existir na tela, o passo vira um cartão centrado em
   vez de quebrar — o tour nunca trava.
   ═══════════════════════════════════════════════════════════════ */

export interface TourStep {
  /** data-tour do elemento a destacar. Ausente = cartão centrado. */
  target?: string;
  title: string;
  body: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    title: 'Boas-vindas ao Pacificar',
    body: 'Em trinta segundos eu te mostro onde fica cada coisa. Você pode sair a qualquer momento e rever depois pelo menu.'
  },
  {
    target: 'day-hero',
    title: 'Seu dia de hoje',
    body: 'Toda vez que abrir o app, você cai aqui: o tema do dia, a semana em que está e se o check-in da noite já foi feito.'
  },
  {
    target: 'timeline',
    title: 'Os 21 dias',
    body: 'Os dias já vividos ficam marcados. Os que ainda não chegaram aparecem com cadeado — um dia de cada vez, sem ansiedade.'
  },
  {
    target: 'audio',
    title: 'A voz da Ana',
    body: 'Um áudio curto por dia, com a intenção e o foco daquelas 24 horas. Dá para ler a transcrição se preferir.'
  },
  {
    target: 'checkin',
    title: 'Check-in de 60 segundos',
    body: 'À noite, oito perguntas rápidas. É delas que saem os gráficos de evolução dos dias 7, 14 e 21.'
  },
  {
    target: 'nav-preparo',
    title: 'Comece pelo Preparo',
    body: 'Antes do Dia 1, é aqui que você vê o que precisa ter em casa: raspador de língua, zeólita, massalas e as gorduras boas.'
  },
  {
    target: 'nav-nutricao',
    title: 'Nutrição',
    body: 'O que entra e o que sai do prato, as três massalas, o banco de receitas e como ler rótulos sem cair em armadilha.'
  },
  {
    target: 'nav-protocolos',
    title: 'Protocolos',
    body: 'As duas trilhas longas: os 120 dias de zeólita e as cinco luas cheias da desparasitação, com a dose calculada pelo seu peso.'
  },
  {
    target: 'nav-anamnese',
    title: 'Sua anamnese',
    body: 'O questionário que substitui a consulta inicial. Onze blocos curtos, salvos automaticamente — comece quando quiser.'
  },
  {
    title: 'É só isso',
    body: 'Seu próximo passo é a aba Preparo. Para rever esta apresentação a qualquer momento, aperte a tecla ? — ou use o menu no topo.'
  }
];

const PAD = 8;
const GAP = 14;
const CARD_W = 336;

interface TourOverlayProps {
  onFinish: () => void;
}

export const TourOverlay: React.FC<TourOverlayProps> = ({ onFinish }) => {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [cardH, setCardH] = useState(220);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[index];
  const isFirst = index === 0;
  const isLast = index === TOUR_STEPS.length - 1;

  const next = useCallback(
    () => (isLast ? onFinish() : setIndex(i => i + 1)),
    [isLast, onFinish]
  );
  const back = useCallback(() => setIndex(i => Math.max(0, i - 1)), []);

  /* Mede o alvo e acompanha scroll/resize para o recorte não desalinhar. */
  useLayoutEffect(() => {
    if (!step.target) {
      setRect(null);
      return;
    }

    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Posiciona o alvo no terço superior — centralizar deixaria o cartão
    // sem espaço nem acima nem abaixo em telas baixas.
    const box = el.getBoundingClientRect();
    const target = window.scrollY + box.top - window.innerHeight * 0.22;
    window.scrollTo({ top: Math.max(0, target), behavior: reduced ? 'auto' : 'smooth' });

    const measure = () => setRect(el.getBoundingClientRect());
    measure();
    const settle = window.setTimeout(measure, 420);

    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [index, step.target]);

  /* A altura real do cartão define se ele cabe acima ou abaixo do alvo. */
  useLayoutEffect(() => {
    const h = cardRef.current?.offsetHeight;
    if (h && Math.abs(h - cardH) > 1) setCardH(h);
  });

  /* Teclado: Esc sai, setas navegam. O foco vai para o cartão a cada passo. */
  useEffect(() => {
    cardRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFinish();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') back();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, next, back, onFinish]);

  /* Trava o scroll do corpo enquanto o tour está aberto. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  /* Área realmente destacada — a altura é limitada para o cartão sempre caber. */
  const hole = (() => {
    if (!rect) return null;
    const maxH = window.innerHeight - cardH - GAP * 3 - PAD * 2 - 24;
    return {
      left: rect.left - PAD,
      top: rect.top - PAD,
      width: rect.width + PAD * 2,
      height: Math.min(rect.height + PAD * 2, Math.max(72, maxH))
    };
  })();

  /* Posição do cartão: abaixo do alvo, ou acima quando não cabe. */
  const cardStyle: React.CSSProperties = (() => {
    if (!rect || !hole) {
      return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(CARD_W, vw - 32);

    const below = hole.top + hole.height + GAP;
    const above = hole.top - GAP - cardH;

    let top: number;
    if (below + cardH < vh - 16) {
      top = below;
    } else if (above > 16) {
      top = above;
    } else {
      // Destaque alto demais para o cartão caber fora dele: encosta o cartão
      // na borda oposta ao centro do alvo, deixando à vista a maior parte.
      const targetCenter = hole.top + hole.height / 2;
      top = targetCenter < vh / 2 ? vh - cardH - 16 : 16;
    }

    const left = Math.min(Math.max(16, rect.left + rect.width / 2 - width / 2), vw - width - 16);

    return { left, top, width };
  })();

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
    >
      {/* Véu com recorte no alvo */}
      <svg className="pointer-events-auto absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            {hole && (
              <rect
                x={hole.left}
                y={hole.top}
                width={hole.width}
                height={hole.height}
                rx={18}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgb(25 54 41 / 0.66)"
          mask="url(#tour-mask)"
          style={{ transition: 'opacity 200ms' }}
        />
        {hole && (
          <rect
            x={hole.left}
            y={hole.top}
            width={hole.width}
            height={hole.height}
            rx={18}
            fill="none"
            stroke="var(--color-ochre-300)"
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Cartão explicativo */}
      <div
        ref={cardRef}
        tabIndex={-1}
        style={cardStyle}
        className="absolute w-[min(336px,calc(100vw-2rem))] rounded-card border border-line bg-surface p-5 shadow-leaf-lg outline-none [@media(max-height:640px)]:p-4"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {isFirst && <Logo className="h-8 w-8 shrink-0" />}
            <p className="eyebrow">
              {isFirst || isLast ? 'Apresentação' : `Passo ${index} de ${TOUR_STEPS.length - 2}`}
            </p>
          </div>
          <button
            onClick={onFinish}
            aria-label="Sair da apresentação"
            className="tap press -mr-2 -mt-2 flex items-center justify-center rounded-full text-ink-3 hover:bg-canvas hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <h3 id="tour-title" className="text-[19px] leading-snug [@media(max-height:640px)]:text-[17px]">
          {step.title}
        </h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2 [@media(max-height:640px)]:mt-1.5 [@media(max-height:640px)]:text-[12.5px]">
          {step.body}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 [@media(max-height:640px)]:mt-3.5">
          {/* Pontos de progresso */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === index ? 'w-4 bg-leaf-600' : 'w-1.5 bg-line'
                }`}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {!isFirst && (
              <button
                onClick={back}
                aria-label="Passo anterior"
                className="tap press flex items-center justify-center rounded-full border border-line bg-surface px-3 text-ink-2 hover:border-leaf-300"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
            )}
            <button
              onClick={next}
              className="tap press inline-flex items-center gap-1.5 rounded-full bg-leaf-600 px-4 text-[13.5px] font-semibold text-white hover:bg-leaf-700"
            >
              {isLast ? 'Concluir' : 'Avançar'}
              {isLast ? (
                <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              ) : (
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {!isLast && (
          <button
            onClick={onFinish}
            className="mt-3 w-full rounded-full py-1 text-[12.5px] font-semibold text-ink-3 hover:text-ink-2"
          >
            Pular apresentação
          </button>
        )}
      </div>
    </div>
  );
};
