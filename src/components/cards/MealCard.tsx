import React, { useState } from 'react';
import { Sunrise, Sun, Moon, Leaf, Lightbulb } from 'lucide-react';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'tea_or_snack';

interface MealCardProps {
  type: MealType;
  title: string;
  desc: string;
  tip?: string;
  /** Opções sugeridas pela Ana (mesma ordem de src/data/mealOptions.ts). Cada uma tem foto em public/pratos. */
  options?: string[];
}

const CONFIG = {
  breakfast: { label: 'Café da manhã', time: '07h–08h30', icon: Sunrise, accent: 'text-ochre-600 bg-ochre-50', prefix: 'b' },
  lunch: { label: 'Almoço · pico do Agni', time: '12h–13h30', icon: Sun, accent: 'text-leaf-600 bg-leaf-50', prefix: 'l' },
  dinner: { label: 'Jantar reparador', time: '18h30–20h', icon: Moon, accent: 'text-lunar-600 bg-lunar-50', prefix: 'd' },
  tea_or_snack: { label: 'Chá terapêutico', time: 'Tarde ou noite', icon: Leaf, accent: 'text-leaf-600 bg-leaf-50', prefix: 't' }
} as const;

/** b01…b20, l01…l20, d01…d20 — o mesmo nome dos arquivos de public/pratos. */
const fotoId = (type: MealType, i: number) => `${CONFIG[type].prefix}${String(i + 1).padStart(2, '0')}`;
const fotoSrc = (type: MealType, i: number, mini = false) =>
  `${import.meta.env.BASE_URL}pratos/${mini ? 't/' : ''}${fotoId(type, i)}.webp`;

export const MealCard: React.FC<MealCardProps> = ({ type, title, desc, tip, options }) => {
  const { label, time, icon: Icon, accent } = CONFIG[type];
  const hasOptions = !!options && options.length > 0;

  // -1 = refeição do dia (sem foto); 0..n-1 = opção da Ana (com foto)
  const [pick, setPick] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState<Record<number, boolean>>({});

  const alt = hasOptions && pick >= 0 ? options![pick] : null;
  const showPhoto = alt !== null && !broken[pick];

  const choose = (i: number) => {
    setPick(i);
    setLoaded(false);
  };

  const chip = (
    <span className="flex items-center gap-2 rounded-full bg-canvas-2/95 py-1.5 pl-1.5 pr-3 shadow-sm backdrop-blur">
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${accent}`}>
        <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="text-[11.5px] font-bold uppercase tracking-wide text-ink-2">{label}</span>
      <span className="tnum text-[11px] text-ink-3">{time}</span>
    </span>
  );

  return (
    <article className="card flex flex-col overflow-hidden">
      {showPhoto ? (
        /* Destaque visual: foto do prato escolhido */
        <div className="relative aspect-[4/3] w-full bg-canvas">
          <img
            key={pick}
            src={fotoSrc(type, pick)}
            alt={alt ?? ''}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setBroken((b) => ({ ...b, [pick]: true }))}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />
          <div className="absolute left-3 top-3">{chip}</div>
        </div>
      ) : (
        <header className="flex items-center gap-3 px-5 pt-5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent}`}>
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold uppercase tracking-wide text-ink-3">{label}</p>
            <p className="tnum text-[11.5px] text-ink-3">{time}</p>
          </div>
        </header>
      )}

      <div className="flex flex-col gap-3 p-5">
        <div className="min-w-0">
          {alt && <p className="eyebrow mb-1">Sugestão da Ana</p>}
          <h4 className="text-[15px] font-semibold leading-snug text-ink">{alt ?? title}</h4>
          {!alt && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{desc}</p>}
          {alt && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
              Tempere com as massalas e prefira o Ghee ou o azeite no preparo.
            </p>
          )}
        </div>

        {!alt && tip && (
          <p className="flex items-start gap-2 rounded-field bg-canvas px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-2">
            <Lightbulb className="mt-px h-3.5 w-3.5 shrink-0 text-ochre-600" strokeWidth={2} aria-hidden="true" />
            {tip}
          </p>
        )}

        {hasOptions && (
          <div>
            <p className="eyebrow mb-2">Outras opções · {options!.length}</p>
            <div className="no-scrollbar -mx-5 flex snap-x scroll-px-5 gap-2.5 overflow-x-auto px-5 py-1.5">
              <button
                type="button"
                onClick={() => choose(-1)}
                aria-pressed={pick === -1}
                aria-label="Cardápio do dia"
                className={`tap press flex h-[68px] w-[68px] shrink-0 snap-start flex-col items-center justify-center gap-1 rounded-field text-[10.5px] font-bold uppercase tracking-wide ${accent} ${
                  pick === -1 ? 'ring-2 ring-leaf-600 ring-offset-2 ring-offset-canvas-2' : ''
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                Do dia
              </button>
              {options!.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={pick === i}
                  aria-label={name}
                  className={`press relative h-[68px] w-[68px] shrink-0 snap-start overflow-hidden rounded-field bg-canvas ${
                    pick === i ? 'ring-2 ring-leaf-600 ring-offset-2 ring-offset-canvas-2' : ''
                  }`}
                >
                  {!broken[i] && (
                    <img
                      src={fotoSrc(type, i, true)}
                      alt=""
                      width={240}
                      height={180}
                      loading="lazy"
                      decoding="async"
                      onError={() => setBroken((b) => ({ ...b, [i]: true }))}
                      className="h-full w-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
