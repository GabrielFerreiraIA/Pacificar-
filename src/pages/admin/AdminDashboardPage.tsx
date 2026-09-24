import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  ExternalLink,
  NotebookPen,
  PauseCircle,
  PlayCircle,
  RefreshCw
} from 'lucide-react';
import {
  getPatientDetail,
  listPatients,
  markExamReviewed,
  setAccessStatus,
  setPatientWeight,
  type PatientDetail,
  type PatientSummary
} from '../../lib/api/admin';
import { savePrescription as apiSavePrescription } from '../../lib/api/prescriptions';
import { linkDoExame } from '../../lib/api/labExams';
import type { LabExamFile, Prescription } from '../../types';

type Panel = 'anamnese' | 'checkins' | 'exames' | 'prescricao';

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

const DIET = { total: 'Total', partial: 'Parcial', none: 'Não seguiu' } as const;
const INCHACO = ['', 'Nenhum', 'Leve', 'Moderado', 'Intenso'];
const DOCE = ['', 'Zero', 'Leve', 'Incontrolável'];

const MSG_ERRO = 'Não foi possível concluir agora. Confira a internet e tente de novo.';

/** Paciente em risco: dois ou mais dias liberados sem check-in registrado. */
const emRisco = (s: PatientSummary) => s.accessStatus === 'active' && s.profile.current_day - s.checkins >= 2;

const iniciais = (nome: string) =>
  (nome || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

const nomeDe = (s: PatientSummary) => s.profile.full_name || s.profile.email.split('@')[0] || 'Paciente';

/* ═══════════════════════════════════════════════════════════════
   Fonte de dados: banco (com login) ou dados fictícios (demonstração)
   ═══════════════════════════════════════════════════════════════ */

function usePainel() {
  const app = useApp();
  const real = app.userId !== null;

  const [lista, setLista] = useState<PatientSummary[] | null>(null);
  const [detalhe, setDetalhe] = useState<PatientDetail | null>(null);
  const [ativoId, setAtivoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarLista = useCallback(async () => {
    if (!real) return;
    setCarregando(true);
    try {
      setLista(await listPatients());
      setErro(null);
    } catch {
      setErro('Não foi possível carregar os pacientes. Confira a internet e toque em "Atualizar".');
    } finally {
      setCarregando(false);
    }
  }, [real]);

  useEffect(() => {
    void carregarLista();
  }, [carregarLista]);

  useEffect(() => {
    if (!real || !ativoId) return;
    let vivo = true;
    setDetalhe(null);
    getPatientDetail(ativoId)
      .then(d => vivo && setDetalhe(d))
      .catch(() => vivo && setErro(MSG_ERRO));
    return () => {
      vivo = false;
    };
  }, [real, ativoId]);

  // Demonstração: mesma forma de dados a partir dos fictícios do contexto
  const listaDemo: PatientSummary[] = useMemo(
    () =>
      app.patientsList.map(p => ({
        profile: p,
        accessStatus: 'active',
        anamneseCompleted: app.anamnese.completed,
        exams: app.labExams.length,
        examsToReview: app.labExams.filter(e => !e.therapist_reviewed).length,
        checkins: app.checkins.length,
        deletionRequest: null
      })),
    [app.patientsList, app.anamnese, app.labExams, app.checkins]
  );
  const detalheDemo: PatientDetail = {
    anamnese: app.anamnese,
    exams: app.labExams,
    checkins: app.checkins,
    prescription: app.prescription
  };

  const atualizarResumo = (id: string, patch: Partial<PatientSummary>) =>
    setLista(l => l?.map(s => (s.profile.id === id ? { ...s, ...patch } : s)) ?? l);

  return {
    real,
    carregando,
    erro,
    setErro,
    recarregar: carregarLista,
    pacientes: real ? (lista ?? []) : listaDemo,
    ativoId: real ? ativoId : app.activePatientIdForAdmin,
    selecionar: (id: string) => (real ? setAtivoId(id) : app.setActivePatientIdForAdmin(id)),
    detalhe: real ? detalhe : detalheDemo,

    async salvarPrescricao(id: string, p: Partial<Prescription>) {
      if (!real) {
        app.savePrescription(p);
        return true;
      }
      try {
        const salvo = await apiSavePrescription(id, p, app.userId as string);
        setDetalhe(d => (d ? { ...d, prescription: salvo } : d));
        return true;
      } catch {
        setErro(MSG_ERRO);
        return false;
      }
    },

    async salvarPeso(id: string, peso: number | null) {
      if (!real) return true;
      try {
        await setPatientWeight(id, peso);
        setLista(l => l?.map(s => (s.profile.id === id ? { ...s, profile: { ...s.profile, weight: peso ?? undefined } } : s)) ?? l);
        return true;
      } catch {
        setErro(MSG_ERRO);
        return false;
      }
    },

    async revisarExame(exam: LabExamFile, revisado: boolean) {
      if (!real) return;
      try {
        await markExamReviewed(exam.id, revisado);
        setDetalhe(d =>
          d ? { ...d, exams: d.exams.map(e => (e.id === exam.id ? { ...e, therapist_reviewed: revisado } : e)) } : d
        );
        const s = lista?.find(x => x.profile.id === exam.user_id);
        if (s) atualizarResumo(exam.user_id, { examsToReview: Math.max(0, s.examsToReview + (revisado ? -1 : 1)) });
      } catch {
        setErro(MSG_ERRO);
      }
    },

    async mudarAcesso(id: string, status: 'active' | 'revoked') {
      if (!real) return;
      try {
        await setAccessStatus(id, status);
        atualizarResumo(id, { accessStatus: status });
      } catch {
        setErro(MSG_ERRO);
      }
    }
  };
}

/* ═══════════════════════════════════════════════════════════════
   Página
   ═══════════════════════════════════════════════════════════════ */

export const AdminDashboardPage: React.FC = () => {
  const painel = usePainel();
  const { pacientes, ativoId, detalhe } = painel;

  const [query, setQuery] = useState('');
  const [panel, setPanel] = useState<Panel>('anamnese');

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pacientes.filter(
      s => !q || nomeDe(s).toLowerCase().includes(q) || s.profile.email.toLowerCase().includes(q)
    );
  }, [pacientes, query]);

  const ativo = pacientes.find(s => s.profile.id === ativoId);

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
          { value: pacientes.filter(s => s.accessStatus === 'active').length, label: 'Ativos' },
          { value: pacientes.filter(emRisco).length, label: 'Em risco' },
          { value: pacientes.reduce((n, s) => n + s.examsToReview, 0), label: 'A revisar' }
        ].map(stat => (
          <Card key={stat.label} className="px-3 py-4 text-center">
            <p className="tnum font-display text-[24px] leading-none text-ink">{stat.value}</p>
            <p className="mt-1.5 text-[12px] leading-tight text-ink-3">{stat.label}</p>
          </Card>
        ))}
      </div>

      {painel.erro && (
        <p
          role="alert"
          className="rounded-field border border-clay-100 bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-clay-600"
        >
          {painel.erro}
        </p>
      )}

      {/* ── Lista de pacientes ────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Acompanhamento"
          title="Jornadas em curso"
          action={
            painel.real ? (
              <Button variant="ghost" icon={RefreshCw} loading={painel.carregando} onClick={() => void painel.recarregar()}>
                Atualizar
              </Button>
            ) : undefined
          }
        />

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

        {pacientes.length > 0 && filtrados.length === 0 ? (
          <Card>
            <EmptyState
              icon={SearchX}
              title="Nenhum paciente encontrado"
              description="Revise o termo da busca ou limpe o campo para ver a lista completa."
            />
          </Card>
        ) : (
          <ul className="space-y-2">
            {filtrados.map(s => {
              const p = s.profile;
              const selected = p.id === ativoId;
              const risk = emRisco(s);
              const suspensa = s.accessStatus === 'revoked';
              return (
                <li key={p.id}>
                  <button
                    onClick={() => {
                      painel.selecionar(p.id);
                      setPanel('anamnese');
                    }}
                    aria-pressed={selected}
                    className={`tap press card flex w-full items-center gap-4 p-4 text-left ${
                      selected ? 'border-leaf-500 bg-leaf-50/50' : 'hover:border-leaf-300'
                    } ${suspensa ? 'opacity-70' : ''}`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[13px] font-bold text-white">
                      {iniciais(nomeDe(s))}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold text-ink">{nomeDe(s)}</span>
                        {risk && (
                          <AlertTriangle
                            className="h-3.5 w-3.5 shrink-0 text-ochre-600"
                            strokeWidth={2}
                            aria-label="Paciente em risco de abandono"
                          />
                        )}
                      </span>
                      <span className="tnum mt-1 block text-[12.5px] text-ink-3">
                        Dia {p.current_day} de 21 · {p.weight != null ? `${p.weight} kg` : 'peso não informado'}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        {s.deletionRequest && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-clay-100 bg-clay-50 px-2 py-0.5 text-[10.5px] font-semibold text-clay-600">
                            Pediu exclusão
                          </span>
                        )}
                        {suspensa && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-clay-100 bg-clay-50 px-2 py-0.5 text-[10.5px] font-semibold text-clay-600">
                            Acesso suspenso
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${
                            s.anamneseCompleted
                              ? 'border-leaf-100 bg-leaf-50 text-leaf-700'
                              : 'border-ochre-100 bg-ochre-50 text-ochre-700'
                          }`}
                        >
                          {s.anamneseCompleted ? 'Anamnese ok' : 'Anamnese pendente'}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-canvas px-2 py-0.5 text-[10.5px] font-semibold text-ink-2">
                          {s.exams} {s.exams === 1 ? 'exame' : 'exames'}
                          {s.examsToReview > 0 && ` · ${s.examsToReview} a revisar`}
                        </span>
                      </span>
                      <span className="mt-2 block">
                        <Progress
                          value={(p.current_day / 21) * 100}
                          label={`Progresso de ${nomeDe(s)}`}
                          tone={risk ? 'ochre' : 'leaf'}
                        />
                      </span>
                    </span>

                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={2} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Prontuário do paciente ativo ──────────────────────── */}
      {ativo && (
        <section className="space-y-4 border-t border-line pt-7">
          <SectionTitle
            eyebrow="Prontuário"
            title={nomeDe(ativo)}
            hint={`${ativo.profile.email}${ativo.profile.phone ? ` · ${ativo.profile.phone}` : ''}`}
          />

          {ativo.deletionRequest && (
            <p role="note" className="rounded-field border border-clay-100 bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-clay-600">
              <strong>Pedido de exclusão</strong> em {new Date(ativo.deletionRequest.created_at).toLocaleDateString('pt-BR')}
              {ativo.deletionRequest.reason ? `. Motivo: "${ativo.deletionRequest.reason}"` : ''}. Confirme com a paciente e conclua
              pelo painel do Supabase (passo a passo no manual).
            </p>
          )}

          <div role="tablist" aria-label="Seções do prontuário" className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {(
              [
                { id: 'anamnese' as const, label: 'Anamnese', icon: ClipboardList },
                { id: 'checkins' as const, label: 'Check-ins', icon: NotebookPen },
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

          {!detalhe ? (
            <div role="status" className="flex justify-center py-12">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent" aria-hidden="true" />
              <span className="sr-only">Carregando prontuário…</span>
            </div>
          ) : (
            <>
              {panel === 'anamnese' && <PainelAnamnese detalhe={detalhe} />}
              {panel === 'checkins' && <PainelCheckins detalhe={detalhe} />}
              {panel === 'exames' && (
                <PainelExames
                  exams={detalhe.exams}
                  real={painel.real}
                  onRevisar={(e, r) => void painel.revisarExame(e, r)}
                  onErro={painel.setErro}
                />
              )}
              {panel === 'prescricao' && (
                <PainelPrescricao
                  key={ativo.profile.id}
                  ativo={ativo}
                  prescricao={detalhe.prescription}
                  real={painel.real}
                  onSalvar={p => painel.salvarPrescricao(ativo.profile.id, p)}
                  onPeso={peso => painel.salvarPeso(ativo.profile.id, peso)}
                  onAcesso={status => void painel.mudarAcesso(ativo.profile.id, status)}
                />
              )}
            </>
          )}
        </section>
      )}

      {!painel.carregando && pacientes.length === 0 && (
        <Card>
          <EmptyState
            icon={Users}
            title="Nenhum paciente ainda"
            description="Assim que alguém comprar e criar a senha pelo convite, o acompanhamento aparece aqui."
          />
        </Card>
      )}
    </div>
  );
};

/* ── Anamnese ─────────────────────────────────────────────────── */

const respondida = (v: unknown) => (Array.isArray(v) ? v.length > 0 : v != null && String(v).trim() !== '');

const PainelAnamnese: React.FC<{ detalhe: PatientDetail }> = ({ detalhe }) => {
  const answers = detalhe.anamnese.answers as Record<string, unknown>;
  const secoes = ANAMNESE_SECTIONS.filter(s => s.questions.some(q => respondida(answers[q.id])));

  if (secoes.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={ClipboardList}
          title="Anamnese ainda não iniciada"
          description="Quando o paciente começar a responder, os blocos preenchidos aparecem aqui."
        />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Pill tone={detalhe.anamnese.completed ? 'leaf' : 'ochre'}>
        {detalhe.anamnese.completed ? 'Concluída' : 'Em preenchimento'}
      </Pill>
      {secoes.map(section => (
        <Card key={section.id} className="space-y-3">
          <p className="eyebrow">{section.title}</p>
          <dl className="divide-y divide-line-soft">
            {section.questions
              .filter(q => respondida(answers[q.id]))
              .map(q => {
                const v = answers[q.id];
                return (
                  <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                    <dt className="text-[12.5px] font-semibold text-ink-3">{q.label}</dt>
                    <dd className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-ink">
                      {Array.isArray(v) ? v.join(', ') : q.type === 'bristol' ? `Tipo ${v}` : String(v)}
                    </dd>
                  </div>
                );
              })}
          </dl>
        </Card>
      ))}
    </div>
  );
};

/* ── Check-ins ────────────────────────────────────────────────── */

const PainelCheckins: React.FC<{ detalhe: PatientDetail }> = ({ detalhe }) => {
  const lista = [...detalhe.checkins].sort((a, b) => b.day_number - a.day_number);
  if (lista.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={NotebookPen}
          title="Nenhum check-in ainda"
          description="Os registros noturnos do paciente aparecem aqui, do dia mais recente para o mais antigo."
        />
      </Card>
    );
  }
  return (
    <ul className="space-y-2">
      {lista.map(c => (
        <li key={c.id}>
          <Card className="space-y-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[14px] font-semibold text-ink">Dia {c.day_number}</p>
              <p className="tnum text-[12px] text-ink-3">
                {new Date(c.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] sm:grid-cols-3">
              <Dado rotulo="Energia" valor={c.energy_rating ? `${c.energy_rating}/5` : '—'} />
              <Dado rotulo="Sono" valor={c.sleep_quality ? `${c.sleep_quality}/5` : '—'} />
              <Dado rotulo="Inchaço" valor={INCHACO[c.bloating_level] ?? '—'} />
              <Dado rotulo="Vontade de doce" valor={DOCE[c.sweet_craving] ?? '—'} />
              <Dado rotulo="Bristol" valor={`Tipo ${c.bristol_type}`} />
              <Dado rotulo="Dieta" valor={DIET[c.diet_compliance] ?? '—'} />
            </dl>
            <div className="flex flex-wrap gap-1.5">
              {c.zeolite_taken && <Pill tone="leaf">Zeólita</Pill>}
              {c.tongue_scraping_done && <Pill>Raspador de língua</Pill>}
              {c.warm_water_done && <Pill>Água morna</Pill>}
              {c.self_care_done && <Pill>Autocuidado</Pill>}
            </div>
            {c.journal_notes.trim() && (
              <p className="whitespace-pre-line rounded-field bg-canvas px-3 py-2.5 text-[13px] leading-relaxed text-ink-2">
                {c.journal_notes}
              </p>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
};

const Dado: React.FC<{ rotulo: string; valor: string }> = ({ rotulo, valor }) => (
  <div>
    <dt className="text-ink-3">{rotulo}</dt>
    <dd className="font-semibold text-ink">{valor}</dd>
  </div>
);

/* ── Exames ───────────────────────────────────────────────────── */

const PainelExames: React.FC<{
  exams: LabExamFile[];
  real: boolean;
  onRevisar: (e: LabExamFile, revisado: boolean) => void;
  onErro: (msg: string) => void;
}> = ({ exams, real, onRevisar, onErro }) => {
  const [abrindo, setAbrindo] = useState<string | null>(null);

  const abrir = async (exam: LabExamFile) => {
    setAbrindo(exam.id);
    // Abre a aba já no clique (Safari bloqueia pop-up aberto depois de um await)
    const aba = window.open('', '_blank');
    try {
      const url = await linkDoExame(exam.file_url);
      if (aba) aba.location.href = url;
      else window.location.href = url;
    } catch {
      aba?.close();
      onErro(MSG_ERRO);
    } finally {
      setAbrindo(null);
    }
  };

  if (exams.length === 0) {
    return (
      <Card>
        <EmptyState icon={FileText} title="Sem exames anexados" description="O paciente ainda não enviou laudos laboratoriais." />
      </Card>
    );
  }

  return (
    <ul className="space-y-2">
      {exams.map(exam => (
        <li key={exam.id}>
          <Card className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-3">
                <FileText className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{exam.file_name}</p>
                <p className="mt-0.5 truncate text-[12.5px] text-ink-3">
                  {exam.category}
                  {exam.exam_date && ` · ${exam.exam_date.split('-').reverse().join('/')}`}
                </p>
              </div>
              {exam.therapist_reviewed ? (
                <Pill tone="leaf" icon={Check}>
                  Revisado
                </Pill>
              ) : (
                <Pill tone="ochre" icon={Clock}>
                  A revisar
                </Pill>
              )}
            </div>
            {real && (
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" icon={ExternalLink} loading={abrindo === exam.id} onClick={() => void abrir(exam)}>
                  Abrir laudo
                </Button>
                <Button variant="ghost" icon={Check} onClick={() => onRevisar(exam, !exam.therapist_reviewed)}>
                  {exam.therapist_reviewed ? 'Marcar como não revisado' : 'Marcar como revisado'}
                </Button>
              </div>
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
};

/* ── Prescrição, peso e acesso ────────────────────────────────── */

const PainelPrescricao: React.FC<{
  ativo: PatientSummary;
  prescricao: Prescription | null;
  real: boolean;
  onSalvar: (p: Partial<Prescription>) => Promise<boolean>;
  onPeso: (peso: number | null) => Promise<boolean>;
  onAcesso: (status: 'active' | 'revoked') => void;
}> = ({ ativo, prescricao, real, onSalvar, onPeso, onAcesso }) => {
  const [dosha, setDosha] = useState<string>(prescricao?.dosha_predominant ?? 'Vata-Pitta');
  const [massala, setMassala] = useState<string>(prescricao?.massala_recommended ?? 'Massala Vata');
  const [carrierOil, setCarrierOil] = useState(prescricao?.carrier_oil || 'Óleo de gergelim morno');
  const [notes, setNotes] = useState(prescricao?.therapist_notes ?? '');
  const [peso, setPeso] = useState(ativo.profile.weight != null ? String(ativo.profile.weight) : '');
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const pesoNumero = peso.trim() === '' ? null : Number(peso.replace(',', '.'));
  const pesoInvalido = pesoNumero !== null && (!Number.isFinite(pesoNumero) || pesoNumero < 20 || pesoNumero > 300);
  const suspensa = ativo.accessStatus === 'revoked';

  const salvar = async () => {
    if (pesoInvalido) return;
    setSalvando(true);
    const okPrescricao = await onSalvar({
      dosha_predominant: dosha as Prescription['dosha_predominant'],
      massala_recommended: massala as Prescription['massala_recommended'],
      carrier_oil: carrierOil,
      therapist_notes: notes
    });
    const pesoMudou = pesoNumero !== (ativo.profile.weight ?? null);
    const okPeso = pesoMudou ? await onPeso(pesoNumero) : true;
    setSalvando(false);
    if (okPrescricao && okPeso) {
      setSalvo(true);
      window.setTimeout(() => setSalvo(false), 4000);
    }
  };

  const alternarAcesso = () => {
    const msg = suspensa
      ? `Reativar o acesso de ${nomeDe(ativo)}?`
      : `Suspender o acesso de ${nomeDe(ativo)}? A pessoa deixa de entrar no app, mas nada é apagado e você pode reativar depois.`;
    if (window.confirm(msg)) onAcesso(suspensa ? 'active' : 'revoked');
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-5">
        <Field
          label="Peso da paciente (kg)"
          hint="Define a faixa de dose da ivermectina na tela de Protocolos."
          htmlFor="patient-weight"
        >
          <input
            id="patient-weight"
            type="text"
            inputMode="decimal"
            value={peso}
            onChange={e => setPeso(e.target.value)}
            placeholder="Ex.: 64,5"
            aria-invalid={pesoInvalido || undefined}
            className={`${inputClass} max-w-[10rem]`}
          />
          {pesoInvalido && <p className="text-[12px] text-clay-600">Informe um peso entre 20 e 300 kg.</p>}
        </Field>

        <Field label="Dosha predominante" htmlFor="dosha">
          <select id="dosha" value={dosha} onChange={e => setDosha(e.target.value)} className={inputClass}>
            {DOSHAS.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Massala indicada" htmlFor="massala">
          <select id="massala" value={massala} onChange={e => setMassala(e.target.value)} className={inputClass}>
            {MASSALAS.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Óleo carreador" hint="Base para a aromaterapia e a automassagem (abhyanga)." htmlFor="carrier">
          <input
            id="carrier"
            type="text"
            value={carrierOil}
            onChange={e => setCarrierOil(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Recado para o paciente" hint="Aparece no perfil dele, assinado com seu CRP." htmlFor="therapist-notes">
          <textarea
            id="therapist-notes"
            rows={4}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Uma orientação curta e acolhedora..."
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </Field>

        <Button full size="lg" icon={Check} loading={salvando} disabled={pesoInvalido} onClick={() => void salvar()}>
          Salvar prescrição
        </Button>

        {salvo && (
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

      {real && (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">Acesso ao app</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
              {suspensa
                ? 'Suspenso. A pessoa vê a tela de acesso pausado. Os registros continuam guardados.'
                : 'Ativo. Suspenda em caso de reembolso ou cancelamento combinado.'}
            </p>
          </div>
          <Button variant={suspensa ? 'secondary' : 'danger'} icon={suspensa ? PlayCircle : PauseCircle} onClick={alternarAcesso}>
            {suspensa ? 'Reativar acesso' : 'Suspender acesso'}
          </Button>
        </Card>
      )}
    </div>
  );
};
