import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ANAMNESE_SECTIONS } from '../../data/anamneseSchema';
import {
  Button,
  Card,
  EmptyState,
  Field,
  Pill,
  Progress,
  SectionTitle,
  inputClass
} from '../../components/ui/Primitives';
import {
  Search,
  Users,
  Check,
  ChevronRight,
  FileText,
  ClipboardList,
  Leaf,
  AlertTriangle,
  SearchX,
  Clock,
  ExternalLink
} from 'lucide-react';

type Panel = 'anamnese' | 'exames' | 'prescricao';

const DOSHAS = [
  'Vata',
  'Pitta',
  'Kapha',
  'Vata-Pitta',
  'Pitta-Kapha',
  'Vata-Kapha',
  'Tridosha'
] as const;

const MASSALAS = [
  'Massala Vata',
  'Massala Pitta',
  'Massala Kapha',
  'Massala Digestiva Universal'
] as const;

export const AdminDashboardPage: React.FC = () => {
  const {
    patientsList,
    activePatientIdForAdmin,
    setActivePatientIdForAdmin,
    prescription,
    savePrescription,
    anamnese,
    labExams,
    checkins
  } = useApp();

  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState<Panel>('anamnese');
  const [saved, setSaved] = useState(false);

  const [dosha, setDosha] = useState<string>(prescription?.dosha_predominant ?? 'Vata-Pitta');
  const [massala, setMassala] = useState<string>(
    prescription?.massala_recommended ?? 'Massala Vata'
  );
  const [carrierOil, setCarrierOil] = useState(prescription?.carrier_oil ?? 'Óleo de gergelim morno');
  const [notes, setNotes] = useState(prescription?.therapist_notes ?? '');

  const patients = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patientsList.filter(
      p => !q || p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    );
  }, [patientsList, query]);

  const active = patientsList.find(p => p.id === activePatientIdForAdmin);

  /** Paciente em risco: dois ou mais dias sem check-in registrado. */
  const atRisk = (currentDay: number) => currentDay - checkins.length >= 2;

  const answers = anamnese.answers as Record<string, unknown>;
  const answeredSections = ANAMNESE_SECTIONS.filter(s =>
    s.questions.some(q => {
      const v = answers[q.id];
      return Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '';
    })
  );

  const handleSave = () => {
    savePrescription({
      dosha_predominant: dosha as never,
      massala_recommended: massala as never,
      carrier_oil: carrierOil,
      therapist_notes: notes
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-7 pb-8">
      <header className="rise">
        <p className="eyebrow">Painel clínico</p>
        <h2 className="mt-2 text-[30px] leading-[1.15]">Seus pacientes</h2>
        <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
          Anamneses, exames e adesão em um lugar só — para a consulta virar leitura, não coleta.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-2">
        {[
          { value: patientsList.length, label: 'Ativos' },
          { value: patientsList.filter(p => atRisk(p.current_day)).length, label: 'Em risco' },
          { value: labExams.filter(e => !e.therapist_reviewed).length, label: 'A revisar' }
        ].map(stat => (
          <Card key={stat.label} className="px-3 py-4 text-center">
            <p className="tnum font-display text-[24px] leading-none text-ink">{stat.value}</p>
            <p className="mt-1.5 text-[12px] leading-tight text-ink-3">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Lista de pacientes ────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle eyebrow="Acompanhamento" title="Jornadas em curso" />

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
            strokeWidth={2}
            aria-hidden="true"
          />
          <label htmlFor="patient-search" className="sr-only">
            Buscar paciente
          </label>
          <input
            id="patient-search"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nome ou e-mail"
            className={`${inputClass} pl-11`}
          />
        </div>

        {patients.length === 0 ? (
          <Card>
            <EmptyState
              icon={SearchX}
              title="Nenhum paciente encontrado"
              description="Revise o termo da busca ou limpe o campo para ver a lista completa."
            />
          </Card>
        ) : (
          <ul className="space-y-2">
            {patients.map(p => {
              const selected = p.id === activePatientIdForAdmin;
              const risk = atRisk(p.current_day);
              const initials = p.full_name
                .split(' ')
                .slice(0, 2)
                .map(n => n[0])
                .join('')
                .toUpperCase();

              return (
                <li key={p.id}>
                  <button
                    onClick={() => setActivePatientIdForAdmin(p.id)}
                    aria-pressed={selected}
                    className={`tap press card flex w-full items-center gap-4 p-4 text-left ${
                      selected ? 'border-leaf-500 bg-leaf-50/50' : 'hover:border-leaf-300'
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[13px] font-bold text-white">
                      {initials}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold text-ink">
                          {p.full_name}
                        </span>
                        {risk && (
                          <AlertTriangle
                            className="h-3.5 w-3.5 shrink-0 text-ochre-600"
                            strokeWidth={2}
                            aria-label="Paciente em risco de abandono"
                          />
                        )}
                      </span>
                      <span className="tnum mt-1 block text-[12.5px] text-ink-3">
                        Dia {p.current_day} de 21 · {p.weight} kg
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${
                            anamnese.completed
                              ? 'border-leaf-100 bg-leaf-50 text-leaf-700'
                              : 'border-ochre-100 bg-ochre-50 text-ochre-700'
                          }`}
                        >
                          {anamnese.completed ? 'Anamnese ok' : 'Anamnese pendente'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2 py-0.5 text-[10.5px] font-semibold text-ink-2">
                          {labExams.length} {labExams.length === 1 ? 'exame' : 'exames'}
                        </span>
                      </span>
                      <span className="mt-2 block">
                        <Progress
                          value={(p.current_day / 21) * 100}
                          label={`Progresso de ${p.full_name}`}
                          tone={risk ? 'ochre' : 'leaf'}
                        />
                      </span>
                    </span>

                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-ink-3"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Prontuário do paciente ativo ──────────────────────── */}
      {active && (
        <section className="space-y-4 border-t border-line pt-7">
          <SectionTitle
            eyebrow="Prontuário"
            title={active.full_name}
            hint={`${active.email} · ${active.weight} kg`}
          />

          <div role="tablist" aria-label="Seções do prontuário" className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'anamnese' as const, label: 'Anamnese', icon: ClipboardList },
                { id: 'exames' as const, label: 'Exames', icon: FileText },
                { id: 'prescricao' as const, label: 'Prescrição', icon: Leaf }
              ]
            ).map(t => {
              const Icon = t.icon;
              const on = panel === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setPanel(t.id)}
                  className={`tap press flex items-center justify-center gap-1.5 rounded-field border py-2.5 text-[13px] font-semibold ${
                    on
                      ? 'border-leaf-600 bg-leaf-600 text-white'
                      : 'border-line bg-surface text-ink-2 hover:border-leaf-300'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Anamnese */}
          {panel === 'anamnese' && (
            <div className="space-y-3">
              {answeredSections.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={ClipboardList}
                    title="Anamnese ainda não iniciada"
                    description="Quando o paciente começar a responder, os blocos preenchidos aparecem aqui."
                  />
                </Card>
              ) : (
                <>
                  <Pill tone={anamnese.completed ? 'leaf' : 'ochre'}>
                    {anamnese.completed ? 'Concluída' : 'Em preenchimento'}
                  </Pill>

                  {answeredSections.map(section => (
                    <Card key={section.id} className="space-y-3">
                      <p className="eyebrow">{section.title}</p>
                      <dl className="divide-y divide-line-soft">
                        {section.questions
                          .filter(q => {
                            const v = answers[q.id];
                            return Array.isArray(v)
                              ? v.length > 0
                              : v != null && String(v).trim() !== '';
                          })
                          .map(q => {
                            const v = answers[q.id];
                            return (
                              <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                                <dt className="text-[12.5px] font-semibold text-ink-3">
                                  {q.label}
                                </dt>
                                <dd className="mt-1 text-[13.5px] leading-relaxed text-ink">
                                  {Array.isArray(v)
                                    ? v.join(', ')
                                    : q.type === 'bristol'
                                      ? `Tipo ${v}`
                                      : String(v)}
                                </dd>
                              </div>
                            );
                          })}
                      </dl>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Exames */}
          {panel === 'exames' && (
            <div className="space-y-2">
              {labExams.length === 0 ? (
                <Card>
                  <EmptyState
                    icon={FileText}
                    title="Sem exames anexados"
                    description="O paciente ainda não enviou laudos laboratoriais."
                  />
                </Card>
              ) : (
                labExams.map(exam => {
                  const hasFile = Boolean(exam.file_url && exam.file_url !== '#');
                  return (
                    <Card key={exam.id} className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-3">
                        <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold text-ink">
                          {exam.file_name}
                        </p>
                        <p className="mt-0.5 truncate text-[12.5px] text-ink-3">
                          {exam.category} · {exam.exam_date}
                        </p>
                      </div>
                      {hasFile ? (
                        <a
                          href={exam.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tap press inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 text-[12.5px] font-semibold text-leaf-700 hover:border-leaf-300"
                        >
                          Abrir
                          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                        </a>
                      ) : exam.therapist_reviewed ? (
                        <Pill tone="leaf" icon={Check}>
                          Revisado
                        </Pill>
                      ) : (
                        <Pill tone="ochre" icon={Clock}>
                          A revisar
                        </Pill>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Prescrição */}
          {panel === 'prescricao' && (
            <Card className="space-y-5">
              <Field label="Dosha predominante" htmlFor="dosha">
                <select
                  id="dosha"
                  value={dosha}
                  onChange={e => setDosha(e.target.value)}
                  className={inputClass}
                >
                  {DOSHAS.map(d => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Massala indicada" htmlFor="massala">
                <select
                  id="massala"
                  value={massala}
                  onChange={e => setMassala(e.target.value)}
                  className={inputClass}
                >
                  {MASSALAS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Óleo carreador"
                hint="Base para a aromaterapia e a automassagem (abhyanga)."
                htmlFor="carrier"
              >
                <input
                  id="carrier"
                  type="text"
                  value={carrierOil}
                  onChange={e => setCarrierOil(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Recado para o paciente"
                hint="Aparece no perfil dele, assinado com seu CRP."
                htmlFor="therapist-notes"
              >
                <textarea
                  id="therapist-notes"
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Uma orientação curta e acolhedora..."
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </Field>

              <Button full size="lg" icon={Check} onClick={handleSave}>
                Salvar prescrição
              </Button>

              {saved && (
                <p
                  role="status"
                  aria-live="polite"
                  className="flex items-center justify-center gap-2 text-[13px] font-semibold text-leaf-700"
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  Prescrição salva e visível para o paciente
                </p>
              )}
            </Card>
          )}
        </section>
      )}

      {patientsList.length === 0 && (
        <Card>
          <EmptyState
            icon={Users}
            title="Nenhum paciente ativo"
            description="Assim que alguém iniciar a jornada de 21 dias, o acompanhamento aparece aqui."
          />
        </Card>
      )}
    </div>
  );
};
