import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BristolSelector } from '../../components/bristol/BristolSelector';
import { Button, Card, Pill, inputClass } from '../../components/ui/Primitives';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Check,
  Zap,
  Moon,
  Wind,
  Candy,
  Salad,
  Sprout,
  NotebookPen,
  Award,
  Droplets,
  Gem,
  Wand2
} from 'lucide-react';

interface CheckinNightlyPageProps {
  dayNumber: number;
  onClose: () => void;
  onOpenReport?: (weekNumber: number) => void;
}

/* ── Configuração declarativa das escalas ──────────────────────── */

const ENERGY = ['Exausto', 'Baixa', 'Média', 'Boa', 'Radiante'];
const SLEEP = ['Péssimo', 'Agitado', 'Regular', 'Bom', 'Profundo'];

const BLOATING = [
  { level: 1 as const, label: 'Nenhum', desc: 'Barriga leve', good: true },
  { level: 2 as const, label: 'Leve', desc: 'Pouco ar', good: false },
  { level: 3 as const, label: 'Moderado', desc: 'Estufamento', good: false },
  { level: 4 as const, label: 'Intenso', desc: 'Barriga dura', good: false }
];

const CRAVING = [
  { level: 1 as const, label: 'Nenhuma', desc: 'Paladar saciado', good: true },
  { level: 2 as const, label: 'Leve', desc: 'Passa com um chá', good: false },
  { level: 3 as const, label: 'Forte', desc: 'Difícil de controlar', good: false }
];

const DIET = [
  { val: 'total' as const, label: '100% limpo', desc: 'Zero inflamatórios', good: true },
  { val: 'partial' as const, label: 'Deslize leve', desc: 'Um item pequeno', good: false },
  { val: 'none' as const, label: 'Não segui', desc: 'Retomo amanhã', good: false }
];

const RITUALS = [
  { key: 'tongue', label: 'Raspagem da língua', icon: Wand2 },
  { key: 'water', label: 'Água morna em jejum', icon: Droplets },
  { key: 'zeolite', label: 'Zeólita matinal', icon: Gem },
  { key: 'selfcare', label: 'Massagem com óleo', icon: Sprout }
] as const;

/* ── Sub-componentes de escala ─────────────────────────────────── */

const ScaleQuestion: React.FC<{
  step: number;
  icon: React.ElementType;
  question: string;
  labels: string[];
  value: number;
  onChange: (v: number) => void;
}> = ({ step, icon: Icon, question, labels, value, onChange }) => (
  <Card as="section" className="space-y-4">
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="eyebrow">Pergunta {step}</p>
        <h3 className="mt-1 text-[17px] leading-snug">{question}</h3>
      </div>
    </div>

    <div role="radiogroup" aria-label={question} className="grid grid-cols-5 gap-1.5">
      {labels.map((label, i) => {
        const rating = i + 1;
        const selected = value === rating;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${rating} de 5 — ${label}`}
            onClick={() => onChange(rating)}
            className={`tap press flex flex-col items-center justify-center gap-1 rounded-field border py-3 ${
              selected
                ? 'border-leaf-600 bg-leaf-600 text-white'
                : 'border-line bg-surface text-ink-3 hover:border-leaf-200 hover:bg-leaf-50/50'
            }`}
          >
            <span className="tnum text-[15px] font-bold leading-none">{rating}</span>
            <span className="text-[9.5px] font-medium leading-tight">{label}</span>
          </button>
        );
      })}
    </div>
  </Card>
);

const OptionQuestion: React.FC<{
  step: number;
  icon: React.ElementType;
  question: string;
  options: { label: string; desc: string; good: boolean }[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  columns: number;
}> = ({ step, icon: Icon, question, options, selectedIndex, onSelect, columns }) => (
  <Card as="section" className="space-y-4">
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
        <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="eyebrow">Pergunta {step}</p>
        <h3 className="mt-1 text-[17px] leading-snug">{question}</h3>
      </div>
    </div>

    <div
      role="radiogroup"
      aria-label={question}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <button
            key={opt.label}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(i)}
            className={`tap press rounded-field border px-2.5 py-3 text-center ${
              selected
                ? opt.good
                  ? 'border-leaf-600 bg-leaf-600 text-white'
                  : 'border-ochre-400 bg-ochre-400 text-white'
                : 'border-line bg-surface text-ink-3 hover:border-leaf-200 hover:bg-leaf-50/50'
            }`}
          >
            <span className="block text-[13px] font-bold leading-tight">{opt.label}</span>
            <span className="mt-0.5 block text-[10.5px] leading-tight opacity-85">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  </Card>
);

/* ── Página ────────────────────────────────────────────────────── */

export const CheckinNightlyPage: React.FC<CheckinNightlyPageProps> = ({
  dayNumber,
  onClose,
  onOpenReport
}) => {
  const { checkins, saveDailyCheckin } = useApp();
  const existing = checkins.find(c => c.day_number === dayNumber);

  const [energy, setEnergy] = useState(existing?.energy_rating ?? 4);
  const [sleep, setSleep] = useState(existing?.sleep_quality ?? 4);
  const [bloating, setBloating] = useState<1 | 2 | 3 | 4>(existing?.bloating_level ?? 1);
  const [craving, setCraving] = useState<1 | 2 | 3>(existing?.sweet_craving ?? 1);
  const [bristol, setBristol] = useState<number>(existing?.bristol_type ?? 4);
  const [diet, setDiet] = useState<'total' | 'partial' | 'none'>(
    existing?.diet_compliance ?? 'total'
  );
  const [rituals, setRituals] = useState<Record<string, boolean>>({
    tongue: existing?.tongue_scraping_done ?? false,
    water: existing?.warm_water_done ?? false,
    zeolite: existing?.zeolite_taken ?? false,
    selfcare: existing?.self_care_done ?? false
  });
  const [notes, setNotes] = useState(existing?.journal_notes ?? '');
  const [submitted, setSubmitted] = useState(false);

  const isMilestone = [7, 14, 21].includes(dayNumber);
  const week = dayNumber === 7 ? 1 : dayNumber === 14 ? 2 : 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    saveDailyCheckin({
      day_number: dayNumber,
      user_id: '', // o contexto preenche com o usuário logado
      energy_rating: energy,
      sleep_quality: sleep,
      bloating_level: bloating,
      sweet_craving: craving,
      bristol_type: bristol,
      diet_compliance: diet,
      water_intake: '2,5 a 3 litros',
      tongue_scraping_done: rituals.tongue,
      warm_water_done: rituals.water,
      zeolite_taken: rituals.zeolite,
      self_care_done: rituals.selfcare,
      journal_notes: notes
    });

    // Celebração discreta — respeita quem prefere menos movimento
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({
        particleCount: 60,
        spread: 62,
        startVelocity: 28,
        origin: { y: 0.65 },
        colors: ['#2d6b48', '#61a681', '#e9be7c', '#c3dfce']
      });
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Confirmação ──────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="rise mx-auto max-w-md space-y-7 py-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-600 text-white shadow-leaf">
          <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
        </div>

        <div>
          <h2 className="text-[28px] leading-tight">
            Dia <span className="tnum">{String(dayNumber).padStart(2, '0')}</span> concluído
          </h2>
          <p className="mx-auto mt-3 max-w-[38ch] text-[14.5px] leading-relaxed text-ink-2">
            Seus sinais foram registrados no prontuário. A constância é o que transforma — e você
            esteve aqui de novo hoje.
          </p>
        </div>

        {isMilestone && (
          <Card className="space-y-3 border-ochre-200 bg-ochre-50/60 text-left">
            <div className="flex items-center gap-2.5">
              <Award className="h-4 w-4 shrink-0 text-ochre-700" strokeWidth={2} aria-hidden="true" />
              <p className="text-[13px] font-bold text-ochre-700">
                Checkpoint da semana {week} liberado
              </p>
            </div>
            <p className="text-[13px] leading-relaxed text-ink-2">
              Seu relatório de correlação já está pronto, com a evolução de energia, sono, inchaço e
              Bristol.
            </p>
            <Button full onClick={() => onOpenReport?.(week)}>
              Abrir relatório da semana {week}
            </Button>
          </Card>
        )}

        <Button full size="lg" variant={isMilestone ? 'secondary' : 'primary'} onClick={onClose}>
          Voltar para a jornada
        </Button>
      </div>
    );
  }

  /* ── Formulário ───────────────────────────────────────────── */
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="tap press -ml-2 flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-2 hover:bg-line-soft"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Voltar
        </button>
        <Pill tone="leaf">
          Dia <span className="tnum mx-0.5 font-bold">{dayNumber}</span> de 21
        </Pill>
      </div>

      <header className="rise">
        <h2 className="text-[28px] leading-tight">Check-in da noite</h2>
        <p className="mt-2.5 max-w-[44ch] text-[14.5px] leading-relaxed text-ink-2">
          Oito perguntas, cerca de um minuto. É assim que a Ana enxerga sua evolução entre as
          consultas.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ScaleQuestion
          step={1}
          icon={Zap}
          question="Como esteve sua energia hoje?"
          labels={ENERGY}
          value={energy}
          onChange={setEnergy}
        />

        <ScaleQuestion
          step={2}
          icon={Moon}
          question="Como foi seu sono na noite passada?"
          labels={SLEEP}
          value={sleep}
          onChange={setSleep}
        />

        <OptionQuestion
          step={3}
          icon={Wind}
          question="Teve inchaço abdominal ou gases?"
          options={BLOATING}
          selectedIndex={bloating - 1}
          onSelect={i => setBloating((i + 1) as 1 | 2 | 3 | 4)}
          columns={4}
        />

        <OptionQuestion
          step={4}
          icon={Candy}
          question="Sentiu vontade de doce ou pão?"
          options={CRAVING}
          selectedIndex={craving - 1}
          onSelect={i => setCraving((i + 1) as 1 | 2 | 3)}
          columns={3}
        />

        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <Sprout className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">Pergunta 5</p>
              <h3 className="mt-1 text-[17px] leading-snug">Como foram suas fezes hoje?</h3>
            </div>
          </div>
          <BristolSelector value={bristol} onChange={setBristol} />
        </Card>

        <OptionQuestion
          step={6}
          icon={Salad}
          question="Manteve as quatro eliminações?"
          options={DIET}
          selectedIndex={DIET.findIndex(d => d.val === diet)}
          onSelect={i => setDiet(DIET[i].val)}
          columns={3}
        />

        <Card as="section" className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <Wand2 className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">Pergunta 7</p>
              <h3 className="mt-1 text-[17px] leading-snug">Quais rituais você cumpriu?</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {RITUALS.map(({ key, label, icon: Icon }) => {
              const on = rituals[key];
              return (
                <button
                  key={key}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  onClick={() => setRituals(p => ({ ...p, [key]: !p[key] }))}
                  className={`tap press flex items-center gap-3 rounded-field border px-3.5 py-3 text-left ${
                    on
                      ? 'border-leaf-500 bg-leaf-50 text-leaf-800'
                      : 'border-line bg-surface text-ink-2 hover:border-leaf-200'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      on ? 'border-leaf-600 bg-leaf-600' : 'border-line'
                    }`}
                    aria-hidden="true"
                  >
                    {on && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                  </span>
                  <Icon
                    className={`h-4 w-4 shrink-0 ${on ? 'text-leaf-600' : 'text-ink-3'}`}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span className="text-[13px] font-semibold leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card as="section" className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <NotebookPen className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">Pergunta 8 · opcional</p>
              <h3 className="mt-1 text-[17px] leading-snug">Quer registrar algo do seu dia?</h3>
            </div>
          </div>

          <label htmlFor="journal" className="sr-only">
            Diário do dia
          </label>
          <textarea
            id="journal"
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Uma sensação no corpo, um humor, uma pequena vitória..."
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Card>

        <div className="pt-2">
          <Button type="submit" full size="lg" icon={Check} className="shadow-leaf-lg">
            Concluir check-in do dia {dayNumber}
          </Button>
        </div>
      </form>
    </div>
  );
};
