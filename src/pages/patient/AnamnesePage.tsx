import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ANAMNESE_SECTIONS,
  AnamneseSection,
  Question
} from '../../data/anamneseSchema';
import { BristolSelector } from '../../components/bristol/BristolSelector';
import {
  Button,
  Card,
  ChipGroup,
  ChoiceRow,
  Field,
  Pill,
  Progress,
  SectionTitle,
  inputClass
} from '../../components/ui/Primitives';
import {
  User,
  AlertCircle,
  Sunrise,
  Flame,
  History,
  UtensilsCrossed,
  Activity,
  Heart,
  Moon,
  Flower2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
  Lock,
  CircleDashed,
  ChevronRight,
  FileText,
  Play,
  HeartHandshake
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  user: User,
  alert: AlertCircle,
  sunrise: Sunrise,
  flame: Flame,
  history: History,
  utensils: UtensilsCrossed,
  activity: Activity,
  heart: Heart,
  moon: Moon,
  flower: Flower2,
  sparkles: Sparkles
};

type Answers = Record<string, string | string[] | number | null>;

/** Uma pergunta só aparece quando sua condição `showIf` é satisfeita. */
const isVisible = (q: Question, answers: Answers): boolean => {
  if (!q.showIf) return true;
  const current = answers[q.showIf.id];
  const expected = q.showIf.equals;
  if (current == null || current === '') return false;
  return Array.isArray(expected) ? expected.includes(String(current)) : current === expected;
};

const visibleQuestions = (section: AnamneseSection, answers: Answers) =>
  section.questions.filter(q => isVisible(q, answers));

/** Blocos inteiros podem depender de uma resposta — o ciclo menstrual, por exemplo. */
const visibleSections = (answers: Answers) =>
  ANAMNESE_SECTIONS.filter(s => {
    if (!s.showIf) return true;
    const current = answers[s.showIf.id];
    const expected = s.showIf.equals;
    if (current == null || current === '') return true; // antes de responder, mantém visível
    return Array.isArray(expected) ? expected.includes(String(current)) : current === expected;
  });

const isAnswered = (v: Answers[string]) =>
  Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && String(v).trim() !== '';

/** Progresso de um bloco: perguntas visíveis efetivamente respondidas. */
const sectionProgress = (section: AnamneseSection, answers: Answers) => {
  const qs = visibleQuestions(section, answers);
  const done = qs.filter(q => isAnswered(answers[q.id])).length;
  return { done, total: qs.length, percent: qs.length ? (done / qs.length) * 100 : 0 };
};

/* ═══════════════════════════════════════════════════════════════
   Renderizador de pergunta
   ═══════════════════════════════════════════════════════════════ */

const QuestionField: React.FC<{
  question: Question;
  value: Answers[string];
  onChange: (v: Answers[string]) => void;
  invalid?: boolean;
}> = ({ question: q, value, onChange, invalid }) => {
  const id = `q-${q.id}`;
  const errorId = `${id}-error`;

  const control = () => {
    switch (q.type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            rows={4}
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={q.placeholder}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            className={`${inputClass} resize-y leading-relaxed ${
              invalid ? 'border-clay-500 focus:ring-clay-100' : ''
            }`}
          />
        );

      case 'radio': {
        const opts = (q.options ?? []).map(o => ({
          value: o,
          label: o,
          hint: q.optionHints?.[o]
        }));
        const hasHints = opts.some(o => o.hint);
        return (
          <ChoiceRow
            name={q.id}
            options={opts}
            value={(value as string) ?? null}
            onChange={onChange}
            columns={!hasHints && opts.every(o => o.label.length <= 14) ? 2 : 1}
          />
        );
      }

      case 'multi':
        return (
          <ChipGroup
            label={q.label}
            options={q.options ?? []}
            values={(value as string[]) ?? []}
            onToggle={opt => {
              const cur = (value as string[]) ?? [];
              onChange(cur.includes(opt) ? cur.filter(v => v !== opt) : [...cur, opt]);
            }}
          />
        );

      case 'bristol':
        return (
          <BristolSelector
            value={(value as number) ?? null}
            onChange={t => onChange(t)}
          />
        );

      default:
        return (
          <input
            id={id}
            type={
              q.type === 'date'
                ? 'date'
                : q.type === 'time'
                  ? 'time'
                  : q.type === 'number'
                    ? 'number'
                    : 'text'
            }
            inputMode={q.inputMode}
            autoComplete={q.autoComplete}
            value={(value as string) ?? ''}
            onChange={e => onChange(e.target.value)}
            placeholder={q.placeholder}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            className={`${inputClass} ${invalid ? 'border-clay-500 focus:ring-clay-100' : ''}`}
          />
        );
    }
  };

  return (
    <div className="space-y-2.5">
      <Field label={q.label} hint={q.hint} required={q.required} htmlFor={id}>
        {control()}
      </Field>
      {invalid && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-[12.5px] font-semibold text-clay-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Precisamos desta resposta para a Ana montar seu protocolo.
        </p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Vídeo de boas-vindas
   ═══════════════════════════════════════════════════════════════ */

/** Fica como pôster até Ana gravar e o arquivo entrar em /public. */
const WELCOME_VIDEO_URL = '';

const WelcomeVideo: React.FC = () => {
  if (WELCOME_VIDEO_URL) {
    return (
      <div className="overflow-hidden rounded-bloom border border-line bg-leaf-900 shadow-leaf">
        <video
          src={WELCOME_VIDEO_URL}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full"
        >
          Seu navegador não reproduz vídeo.
        </video>
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-bloom border border-line bg-leaf-800 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ochre-300 text-leaf-900">
        <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
      </span>
      <p className="text-[14.5px] font-semibold text-white">Vídeo de boas-vindas</p>
      <p className="max-w-[34ch] text-[12.5px] leading-relaxed text-leaf-100/80">
        Dois minutos com Ana Carla Nesi. Em gravação — entra aqui assim que estiver pronto.
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   Pacificar as Emoções
   ═══════════════════════════════════════════════════════════════ */

/** Contato direto; troque pelo checkout quando a Kiwify estiver ativa. */
const EMOCOES_URL =
  'https://wa.me/?text=' +
  encodeURIComponent('Olá, Ana! Quero saber mais sobre o Pacificar as Emoções.');

const EmocoesUpsell: React.FC = () => (
  <section className="rise overflow-hidden rounded-bloom border border-ochre-200 bg-ochre-50/70">
    <div className="space-y-4 p-5">
      <div className="flex items-start gap-3.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-100 text-ochre-700">
          <HeartHandshake className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="eyebrow text-ochre-700">Um passo além</p>
          <h3 className="mt-1 text-[20px] leading-snug">Pacificar as Emoções</h3>
        </div>
      </div>

      <p className="text-[13.5px] leading-relaxed text-ink-2">
        O que a mente não digere, o corpo carrega. Inclua 4 sessões individuais de psicoterapia
        integrativa online com Ana Carla Nesi, antes ou durante seus 21 dias.
      </p>

      <a
        href={EMOCOES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="tap press inline-flex w-full items-center justify-center gap-2 rounded-full border border-ochre-600 bg-ochre-600 px-6 py-4 text-[15px] font-semibold text-white hover:bg-ochre-700"
      >
        Quero conhecer
        <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      </a>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   Página
   ═══════════════════════════════════════════════════════════════ */

interface AnamnesePageProps {
  onOpenExams: () => void;
}

export const AnamnesePage: React.FC<AnamnesePageProps> = ({ onOpenExams }) => {
  const { anamnese, saveAnamneseAnswers, completeAnamnese, labExams } = useApp();
  const answers = anamnese.answers as Answers;

  const sections = useMemo(() => visibleSections(answers), [answers]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [videoWatched, setVideoWatched] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const overall = useMemo(() => {
    const totals = sections.map(s => sectionProgress(s, answers));
    const done = totals.reduce((a, t) => a + t.done, 0);
    const total = totals.reduce((a, t) => a + t.total, 0);
    return { done, total, percent: total ? (done / total) * 100 : 0 };
  }, [answers]);

  const section = activeIndex !== null ? sections[activeIndex] : null;
  const questions = section ? visibleQuestions(section, answers) : [];
  const missingRequired = questions.filter(q => q.required && !isAnswered(answers[q.id]));

  // Ao trocar de bloco, leva o foco ao topo (focus-on-route-change)
  useEffect(() => {
    if (activeIndex !== null) topRef.current?.focus();
  }, [activeIndex]);

  const goTo = (index: number | null) => {
    setAttempted(false);
    setActiveIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const advance = () => {
    if (missingRequired.length) {
      setAttempted(true);
      document
        .getElementById(`q-${missingRequired[0].id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById(`q-${missingRequired[0].id}`)?.focus();
      return;
    }
    if (activeIndex !== null && activeIndex < sections.length - 1) {
      goTo(activeIndex + 1);
    } else {
      completeAnamnese();
      goTo(null);
    }
  };

  /* ── Vista de bloco ─────────────────────────────────────────── */
  if (section && activeIndex !== null) {
    const Icon = ICONS[section.icon] ?? Sparkles;
    const prog = sectionProgress(section, answers);
    const isLast = activeIndex === sections.length - 1;

    return (
      <div className="space-y-6 pb-8">
        <div ref={topRef} tabIndex={-1} className="outline-none">
          {/* Cabeçalho do bloco com passo e progresso (multi-step-progress) */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              onClick={() => goTo(null)}
              className="tap press -ml-2 flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-2 hover:bg-line-soft"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Blocos
            </button>
            <span className="tnum text-[12px] font-semibold text-ink-3">
              Bloco {activeIndex + 1} de {sections.length}
            </span>
          </div>

          <Progress
            value={((activeIndex + (prog.percent / 100)) / sections.length) * 100}
            label={`Progresso da anamnese: bloco ${activeIndex + 1} de ${sections.length}`}
          />

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[26px] leading-tight">{section.title}</h2>
              <p className="mt-1.5 max-w-[46ch] text-[13.5px] leading-relaxed text-ink-2">
                {section.purpose}
              </p>
            </div>
          </div>
        </div>

        <Card className="space-y-8">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className="rise"
              style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
            >
              <QuestionField
                question={q}
                value={answers[q.id] ?? null}
                onChange={v => saveAnamneseAnswers({ [q.id]: v })}
                invalid={attempted && q.required === true && !isAnswered(answers[q.id])}
              />
            </div>
          ))}
        </Card>

        {section.optional && (
          <p className="px-1 text-center text-[12.5px] leading-relaxed text-ink-3">
            Este bloco é opcional. Se não se aplica a você, siga em frente sem preencher.
          </p>
        )}

        {/* Navegação do passo — ação primária única à direita */}
        <div className="flex items-center gap-3">
          {activeIndex > 0 && (
            <Button variant="secondary" size="lg" icon={ArrowLeft} onClick={() => goTo(activeIndex - 1)}>
              Voltar
            </Button>
          )}
          <Button size="lg" full iconRight={isLast ? Check : ArrowRight} onClick={advance}>
            {isLast ? 'Concluir anamnese' : 'Continuar'}
          </Button>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-[12px] text-ink-3">
          <Check className="h-3.5 w-3.5 text-leaf-500" aria-hidden="true" />
          Cada resposta é salva automaticamente
        </p>
      </div>
    );
  }

  /* ── Hub de blocos ──────────────────────────────────────────── */
  const nextIndex = sections.findIndex(
    s => sectionProgress(s, answers).percent < 100 && !s.optional
  );

  /* ── Boas-vindas em vídeo, antes do primeiro contato ─────── */
  if (!videoWatched && overall.done === 0) {
    return (
      <div className="rise space-y-7 pb-8 pt-2">
        <header>
          <Pill tone="leaf" icon={FileText}>
            Etapa 0 · Admissão
          </Pill>
          <h2 className="mt-4 text-[30px] leading-[1.15]">
            Boas-vindas
            <br />
            ao Pacificar
          </h2>
          <p className="mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-ink-2">
            Antes de começar, assista dois minutos com a Ana. Ela explica como a jornada funciona e
            como preencher sua anamnese.
          </p>
        </header>

        <WelcomeVideo />

        <Button full size="lg" iconRight={ArrowRight} onClick={() => setVideoWatched(true)}>
          Iniciar minha anamnese
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-8">
      {/* Abertura editorial */}
      <header className="rise pt-2">
        <Pill tone="leaf" icon={FileText}>
          Etapa 0 · Admissão
        </Pill>
        <h2 className="mt-4 text-[30px] leading-[1.15]">
          Sua anamnese
          <br />
          ayurvédica
        </h2>
        <p className="mt-3 max-w-[44ch] text-[14.5px] leading-relaxed text-ink-2">
          {sections.length} blocos curtos que substituem a consulta inicial. Responda no seu ritmo
          — tudo é salvo sozinho, e você pode parar e voltar quando quiser.
        </p>
      </header>

      {/* Estado geral */}
      <Card className="rise space-y-4" style={{ animationDelay: '60ms' }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Progresso</p>
            <p className="mt-1.5 font-display text-[28px] leading-none text-ink">
              <span className="tnum">{Math.round(overall.percent)}</span>
              <span className="text-[18px] text-ink-3">%</span>
            </p>
          </div>
          <p className="tnum pb-1 text-[12.5px] text-ink-3">
            {overall.done} de {overall.total} respostas
          </p>
        </div>

        <Progress value={overall.percent} label="Progresso total da anamnese" />

        {anamnese.completed ? (
          <div className="flex items-start gap-2.5 rounded-field bg-leaf-50 px-3.5 py-3 text-[13px] leading-relaxed text-leaf-800">
            <Check className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
            <span>
              Anamnese enviada para a Ana. Você ainda pode revisar e ajustar qualquer bloco.
            </span>
          </div>
        ) : (
          <Button
            full
            size="lg"
            iconRight={ArrowRight}
            onClick={() => goTo(nextIndex === -1 ? 0 : nextIndex)}
          >
            {overall.done === 0 ? 'Começar anamnese' : 'Continuar de onde parei'}
          </Button>
        )}
      </Card>

      {/* Convite para o acompanhamento emocional, após a entrega */}
      {anamnese.completed && <EmocoesUpsell />}

      {/* Blocos */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Questionário"
          title={`Os ${sections.length} blocos`}
          hint="Cada bloco leva de 1 a 3 minutos."
        />

        <ul className="space-y-2">
          {sections.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            const prog = sectionProgress(s, answers);
            const complete = prog.percent === 100 && prog.total > 0;
            const started = prog.done > 0;

            return (
              <li key={s.id} className="rise" style={{ animationDelay: `${80 + i * 35}ms` }}>
                <button
                  onClick={() => goTo(i)}
                  className="tap press card flex w-full items-center gap-4 p-4 text-left hover:border-leaf-300"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      complete
                        ? 'bg-leaf-600 text-white'
                        : started
                          ? 'bg-leaf-50 text-leaf-600'
                          : 'bg-canvas text-ink-3'
                    }`}
                  >
                    {complete ? (
                      <Check className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[15px] font-semibold text-ink">{s.title}</span>
                      {s.optional && (
                        <span className="shrink-0 text-[10.5px] font-semibold uppercase tracking-wide text-ink-3">
                          Opcional
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-[12.5px] text-ink-3">
                      {complete
                        ? 'Concluído'
                        : started
                          ? `${prog.done} de ${prog.total} respondidas`
                          : s.purpose}
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
      </section>

      {/* Exames laboratoriais */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Complemento"
          title="Exames de sangue"
          hint="Vitamina D3, B12, ferritina e zinco ajudam a Ana a ler seu terreno."
        />
        <button
          onClick={onOpenExams}
          className="tap press card flex w-full items-center gap-4 p-4 text-left hover:border-leaf-300"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-50 text-ochre-600">
            <CloudUpload className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-ink">Anexar laudos</span>
            <span className="mt-0.5 block text-[12.5px] text-ink-3">
              {labExams.length > 0
                ? `${labExams.length} ${labExams.length === 1 ? 'arquivo enviado' : 'arquivos enviados'}`
                : 'Nenhum arquivo ainda · PDF ou foto'}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={2} aria-hidden="true" />
        </button>
      </section>

      {/* Confidencialidade */}
      <div className="flex items-start gap-3 rounded-card border border-line bg-canvas-2 px-4 py-3.5">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-[12.5px] leading-relaxed text-ink-2">
          Suas respostas são dados sensíveis de saúde. Apenas você e Ana Carla Nesi têm acesso,
          conforme a LGPD (Art. 5º, II).
        </p>
      </div>

      {!anamnese.completed && overall.percent > 0 && (
        <div className="flex items-center justify-center gap-2 text-[12.5px] text-ink-3">
          <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
          Rascunho salvo automaticamente
        </div>
      )}
    </div>
  );
};
