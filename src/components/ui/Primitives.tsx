import React from 'react';

/* ═══════════════════════════════════════════════════════════════
   Primitivos compartilhados do PACIFICAR.
   Um único vocabulário visual para toda a aplicação.
   ═══════════════════════════════════════════════════════════════ */

/** Marca — folha ayurvédica com sol nascente. */
export const Logo: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <img src="/logo.png" alt="PACIFICAR" className={className} width={256} height={256} decoding="async" />
);

/** Cabeçalho de seção: um respiro consistente antes de cada bloco. */
export const SectionTitle: React.FC<{
  eyebrow?: string;
  title: string;
  hint?: string;
  action?: React.ReactNode;
}> = ({ eyebrow, title, hint, action }) => (
  <div className="flex items-end justify-between gap-4 px-1">
    <div className="min-w-0">
      {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
      <h3 className="text-[19px] leading-tight text-ink">{title}</h3>
      {hint && <p className="mt-1 text-[13px] leading-relaxed text-ink-3">{hint}</p>}
    </div>
    {action}
  </div>
);

/** Cápsula de metadado. Tom neutro por padrão. */
export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: 'leaf' | 'ochre' | 'clay' | 'lunar' | 'neutral';
  icon?: React.ElementType;
  className?: string;
}> = ({ children, tone = 'neutral', icon: Icon, className = '' }) => {
  const tones = {
    leaf: 'bg-leaf-50 text-leaf-700 border-leaf-100',
    ochre: 'bg-ochre-50 text-ochre-700 border-ochre-100',
    clay: 'bg-clay-50 text-clay-600 border-clay-100',
    lunar: 'bg-lunar-50 text-lunar-600 border-lunar-100',
    neutral: 'bg-canvas text-ink-2 border-line'
  };
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-left text-[11px] font-semibold ${tones[tone]} ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />}
      {children}
    </span>
  );
};

/** Botão. Uma única ação primária por tela (Apple HIG: primary-action). */
export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'md' | 'lg';
    icon?: React.ElementType;
    iconRight?: React.ElementType;
    loading?: boolean;
    full?: boolean;
  }
> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  full = false,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const variants = {
    primary:
      'bg-leaf-600 text-white border-leaf-600 hover:bg-leaf-700 shadow-leaf-sm hover:shadow-leaf',
    secondary: 'bg-surface text-ink border-line hover:border-leaf-300 hover:bg-leaf-50',
    ghost: 'bg-transparent text-ink-2 border-transparent hover:bg-leaf-50 hover:text-leaf-700',
    danger: 'bg-clay-50 text-clay-600 border-clay-100 hover:bg-clay-100'
  };
  const sizes = {
    md: 'px-4 py-2.5 text-[13px]',
    lg: 'px-6 py-4 text-[15px]'
  };

  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`tap press inline-flex items-center justify-center gap-2 rounded-full border font-semibold
        disabled:pointer-events-none disabled:opacity-45
        ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      )}
      {children}
      {IconRight && !loading && (
        <IconRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      )}
    </button>
  );
};

/** Card padrão. Sem gradientes ruidosos — só superfície, borda e respiro. */
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padded?: boolean;
  as?: 'div' | 'section' | 'article';
}> = ({ children, className = '', style, padded = true, as: Tag = 'div' }) => (
  <Tag className={`card ${padded ? 'p-5' : ''} ${className}`} style={style}>
    {children}
  </Tag>
);

/** Escolha exclusiva em linha — alternativa acessível a rádios nativos. */
export const ChoiceRow: React.FC<{
  options: { value: string; label: string; hint?: string }[];
  value: string | null;
  onChange: (v: string) => void;
  name: string;
  columns?: 1 | 2 | 3;
}> = ({ options, value, onChange, name, columns = 1 }) => (
  <div
    role="radiogroup"
    aria-labelledby={`${name}-label`}
    className={`grid gap-2 ${
      columns === 3 ? 'grid-cols-3' : columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
    }`}
  >
    {options.map(opt => {
      const selected = value === opt.value;
      return (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(opt.value)}
          className={`tap press flex items-center gap-3 rounded-field border px-3.5 py-3 text-left ${
            selected
              ? 'border-leaf-500 bg-leaf-50 text-leaf-800'
              : 'border-line bg-surface text-ink-2 hover:border-leaf-200 hover:bg-leaf-50/50'
          }`}
        >
          <span
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
              selected ? 'border-leaf-600' : 'border-line'
            }`}
            aria-hidden="true"
          >
            {selected && <span className="h-2 w-2 rounded-full bg-leaf-600" />}
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-semibold leading-snug">{opt.label}</span>
            {opt.hint && <span className="mt-0.5 block text-[11.5px] text-ink-3">{opt.hint}</span>}
          </span>
        </button>
      );
    })}
  </div>
);

/** Seleção múltipla em chips. */
export const ChipGroup: React.FC<{
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
  label: string;
}> = ({ options, values, onToggle, label }) => (
  <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
    {options.map(opt => {
      const selected = values.includes(opt);
      return (
        <button
          key={opt}
          type="button"
          aria-pressed={selected}
          onClick={() => onToggle(opt)}
          className={`press rounded-full border px-3.5 py-2 text-[13px] font-semibold ${
            selected
              ? 'border-leaf-500 bg-leaf-600 text-white'
              : 'border-line bg-surface text-ink-2 hover:border-leaf-300 hover:bg-leaf-50'
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

/** Campo de texto com rótulo visível e texto de apoio persistente. */
export const Field: React.FC<{
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}> = ({ label, hint, required, children, htmlFor }) => (
  <div className="space-y-2">
    <label htmlFor={htmlFor} className="block text-[13.5px] font-semibold text-ink">
      {label}
      {required && (
        <span className="ml-1 text-clay-600" aria-hidden="true">
          *
        </span>
      )}
    </label>
    {hint && <p className="text-[12px] leading-relaxed text-ink-3">{hint}</p>}
    {children}
  </div>
);

export const inputClass =
  'w-full rounded-field border border-line bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-3/70 ' +
  'transition-colors focus:border-leaf-400 focus:outline-none focus:ring-4 focus:ring-leaf-100 min-h-[48px]';

/** Estado vazio — sempre explica o porquê e oferece o próximo passo. */
export const EmptyState: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-50 text-leaf-500">
      <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
    </div>
    <h4 className="text-[15px] font-semibold text-ink">{title}</h4>
    <p className="mt-1.5 max-w-[38ch] text-[13px] leading-relaxed text-ink-3">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/** Barra de progresso acessível. */
export const Progress: React.FC<{ value: number; label: string; tone?: 'leaf' | 'ochre' }> = ({
  value,
  label,
  tone = 'leaf'
}) => (
  <div
    role="progressbar"
    aria-valuenow={Math.round(value)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={label}
    className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft"
  >
    <div
      className={`h-full rounded-full transition-[width] duration-700 ease-out ${
        tone === 'leaf' ? 'bg-leaf-500' : 'bg-ochre-400'
      }`}
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
