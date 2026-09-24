import React from 'react';
import { Clock, Sprout } from 'lucide-react';

interface SelfCareCardProps {
  title: string;
  description: string;
  benefits: string;
  duration: string;
}

export const SelfCareCard: React.FC<SelfCareCardProps> = ({
  title,
  description,
  benefits,
  duration
}) => (
  <article className="card overflow-hidden">
    {/* Faixa de folhas: elemento natural discreto, puramente decorativo */}
    <div className="h-1 w-full bg-gradient-to-r from-leaf-200 via-leaf-400 to-ochre-300" aria-hidden="true" />

    <div className="space-y-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <Sprout className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <p className="eyebrow">Ritual ayurvédico</p>
        </div>
        <span className="tnum inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-[11.5px] font-semibold text-ink-2">
          <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          {duration}
        </span>
      </header>

      <div>
        <h4 className="font-display text-[19px] leading-snug text-ink">{title}</h4>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{description}</p>
      </div>

      <p className="rounded-field bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
        <strong className="font-semibold text-ink">Por que funciona · </strong>
        {benefits}
      </p>
    </div>
  </article>
);
