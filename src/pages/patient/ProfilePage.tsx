import React from 'react';
import { useApp } from '../../context/AppContext';
import { MeusDadosSection } from './MeusDadosSection';
import { Button, Card, EmptyState, Pill, SectionTitle } from '../../components/ui/Primitives';
import {
  ClipboardList,
  FileText,
  LineChart,
  ChevronRight,
  Leaf,
  Droplet,
  Sparkles,
  CupSoda,
  Quote,
  FileX2,
  RotateCcw,
  Check,
  Flower2
} from 'lucide-react';

interface ProfilePageProps {
  onOpenAnamnese: () => void;
  onOpenExams: () => void;
  onOpenReport: (week: number) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenAnamnese,
  onOpenExams,
  onOpenReport
}) => {
  const { currentUser, prescription, anamnese, labExams, checkins, resetToDefaultData, userId } =
    useApp();

  const initials = (currentUser?.full_name ?? 'P')
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const unlockedWeeks = [1, 2, 3].filter(w => checkins.length >= w * 7);

  return (
    <div className="space-y-7 pb-8">
      {/* ── Identidade ────────────────────────────────────────── */}
      <header className="rise flex items-center gap-4 pt-2">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-leaf-600 font-display text-[22px] font-semibold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-[24px] leading-tight">{currentUser?.full_name}</h2>
          <p className="mt-1 truncate text-[13px] text-ink-3">{currentUser?.email}</p>
        </div>
      </header>

      {/* ── Números da jornada ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: currentUser?.current_day ?? 1, label: 'Dia atual' },
          { value: checkins.length, label: 'Check-ins' },
          { value: `${currentUser?.weight ?? '—'} kg`, label: 'Peso' }
        ].map(stat => (
          <Card key={stat.label} className="px-3 py-4 text-center">
            <p className="tnum font-display text-[24px] leading-none text-ink">{stat.value}</p>
            <p className="mt-1.5 text-[12px] leading-tight text-ink-3">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* ── Admissão ──────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle eyebrow="Admissão" title="Seus documentos" />

        <ul className="space-y-2">
          {[
            {
              icon: ClipboardList,
              title: 'Anamnese ayurvédica',
              desc: anamnese.completed ? 'Enviada para a Ana' : 'Ainda em rascunho',
              done: anamnese.completed,
              onClick: onOpenAnamnese
            },
            {
              icon: FileText,
              title: 'Exames de sangue',
              desc:
                labExams.length > 0
                  ? `${labExams.length} ${labExams.length === 1 ? 'laudo anexado' : 'laudos anexados'}`
                  : 'Nenhum laudo anexado',
              done: labExams.length > 0,
              onClick: onOpenExams
            }
          ].map(item => {
            const Icon = item.icon;
            return (
              <li key={item.title}>
                <button
                  onClick={item.onClick}
                  className="tap press card flex w-full items-center gap-4 p-4 text-left hover:border-leaf-300"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      item.done ? 'bg-leaf-600 text-white' : 'bg-canvas text-ink-3'
                    }`}
                  >
                    {item.done ? (
                      <Check className="h-[18px] w-[18px]" strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-[12.5px] text-ink-3">{item.desc}</span>
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

      {/* ── Relatórios ────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Evolução"
          title="Relatórios semanais"
          hint="Liberados nos dias 7, 14 e 21."
        />

        {unlockedWeeks.length === 0 ? (
          <Card>
            <EmptyState
              icon={LineChart}
              title="Nenhum relatório ainda"
              description="Complete sete check-ins para o primeiro gráfico de correlação aparecer aqui."
            />
          </Card>
        ) : (
          <ul className="space-y-2">
            {unlockedWeeks.map(week => (
              <li key={week}>
                <button
                  onClick={() => onOpenReport(week)}
                  className="tap press card flex w-full items-center gap-4 p-4 text-left hover:border-leaf-300"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-50 text-ochre-600">
                    <LineChart className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-ink">Semana {week}</span>
                    <span className="mt-0.5 block text-[12.5px] text-ink-3">
                      {week === 1
                        ? 'Reset e desinchaço'
                        : week === 2
                          ? 'Agni e vitalidade'
                          : 'Transformação consolidada'}
                    </span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-ink-3"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Prescrição ────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Prescrição"
          title="O que a Ana indicou para você"
          hint="Personalizado a partir da sua anamnese e dos seus exames."
        />

        {!prescription ? (
          <Card>
            <EmptyState
              icon={Flower2}
              title="Prescrição em preparo"
              description="Assim que a Ana revisar sua anamnese, sua massala, aromaterapia e suplementos aparecem aqui."
            />
          </Card>
        ) : (
          <div className="space-y-2">
            <Card className="space-y-4">
              <div className="flex items-start gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                  <Leaf className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="eyebrow">Constituição predominante</p>
                  <p className="mt-1 font-display text-[22px] leading-tight text-ink">
                    {prescription.dosha_predominant}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                    Massala indicada: {prescription.massala_recommended}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Droplet className="h-4 w-4 shrink-0 text-ochre-600" strokeWidth={1.8} aria-hidden="true" />
                <p className="eyebrow">Aromaterapia</p>
              </div>
              <p className="text-[13px] leading-relaxed text-ink-2">
                Óleo carreador: <strong className="font-semibold text-ink">{prescription.carrier_oil}</strong>
              </p>
              <ul className="space-y-1.5">
                {prescription.aromatherapy_oils.map(oil => (
                  <li key={oil} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ochre-400"
                      aria-hidden="true"
                    />
                    {oil}
                  </li>
                ))}
              </ul>
            </Card>

            {prescription.supplements_recommended.length > 0 && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-leaf-600" strokeWidth={1.8} aria-hidden="true" />
                  <p className="eyebrow">Suplementação</p>
                </div>
                <ul className="divide-y divide-line-soft">
                  {prescription.supplements_recommended.map(supp => (
                    <li key={supp.name} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                        <p className="text-[14px] font-semibold text-ink">{supp.name}</p>
                        <p className="tnum text-[12.5px] font-semibold text-leaf-700 sm:text-right">
                          {supp.dosage}
                        </p>
                      </div>
                      <p className="mt-1 text-[12.5px] text-ink-3">{supp.timing}</p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
                        {supp.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {prescription.therapeutic_teas.length > 0 && (
              <Card className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <CupSoda className="h-4 w-4 shrink-0 text-leaf-600" strokeWidth={1.8} aria-hidden="true" />
                  <p className="eyebrow">Chás terapêuticos</p>
                </div>
                <ul className="space-y-1.5">
                  {prescription.therapeutic_teas.map(tea => (
                    <li key={tea} className="flex gap-2.5 text-[13px] leading-relaxed text-ink-2">
                      <span
                        className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-leaf-400"
                        aria-hidden="true"
                      />
                      {tea}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {prescription.therapist_notes && (
              <Card className="bg-leaf-50/60">
                <Quote className="mb-2.5 h-4 w-4 text-leaf-500" strokeWidth={1.8} aria-hidden="true" />
                <p className="font-display text-[15px] italic leading-relaxed text-ink-2">
                  {prescription.therapist_notes}
                </p>
                <p className="mt-3 text-[12px] font-semibold text-ink-3">
                  Ana Carla Nesi · CRP 17/2833
                </p>
              </Card>
            )}
          </div>
        )}
      </section>

      {/* ── Seus dados (LGPD) ou, na demonstração, reset dos dados de teste ── */}
      {userId ? (
        <MeusDadosSection userId={userId} />
      ) : (
      <section className="space-y-3 border-t border-line pt-6">
        <SectionTitle eyebrow="Demonstração" title="Dados de teste" />
        <Card className="flex items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canvas text-ink-3">
            <RotateCcw className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-ink">Restaurar dados iniciais</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
              Apaga check-ins, anamnese e registros deste navegador.
            </p>
          </div>
          <Button
            variant="danger"
            icon={FileX2}
            onClick={() => {
              if (window.confirm('Isto apaga todos os registros deste navegador. Continuar?')) {
                resetToDefaultData();
              }
            }}
          >
            Limpar
          </Button>
        </Card>
      </section>
      )}
    </div>
  );
};
