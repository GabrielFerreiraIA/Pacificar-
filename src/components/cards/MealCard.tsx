import React, { useState } from 'react';
import { Sunrise, Sun, Moon, Leaf, Lightbulb, BookOpen } from 'lucide-react';
import { idReceitaDoDia } from '../../data/receitasPratos';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'tea_or_snack';

interface MealCardProps {
  type: MealType;
  /** Texto próprio do cartão (usado no chá terapêutico, que não tem foto nem receita). */
  title: string;
  desc: string;
  tip?: string;
  /** Pratos sugeridos pela Ana para esta refeição (mesma ordem de src/data/mealOptions.ts). */
  options?: string[];
  /** Dia da jornada: define o prato do dia. Cada dia mostra só a refeição dele. */
  dayNumber?: number;
  /** Abre a receita do prato do dia (id = nome do arquivo da foto, ex.: 'l06'). */
  onOpenRecipe?: (recipeId: string) => void;
}

const CONFIG = {
  breakfast: { label: 'Café da manhã', time: '07h–08h30', icon: Sunrise, accent: 'text-ochre-600 bg-ochre-50' },
  lunch: { label: 'Almoço · pico do Agni', time: '12h–13h30', icon: Sun, accent: 'text-leaf-600 bg-leaf-50' },
  dinner: { label: 'Jantar reparador', time: '18h30–20h', icon: Moon, accent: 'text-lunar-600 bg-lunar-50' },
  tea_or_snack: { label: 'Chá terapêutico', time: 'Tarde ou noite', icon: Leaf, accent: 'text-leaf-600 bg-leaf-50' }
} as const;

export const MealCard: React.FC<MealCardProps> = ({ type, title, desc, tip, options, dayNumber = 1, onOpenRecipe }) => {
  const { label, time, icon: Icon, accent } = CONFIG[type];
  const hasDish = !!options && options.length > 0 && type !== 'tea_or_snack';

  // O prato do dia é sempre uma opção da Ana (todas têm foto e receita) e muda a cada dia da jornada.
  const dishIdx = hasDish ? (((dayNumber - 1) % options!.length) + options!.length) % options!.length : -1;
  const dish = hasDish ? options![dishIdx] : null;
  const recipeId = hasDish ? idReceitaDoDia(type as 'breakfast' | 'lunch' | 'dinner', dayNumber) : null;
  const fotoSrc = recipeId ? `${import.meta.env.BASE_URL}pratos/${recipeId}.webp` : null;

  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);
  const showPhoto = !!fotoSrc && !broken;

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
        /* Destaque visual: foto do prato do dia */
        <div className="relative aspect-[4/3] w-full bg-canvas">
          <img
            src={fotoSrc!}
            alt={dish ?? ''}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setBroken(true)}
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
          {hasDish && <p className="eyebrow mb-1">Prato do Dia {dayNumber}</p>}
          <h4 className="text-[15px] font-semibold leading-snug text-ink">{dish ?? title}</h4>
          {!hasDish && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{desc}</p>}
        </div>

        {!hasDish && tip && (
          <p className="flex items-start gap-2 rounded-field bg-canvas px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-2">
            <Lightbulb className="mt-px h-3.5 w-3.5 shrink-0 text-ochre-600" strokeWidth={2} aria-hidden="true" />
            {tip}
          </p>
        )}

        {recipeId && onOpenRecipe && (
          <button
            type="button"
            onClick={() => onOpenRecipe(recipeId)}
            className="tap press flex items-center justify-center gap-2 rounded-full border border-leaf-200 bg-leaf-50 px-4 py-2.5 text-[13px] font-semibold text-leaf-700 hover:border-leaf-300"
          >
            <BookOpen className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            Ver receita
          </button>
        )}
      </div>
    </article>
  );
};
