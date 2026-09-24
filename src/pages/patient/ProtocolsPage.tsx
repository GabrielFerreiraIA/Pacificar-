import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ZEOLITE_PROTOCOL_INFO,
  IVERMECTIN_POSOLOGY_TABLE,
  ACTIVATED_CHARCOAL_INFO,
  HYDROGEN_PEROXIDE_INFO,
  PARASITE_PROTOCOL_RULES
} from '../../data/lunarData';
import { Card, Pill, Progress, SectionTitle } from '../../components/ui/Primitives';
import {
  Gem,
  Moon,
  Check,
  Pill as PillIcon,
  Circle,
  Info,
  Droplets,
  Sun,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type Protocol = 'zeolita' | 'desparasitacao';

const TOTAL_WEEKS = 18; // 120 dias em blocos de 7

/** Datas em formato longo pt-BR: "18 de setembro de 2026". */
const formatMoonDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const ProtocolsPage: React.FC = () => {
  const { currentUser, zeoliteLoggedDays, toggleZeoliteDay, parasiteCycles, updateParasiteCycle } =
    useApp();

  const [protocol, setProtocol] = useState<Protocol>('zeolita');
  const [weekIndex, setWeekIndex] = useState(0);

  const weight = currentUser?.weight ?? 68;
  const posology = useMemo(() => {
    if (weight < 60) return IVERMECTIN_POSOLOGY_TABLE[0];
    if (weight <= 80) return IVERMECTIN_POSOLOGY_TABLE[1];
    return IVERMECTIN_POSOLOGY_TABLE[2];
  }, [weight]);

  const zeoliteDone = zeoliteLoggedDays.length;
  const zeolitePercent = (zeoliteDone / ZEOLITE_PROTOCOL_INFO.total_days) * 100;
  const cyclesDone = parasiteCycles.filter(c => c.completed).length;

  return (
    <div className="space-y-7 pb-8">
      <header className="rise">
        <p className="eyebrow">Manutenção profunda</p>
        <h2 className="mt-2 text-[30px] leading-[1.15]">Seus protocolos</h2>
        <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
          Duas trilhas que seguem além dos 21 dias: a quelação de metais pesados e a desparasitação
          sincronizada com a lua cheia.
        </p>
      </header>

      <div role="tablist" aria-label="Protocolos" className="grid grid-cols-2 gap-1.5">
        {(
          [
            { id: 'zeolita' as const, label: 'Zeólita', icon: Gem, meta: `${zeoliteDone}/120 dias` },
            {
              id: 'desparasitacao' as const,
              label: 'Desparasitação',
              icon: Moon,
              meta: `${cyclesDone}/5 luas`
            }
          ]
        ).map(t => {
          const Icon = t.icon;
          const active = protocol === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              onClick={() => setProtocol(t.id)}
              className={`tap press flex flex-col items-start gap-1.5 rounded-card border p-4 text-left ${
                active
                  ? 'border-leaf-600 bg-leaf-600 text-white'
                  : 'border-line bg-surface text-ink-2 hover:border-leaf-300'
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${active ? 'text-leaf-100' : 'text-ink-3'}`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="text-[14px] font-semibold leading-tight">{t.label}</span>
              <span
                className={`tnum text-[12px] ${active ? 'text-leaf-100/85' : 'text-ink-3'}`}
              >
                {t.meta}
              </span>
            </button>
          );
        })}
      </div>

      {/* ══ ZEÓLITA ══════════════════════════════════════════════ */}
      {protocol === 'zeolita' && (
        <div className="space-y-6">
          <Card className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Quelação de metais</p>
                <p className="mt-1.5 font-display text-[34px] leading-none text-ink">
                  <span className="tnum">{zeoliteDone}</span>
                  <span className="text-[18px] text-ink-3"> / 120</span>
                </p>
                <p className="mt-1.5 text-[12.5px] text-ink-3">
                  Faltam <span className="tnum">{120 - zeoliteDone}</span> dias
                </p>
              </div>

              {/* Anel de progresso */}
              <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--color-line-soft)"
                  strokeWidth="9"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="var(--color-leaf-500)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 42}
                  strokeDashoffset={2 * Math.PI * 42 * (1 - zeolitePercent / 100)}
                  className="transition-[stroke-dashoffset] duration-700 ease-out"
                />
              </svg>
            </div>

            <Progress value={zeolitePercent} label="Progresso do protocolo de zeólita" />

            <div className="space-y-3 rounded-field bg-canvas px-4 py-4">
              <div>
                <p className="eyebrow mb-1.5">Dose</p>
                <p className="text-[13.5px] leading-relaxed text-ink-2">
                  {ZEOLITE_PROTOCOL_INFO.dosage}
                </p>
              </div>
              <div>
                <p className="eyebrow mb-1.5">Quando tomar</p>
                <p className="text-[13.5px] leading-relaxed text-ink-2">
                  {ZEOLITE_PROTOCOL_INFO.timing}
                </p>
              </div>
            </div>
          </Card>

          <section className="space-y-3">
            <SectionTitle
              eyebrow="Cuidados"
              title="Três regras que importam"
              hint="Elas definem se a zeólita funciona ou não."
            />
            <ul className="space-y-2">
              {ZEOLITE_PROTOCOL_INFO.instructions.map((rule, i) => (
                <li key={i} className="card flex gap-3.5 p-4">
                  <span className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-[12px] font-bold text-leaf-700">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-[13.5px] leading-relaxed text-ink-2">{rule}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <SectionTitle eyebrow="O que ela recolhe" title="Metais e resíduos" />
            <div className="flex flex-wrap gap-2">
              {ZEOLITE_PROTOCOL_INFO.metals_chelated.map(metal => (
                <Pill key={metal} tone="leaf">
                  {metal}
                </Pill>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <SectionTitle
              eyebrow="Registro"
              title="Marque seus dias"
              hint="Uma semana por vez, para o toque nunca exigir pontaria."
              action={
                <span className="tnum shrink-0 pb-1 text-[12.5px] font-semibold text-ink-3">
                  {zeoliteDone}/120
                </span>
              }
            />

            <Card className="space-y-4">
              {/* Navegação por semana */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setWeekIndex(w => Math.max(0, w - 1))}
                  disabled={weekIndex === 0}
                  aria-label="Semana anterior"
                  className="tap press flex items-center justify-center rounded-full border border-line text-ink-2 hover:border-leaf-300 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </button>

                <p className="tnum text-[13.5px] font-semibold text-ink">
                  Dias {weekIndex * 7 + 1} a {Math.min(weekIndex * 7 + 7, 120)}
                </p>

                <button
                  onClick={() => setWeekIndex(w => Math.min(TOTAL_WEEKS - 1, w + 1))}
                  disabled={weekIndex >= TOTAL_WEEKS - 1}
                  aria-label="Próxima semana"
                  className="tap press flex items-center justify-center rounded-full border border-line text-ink-2 hover:border-leaf-300 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </button>
              </div>

              {/* Sete dias, todos com alvo de toque confortável */}
              <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Dias da semana">
                {Array.from({ length: 7 }, (_, i) => weekIndex * 7 + i + 1)
                  .filter(day => day <= ZEOLITE_PROTOCOL_INFO.total_days)
                  .map(day => {
                    const done = zeoliteLoggedDays.includes(day);
                    return (
                      <button
                        key={day}
                        onClick={() => toggleZeoliteDay(day)}
                        aria-pressed={done}
                        aria-label={`Dia ${day}${done ? ', registrado' : ', não registrado'}`}
                        className={`tap press flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-field border ${
                          done
                            ? 'border-leaf-600 bg-leaf-600 text-white'
                            : 'border-line bg-surface text-ink-3 hover:border-leaf-200 hover:bg-leaf-50'
                        }`}
                      >
                        <span className="tnum text-[13px] font-bold leading-none">{day}</span>
                        {done && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
                      </button>
                    );
                  })}
              </div>
            </Card>

            {/* Visão geral dos 120 dias — leitura, não toque */}
            <Card className="space-y-3">
              <p className="eyebrow">Visão geral dos 120 dias</p>
              <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1" aria-hidden="true">
                {Array.from({ length: ZEOLITE_PROTOCOL_INFO.total_days }, (_, i) => i + 1).map(
                  day => (
                    <span
                      key={day}
                      className={`aspect-square rounded-[3px] ${
                        zeoliteLoggedDays.includes(day)
                          ? 'bg-leaf-500'
                          : weekIndex * 7 < day && day <= weekIndex * 7 + 7
                            ? 'bg-ochre-200'
                            : 'bg-line-soft'
                      }`}
                    />
                  )
                )}
              </div>
              <p className="text-[12px] leading-relaxed text-ink-3">
                <span className="tnum font-semibold text-ink">{zeoliteDone}</span> dias registrados
                de 120. Os quadrados em verde são os seus.
              </p>
            </Card>
          </section>
        </div>
      )}

      {/* ══ DESPARASITAÇÃO ═══════════════════════════════════════ */}
      {protocol === 'desparasitacao' && (
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-start gap-3.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lunar-50 text-lunar-600">
                <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="eyebrow">Sua posologia</p>
                <p className="mt-1 text-[15px] font-semibold text-ink">
                  Peso registrado: <span className="tnum">{weight}</span> kg
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink-3">
                  Faixa {posology.weight_range}
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {[
                {
                  icon: PillIcon,
                  name: 'Ivermectina',
                  dose: `${posology.tablets_per_cycle} comprimidos · ${posology.total_mg}`,
                  when: posology.timing,
                  tone: 'leaf' as const
                },
                {
                  icon: Circle,
                  name: ACTIVATED_CHARCOAL_INFO.name,
                  dose: ACTIVATED_CHARCOAL_INFO.dosage,
                  when: ACTIVATED_CHARCOAL_INFO.timing,
                  tone: 'neutral' as const
                },
                {
                  icon: Droplets,
                  name: HYDROGEN_PEROXIDE_INFO.name,
                  dose: HYDROGEN_PEROXIDE_INFO.dosage,
                  when: HYDROGEN_PEROXIDE_INFO.timing,
                  tone: 'ochre' as const
                }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.name}
                    className="flex gap-3.5 rounded-field border border-line bg-canvas p-3.5"
                  >
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-ink-3"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold leading-snug text-ink">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{item.dose}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-ink-3">{item.when}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="flex items-start gap-2.5 rounded-field bg-ochre-50 px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-ochre-600" strokeWidth={2} aria-hidden="true" />
              A posologia é calculada pelo seu peso. Se ele mudar, atualize no Perfil para o cálculo
              acompanhar.
            </p>
          </Card>

          <section className="space-y-3">
            <SectionTitle
              eyebrow="Como funciona"
              title="As regras do ciclo"
              hint="Direto do protocolo clínico de Ana Carla Nesi."
            />
            <ul className="space-y-2">
              {PARASITE_PROTOCOL_RULES.map((rule, i) => (
                <li key={i} className="card flex gap-3.5 p-4">
                  <span className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lunar-50 text-[12px] font-bold text-lunar-600">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 text-[13.5px] leading-relaxed text-ink-2">{rule}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <SectionTitle
              eyebrow="Rastreador"
              title="As cinco luas"
              hint="Marque cada um dos três dias conforme for tomando."
              action={
                <span className="tnum shrink-0 pb-1 text-[12.5px] font-semibold text-ink-3">
                  {cyclesDone}/5
                </span>
              }
            />

            <ul className="space-y-3">
              {parasiteCycles.map(cycle => {
                const days = [
                  { key: 'day1_completed' as const, done: cycle.day1_completed },
                  { key: 'day2_completed' as const, done: cycle.day2_completed },
                  { key: 'day3_completed' as const, done: cycle.day3_completed }
                ];
                const doneCount = days.filter(d => d.done).length;
                const isCurrent = !cycle.completed && doneCount > 0;

                return (
                  <li key={cycle.id}>
                    <Card
                      className={
                        cycle.completed
                          ? 'border-leaf-200 bg-leaf-50/50'
                          : isCurrent
                            ? 'border-lunar-100'
                            : ''
                      }
                    >
                      <div className="mb-4 flex items-start gap-3.5">
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            cycle.completed
                              ? 'bg-leaf-600 text-white'
                              : isCurrent
                                ? 'bg-lunar-100 text-lunar-600'
                                : 'bg-canvas text-ink-3'
                          }`}
                        >
                          {cycle.completed ? (
                            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                          ) : (
                            <span className="tnum text-[13px] font-bold">
                              {cycle.cycle_number}
                            </span>
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="text-[14.5px] font-semibold leading-snug text-ink">
                            {cycle.moon_name}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-3">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
                            {formatMoonDate(cycle.moon_date)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {days.map((d, i) => (
                          <button
                            key={d.key}
                            onClick={() =>
                              updateParasiteCycle(cycle.id, {
                                [d.key]: !d.done,
                                completed:
                                  days.filter((x, xi) => (xi === i ? !d.done : x.done)).length === 3
                              })
                            }
                            aria-pressed={d.done}
                            className={`tap press flex flex-col items-center gap-1 rounded-field border py-2.5 ${
                              d.done
                                ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                                : 'border-line bg-surface text-ink-3 hover:border-leaf-200'
                            }`}
                          >
                            <Sun className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                            <span className="text-[11.5px] font-semibold">Dia {i + 1}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          updateParasiteCycle(cycle.id, { charcoal_taken: !cycle.charcoal_taken })
                        }
                        aria-pressed={cycle.charcoal_taken}
                        className={`tap press mt-2 flex w-full items-center gap-3 rounded-field border px-3.5 py-3 text-left ${
                          cycle.charcoal_taken
                            ? 'border-leaf-500 bg-leaf-50 text-leaf-800'
                            : 'border-line bg-surface text-ink-2 hover:border-leaf-200'
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            cycle.charcoal_taken ? 'border-leaf-600 bg-leaf-600' : 'border-line'
                          }`}
                          aria-hidden="true"
                        >
                          {cycle.charcoal_taken && (
                            <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                          )}
                        </span>
                        <span className="text-[13px] font-semibold">
                          Carvão ativado nas três noites
                        </span>
                      </button>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};
