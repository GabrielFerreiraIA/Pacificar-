import React from 'react';
import { Wheat, Milk, Candy, Wine } from 'lucide-react';

interface RestrictionBannerProps {
  compact?: boolean;
}

/** Ícones vetoriais — nunca emoji como elemento estrutural. */
const RESTRICTIONS = [
  { label: 'Glúten', icon: Wheat, why: 'Lesa a barreira intestinal' },
  { label: 'Leite e derivados', icon: Milk, why: 'Promove muco e inflamação' },
  { label: 'Açúcar refinado', icon: Candy, why: 'Picos insulínicos e compulsão' },
  { label: 'Álcool', icon: Wine, why: 'Sobrecarga hepática e sono ruim' }
];

export const RestrictionBanner: React.FC<RestrictionBannerProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <ul className="no-scrollbar flex gap-2 overflow-x-auto py-0.5">
        {RESTRICTIONS.map(({ label, icon: Icon }) => (
          <li key={label}>
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-clay-100 bg-clay-50 px-3 py-1.5 text-[12px] font-semibold text-clay-600">
              <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Sem {label.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="card p-5" aria-labelledby="restricoes-title">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">As quatro eliminações</p>
          <h3 id="restricoes-title" className="mt-1.5 text-[19px] leading-tight">
            O que sai do prato
          </h3>
        </div>
        <span className="tnum shrink-0 text-[12px] font-semibold text-ink-3">21 dias</span>
      </div>

      <ul className="grid grid-cols-2 gap-2">
        {RESTRICTIONS.map(({ label, icon: Icon, why }) => (
          <li
            key={label}
            className="flex flex-col gap-1.5 rounded-field border border-line bg-canvas p-3.5"
          >
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-clay-500" strokeWidth={1.8} aria-hidden="true" />
              <span className="text-[13px] font-semibold leading-tight text-ink">{label}</span>
            </span>
            <span className="text-[12px] leading-snug text-ink-3">{why}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
