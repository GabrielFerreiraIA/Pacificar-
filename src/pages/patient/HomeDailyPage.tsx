import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JOURNEY_DAYS } from '../../data/journeyDays';
import { AudioPlayerDaily } from '../../components/audio/AudioPlayerDaily';
import { MealCard } from '../../components/cards/MealCard';
import { SelfCareCard } from '../../components/cards/SelfCareCard';
import { RestrictionBanner } from '../../components/cards/RestrictionBanner';
import { Button, Card, Pill, Progress, SectionTitle } from '../../components/ui/Primitives';
import {
  Check,
  ArrowRight,
  ChevronRight,
  Award,
  Clock,
  Lock,
  Compass,
  NotebookPen
} from 'lucide-react';

interface HomeDailyPageProps {
  onOpenCheckin: (dayNumber: number) => void;
  onOpenReport: (weekNumber: number) => void;
  onOpenNutrition: () => void;
}

export const HomeDailyPage: React.FC<HomeDailyPageProps> = ({
  onOpenCheckin,
  onOpenReport,
  onOpenNutrition
}) => {
  const { currentUser, selectedDay, setSelectedDay, checkins } = useApp();

  // BR-001: o conteúdo de um dia só abre quando a data chega
  const unlockedUntil = currentUser?.current_day ?? 1;
  const isLocked = (dayNumber: number) => dayNumber > unlockedUntil;

  const day = JOURNEY_DAYS.find(d => d.day_number === selectedDay) ?? JOURNEY_DAYS[0];
  const locked = isLocked(selectedDay);
  const checkinDone = checkins.some(c => c.day_number === selectedDay);
  const progress = (checkins.length / 21) * 100;
  const isMilestone = [7, 14, 21].includes(selectedDay);

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setChecked(p => ({ ...p, [key]: !p[key] }));
  const doneCount = day.checklist.filter((_, i) => checked[`d${selectedDay}_${i}`]).length;

  const firstName = currentUser?.full_name?.split(' ')[0] ?? '';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  return (
    <div className="space-y-8">
      {/* ── Abertura editorial ────────────────────────────────── */}
      <header className="rise" data-tour="day-hero">
        <p className="text-[13.5px] text-ink-3">
          {greeting}
          {firstName && `, ${firstName}`}
        </p>
        <h2 className="mt-2 text-[30px] leading-[1.15]">{day.title}</h2>
        <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
          {day.subtitle}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill tone="leaf">
            Dia <span className="tnum mx-0.5 font-bold">{day.day_number}</span> de 21
          </Pill>
          <Pill>
            Semana {day.week_number} · {day.theme}
          </Pill>
          <Pill tone={checkinDone ? 'leaf' : 'ochre'} icon={checkinDone ? Check : Clock}>
            {checkinDone ? 'Check-in feito' : 'Check-in pendente'}
          </Pill>
        </div>
      </header>

      {/* ── Linha do tempo dos 21 dias ────────────────────────── */}
      <section
        className="rise space-y-3"
        style={{ animationDelay: '60ms' }}
        aria-label="Linha do tempo da jornada"
        data-tour="timeline"
      >
        <div className="flex items-center justify-between px-1">
          <p className="eyebrow">Sua jornada</p>
          <p className="tnum text-[12px] font-semibold text-ink-3">
            {checkins.length} de 21 registrados
          </p>
        </div>

        <Progress value={progress} label="Progresso dos 21 dias" />

        <div
          className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1"
          role="tablist"
          aria-label="Selecionar dia"
        >
          {JOURNEY_DAYS.map(d => {
            const active = selectedDay === d.day_number;
            const logged = checkins.some(c => c.day_number === d.day_number);
            const milestone = [7, 14, 21].includes(d.day_number);
            const dayLocked = isLocked(d.day_number);

            return (
              <button
                key={d.day_number}
                role="tab"
                aria-selected={active}
                disabled={dayLocked}
                aria-label={
                  dayLocked
                    ? `Dia ${d.day_number}, ainda bloqueado`
                    : `Dia ${d.day_number}${logged ? ', check-in feito' : ''}`
                }
                onClick={() => setSelectedDay(d.day_number)}
                className={`tap press relative flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-1 rounded-field border ${
                  dayLocked
                    ? 'cursor-not-allowed border-line-soft bg-canvas text-ink-3/50'
                    : active
                      ? 'border-leaf-600 bg-leaf-600 text-white shadow-leaf'
                      : logged
                        ? 'border-leaf-200 bg-leaf-50 text-leaf-700'
                        : 'border-line bg-surface text-ink-3 hover:border-leaf-200'
                }`}
              >
                <span className="tnum text-[15px] font-bold leading-none">{d.day_number}</span>
                {dayLocked ? (
                  <Lock className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                ) : logged ? (
                  <Check
                    className={`h-3 w-3 ${active ? 'text-leaf-100' : 'text-leaf-500'}`}
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={`h-1 w-1 rounded-full ${active ? 'bg-white/60' : 'bg-line'}`}
                    aria-hidden="true"
                  />
                )}
                {milestone && (
                  <span
                    className={`absolute -top-0.5 right-1 h-1.5 w-1.5 rounded-full ${
                      active ? 'bg-ochre-200' : 'bg-ochre-400'
                    }`}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Foco do dia ───────────────────────────────────────── */}
      <Card className="rise flex items-start gap-4" style={{ animationDelay: '110ms' }}>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-50 text-ochre-600">
          <Compass className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">Foco de hoje</p>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink">{day.daily_focus}</p>
        </div>
      </Card>

      {/* ── Áudio da terapeuta ────────────────────────────────── */}
      <div className="rise" style={{ animationDelay: '160ms' }} data-tour="audio">
        <AudioPlayerDaily
          dayNumber={day.day_number}
          audioTitle={day.audio_title}
          audioDuration={day.audio_duration}
          audioSummary={day.audio_summary}
          audioTranscript={day.audio_transcript}
        />
      </div>

      {/* ── Quádrupla restrição ───────────────────────────────── */}
      <RestrictionBanner />

      {/* ── Refeições ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle
          eyebrow="Comida de verdade"
          title="Refeições do dia"
          hint="Regional, digestiva, sem glúten, leite, açúcar ou álcool."
          action={
            <button
              onClick={onOpenNutrition}
              className="tap press -mr-2 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-2 text-[13px] font-semibold text-leaf-700 hover:bg-leaf-50"
            >
              Guia
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <MealCard type="breakfast" {...day.meals.breakfast} />
          <MealCard type="lunch" {...day.meals.lunch} />
          <MealCard type="dinner" {...day.meals.dinner} />
          {day.meals.tea_or_snack && (
            <MealCard type="tea_or_snack" {...day.meals.tea_or_snack} />
          )}
        </div>
      </section>

      {/* ── Ritual ────────────────────────────────────────────── */}
      <SelfCareCard {...day.self_care_practice} />

      {/* ── Checklist ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionTitle
          eyebrow="Autocuidado"
          title="Checklist de hoje"
          hint="Toque para marcar conforme for cumprindo."
          action={
            <span className="tnum shrink-0 pb-1 text-[12.5px] font-semibold text-ink-3">
              {doneCount}/{day.checklist.length}
            </span>
          }
        />

        <ul className="space-y-2">
          {day.checklist.map((item, i) => {
            const key = `d${selectedDay}_${i}`;
            const on = Boolean(checked[key]);
            return (
              <li key={key}>
                <button
                  onClick={() => toggle(key)}
                  aria-pressed={on}
                  className={`tap press flex w-full items-start gap-3.5 rounded-card border p-4 text-left ${
                    on
                      ? 'border-leaf-200 bg-leaf-50'
                      : 'border-line bg-surface hover:border-leaf-200'
                  }`}
                >
                  <span
                    className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      on ? 'border-leaf-600 bg-leaf-600' : 'border-line bg-surface'
                    }`}
                    aria-hidden="true"
                  >
                    {on && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                  </span>
                  <span
                    className={`text-[14px] leading-relaxed ${
                      on ? 'text-leaf-800' : 'text-ink-2'
                    }`}
                  >
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Citação ───────────────────────────────────────────── */}
      <blockquote className="border-l-2 border-leaf-200 py-1 pl-5">
        <p className="font-display text-[17px] italic leading-relaxed text-ink-2">
          {day.ayurvedic_quote}
        </p>
      </blockquote>

      {/* ── Relatório de checkpoint ───────────────────────────── */}
      {isMilestone && (
        <Card className="flex items-center gap-4 border-ochre-200 bg-ochre-50/60">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-100 text-ochre-700">
            <Award className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">Checkpoint liberado</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">
              {selectedDay === 7
                ? 'Semana 1 · Reset e desinchaço'
                : selectedDay === 14
                  ? 'Semana 2 · Agni e vitalidade'
                  : 'Semana 3 · Transformação consolidada'}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => onOpenReport(selectedDay === 7 ? 1 : selectedDay === 14 ? 2 : 3)}
          >
            Ver
          </Button>
        </Card>
      )}

      {/* ── Ação primária única da tela ───────────────────────── */}
      <div className="pt-1" data-tour="checkin">
        <Button
          full
          size="lg"
          variant={checkinDone ? 'secondary' : 'primary'}
          icon={locked ? Lock : checkinDone ? Check : NotebookPen}
          iconRight={locked ? undefined : ArrowRight}
          disabled={locked}
          onClick={() => onOpenCheckin(selectedDay)}
          className="shadow-leaf-lg"
        >
          {locked
            ? `Dia ${selectedDay} ainda não liberado`
            : checkinDone
              ? `Revisar check-in do dia ${selectedDay}`
              : 'Fazer check-in de 60 segundos'}
        </Button>
      </div>
    </div>
  );
};
