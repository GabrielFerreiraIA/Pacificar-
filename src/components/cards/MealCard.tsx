import React, { useState } from 'react';
import { Sunrise, Sun, Moon, Leaf, Lightbulb, Shuffle } from 'lucide-react';

interface MealCardProps {
  type: 'breakfast' | 'lunch' | 'dinner' | 'tea_or_snack';
  title: string;
  desc: string;
  tip?: string;
  /** Outras opções sugeridas pela Ana; o cartão ganha o botão "Ver outra opção". */
  options?: string[];
}

const CONFIG = {
  breakfast: { label: 'Café da manhã', time: '07h–08h30', icon: Sunrise, accent: 'text-ochre-600 bg-ochre-50' },
  lunch: { label: 'Almoço · pico do Agni', time: '12h–13h30', icon: Sun, accent: 'text-leaf-600 bg-leaf-50' },
  dinner: { label: 'Jantar reparador', time: '18h30–20h', icon: Moon, accent: 'text-lunar-600 bg-lunar-50' },
  tea_or_snack: { label: 'Chá terapêutico', time: 'Tarde ou noite', icon: Leaf, accent: 'text-leaf-600 bg-leaf-50' }
} as const;

export const MealCard: React.FC<MealCardProps> = ({ type, title, desc, tip, options }) => {
  const { label, time, icon: Icon, accent } = CONFIG[type];
  // 0 = refeição do dia; 1..n = opções da Ana
  const [pick, setPick] = useState(0);
  const total = (options?.length ?? 0) + 1;
  const alt = pick > 0 && options ? options[pick - 1] : null;

  return (
    <article className="card flex flex-col gap-3 p-5">
      <header className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${accent}`}>
          <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-bold uppercase tracking-wide text-ink-3">
            {label}
          </p>
          <p className="tnum text-[11.5px] text-ink-3">{time}</p>
        </div>
      </header>

      <div className="min-w-0 flex-1">
        <h4 className="text-[15px] font-semibold leading-snug text-ink">{alt ?? title}</h4>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
          {alt ? 'Opção sugerida pela Ana Carla. Tempere com as massalas e use o Ghee ou o azeite.' : desc}
        </p>
      </div>

      {options && options.length > 0 && (
        <button
          type="button"
          onClick={() => setPick((p) => (p + 1) % total)}
          className="tap press flex items-center justify-center gap-2 rounded-full border border-line px-3.5 py-2 text-[12.5px] font-semibold text-leaf-700 hover:bg-leaf-50"
        >
          <Shuffle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          Ver outra opção
          <span className="tnum text-ink-3">{pick + 1}/{total}</span>
        </button>
      )}

      {!alt && tip && (
        <p className="flex items-start gap-2 rounded-field bg-canvas px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-2">
          <Lightbulb
            className="mt-px h-3.5 w-3.5 shrink-0 text-ochre-600"
            strokeWidth={2}
            aria-hidden="true"
          />
          {tip}
        </p>
      )}
    </article>
  );
};
