import React from 'react';
import { BRISTOL_SCALE } from '../../data/anamneseSchema';
import { Check } from 'lucide-react';

/** Ilustrações clínicas em `public/assets/bristol` — uma por tipo. */
const BristolImage: React.FC<{ type: number }> = ({ type }) => (
  <img
    src={`/assets/bristol/bristol-${type}.png`}
    alt=""
    width={400}
    height={400}
    loading="lazy"
    decoding="async"
    /* O PNG tem fundo branco; multiply o dissolve sobre o tom do card selecionado */
    className="h-full w-full object-contain mix-blend-multiply"
  />
);

interface BristolSelectorProps {
  value: number | null;
  onChange: (type: number) => void;
  /** 'grid' para formulários; 'compact' para o check-in noturno. */
  variant?: 'grid' | 'compact';
}

export const BristolSelector: React.FC<BristolSelectorProps> = ({
  value,
  onChange,
  variant = 'grid'
}) => {
  const selected = BRISTOL_SCALE.find(b => b.type === value);

  const toneClasses = {
    leaf: 'border-leaf-500 bg-leaf-50 text-leaf-700',
    ochre: 'border-ochre-300 bg-ochre-50 text-ochre-700',
    clay: 'border-clay-500 bg-clay-50 text-clay-600'
  };

  return (
    <div className="space-y-3">
      <div
        role="radiogroup"
        aria-label="Escala de Bristol"
        className={`grid gap-2 ${variant === 'compact' ? 'grid-cols-4' : 'grid-cols-2 sm:grid-cols-4'}`}
      >
        {BRISTOL_SCALE.map(item => {
          const isSelected = value === item.type;
          return (
            <button
              key={item.type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Tipo ${item.type}: ${item.name}`}
              onClick={() => onChange(item.type)}
              className={`tap press relative flex flex-col items-center gap-1.5 rounded-field border px-2 pb-2.5 pt-3 ${
                isSelected
                  ? toneClasses[item.tone]
                  : 'border-line bg-surface text-ink-3 hover:border-leaf-200 hover:bg-leaf-50/40'
              }`}
            >
              {isSelected && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-current">
                  <Check
                    className="h-2.5 w-2.5 text-surface"
                    strokeWidth={3.5}
                    aria-hidden="true"
                  />
                </span>
              )}
              <span className="block aspect-[4/3] w-full">
                <BristolImage type={item.type} />
              </span>
              <span
                className={`tnum text-[10.5px] font-bold ${isSelected ? '' : 'text-ink-2'}`}
              >
                Tipo {item.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leitura clínica da seleção — o valor real da escala está aqui */}
      <div
        aria-live="polite"
        className={`rounded-field border px-4 py-3 transition-colors ${
          selected ? toneClasses[selected.tone] : 'border-line bg-canvas text-ink-3'
        }`}
      >
        {selected ? (
          <>
            <p className="text-[13.5px] font-bold leading-snug">{selected.name}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed opacity-90">{selected.detail}</p>
            <p className="mt-1.5 text-[12px] font-semibold leading-relaxed">{selected.reading}</p>
          </>
        ) : (
          <p className="text-[12.5px] leading-relaxed">
            Escolha o tipo mais parecido com o seu padrão. A leitura ayurvédica aparece aqui.
          </p>
        )}
      </div>
    </div>
  );
};
