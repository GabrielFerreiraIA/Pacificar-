import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import { Card, EmptyState, Pill, SectionTitle } from '../../components/ui/Primitives';
import { ArrowLeft, LineChart as LineChartIcon, Quote, Table2 } from 'lucide-react';

/**
 * Tema categórico das séries — ordem fixa, nunca ciclada.
 * Validado com scripts/validate_palette.js (light, superfície #ffffff):
 * banda de luminosidade, croma, separação CVD, piso de visão normal e contraste — todos PASS.
 */
const SERIES = {
  leaf: '#3e8a5e',
  lunar: '#6062a8',
  clay: '#ba3c3c'
} as const;

const AXIS = '#6e7c75';
const GRID = '#f0ede5';

const WEEK_INFO = {
  1: {
    name: 'Semana 1',
    range: 'Dias 1 a 7',
    theme: 'Desinflamação, eliminação de toxinas e desinchaço',
    note: 'Nos primeiros sete dias, a retirada estrita do glúten e do leite permite o fechamento das microfissuras da barreira intestinal. O sono profundo melhora em correlação direta com o ritual noturno nos pés e a ausência de álcool.'
  },
  2: {
    name: 'Semana 2',
    range: 'Dias 8 a 14',
    theme: 'Restauração do Agni, vitalidade e clareza mental',
    note: 'A ação contínua da zeólita em jejum e o uso diário das massalas terapêuticas reduzem a letargia pós-refeição. A vitalidade matinal costuma subir de forma consistente nesta fase.'
  },
  3: {
    name: 'Semana 3',
    range: 'Dias 15 a 21',
    theme: 'Consolidação de hábitos, quelação e autonomia',
    note: 'O terreno biológico está purificado e o paladar requalificado para a comida de verdade. A manutenção com zeólita por 120 dias e a desparasitação lunar sustentam esta conquista.'
  }
} as const;

/** Tooltip próprio — nunca herda o estilo padrão cinza do Recharts. */
const ChartTooltip: React.FC<{
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-field border border-line bg-surface px-3 py-2.5 shadow-leaf">
      <p className="mb-1.5 text-[11.5px] font-bold text-ink">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} className="flex items-center gap-2 text-[12px] text-ink-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: entry.color }}
            aria-hidden="true"
          />
          {entry.name}
          <span className="tnum ml-auto pl-3 font-semibold text-ink">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const chartAxisProps = {
  stroke: AXIS,
  fontSize: 11,
  tickLine: false,
  axisLine: false
};

interface WeeklyReportPageProps {
  initialWeek?: number;
  onBack?: () => void;
}

export const WeeklyReportPage: React.FC<WeeklyReportPageProps> = ({ initialWeek = 1, onBack }) => {
  const { checkins, currentUser } = useApp();
  const [week, setWeek] = useState(initialWeek);
  const [showTable, setShowTable] = useState(false);

  const maxDay = week * 7;
  const info = WEEK_INFO[week as 1 | 2 | 3];

  /** Somente check-ins reais — nada de dados inventados no gráfico clínico. */
  const data = useMemo(
    () =>
      checkins
        .filter(c => c.day_number <= maxDay)
        .sort((a, b) => a.day_number - b.day_number)
        .map(c => ({
          day: `D${c.day_number}`,
          bristol: c.bristol_type,
          energia: c.energy_rating,
          sono: c.sleep_quality,
          inchaco: c.bloating_level,
          fissura: c.sweet_craving
        })),
    [checkins, maxDay]
  );

  /** Métricas calculadas dos dados reais — nada fixo no código. */
  const stats = useMemo(() => {
    if (data.length === 0) return null;
    const first = data[0];
    const last = data[data.length - 1];
    const avg = (key: keyof (typeof data)[0]) =>
      data.reduce((sum, d) => sum + Number(d[key]), 0) / data.length;

    const bloatingChange =
      !first.inchaco ? 0 : Math.round(((last.inchaco - first.inchaco) / first.inchaco) * 100);

    return {
      bristol: last.bristol,
      bristolIdeal: data.filter(d => d.bristol === 4).length,
      energia: avg('energia').toFixed(1),
      bloatingChange
    };
  }, [data]);

  return (
    <div className="space-y-7 pb-8">
      {onBack && (
        <button
          onClick={onBack}
          className="tap press -ml-2 flex items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-semibold text-ink-2 hover:bg-line-soft"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          Voltar
        </button>
      )}

      <header className="rise">
        <p className="eyebrow">Relatório de correlação</p>
        <h2 className="mt-2 text-[30px] leading-[1.15]">
          {info.name}
          <span className="block text-[19px] text-ink-3">{info.range}</span>
        </h2>
        <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">{info.theme}</p>
        {currentUser && (
          <p className="mt-3">
            <Pill>{currentUser.full_name}</Pill>
          </p>
        )}
      </header>

      <div role="tablist" aria-label="Selecionar semana" className="grid grid-cols-3 gap-1.5">
        {[1, 2, 3].map(w => (
          <button
            key={w}
            role="tab"
            aria-selected={week === w}
            onClick={() => setWeek(w)}
            className={`tap press rounded-field border py-2.5 text-[13px] font-semibold ${
              week === w
                ? 'border-leaf-600 bg-leaf-600 text-white'
                : 'border-line bg-surface text-ink-2 hover:border-leaf-300'
            }`}
          >
            Semana {w}
          </button>
        ))}
      </div>

      {data.length === 0 ? (
        <Card>
          <EmptyState
            icon={LineChartIcon}
            title="Ainda sem dados desta semana"
            description="Os gráficos aparecem assim que você registrar os check-ins noturnos deste período."
          />
        </Card>
      ) : (
        <>
          {/* ── Números do período ────────────────────────────── */}
          {stats && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: `Tipo ${stats.bristol}`, label: 'Bristol atual' },
                { value: `${stats.energia}`, label: 'Energia média (1–5)' },
                {
                  value: `${stats.bloatingChange > 0 ? '+' : ''}${stats.bloatingChange}%`,
                  label: 'Variação do inchaço'
                }
              ].map(stat => (
                <Card key={stat.label} className="px-3 py-4 text-center">
                  <p className="tnum font-display text-[21px] leading-none text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-tight text-ink-3">{stat.label}</p>
                </Card>
              ))}
            </div>
          )}

          {/* ── Bristol ───────────────────────────────────────── */}
          <section className="space-y-3">
            <SectionTitle
              eyebrow="Digestão"
              title="Evolução da Escala de Bristol"
              hint="A linha tracejada marca o Tipo 4 — o equilíbrio ayurvédico."
            />
            <Card padded={false} className="p-4 pl-1">
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="day" {...chartAxisProps} />
                  <YAxis domain={[1, 7]} ticks={[1, 3, 5, 7]} width={28} {...chartAxisProps} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: GRID, strokeWidth: 2 }} />
                  <ReferenceLine
                    y={4}
                    stroke={AXIS}
                    strokeDasharray="4 4"
                    label={{ value: 'Ideal', position: 'right', fill: AXIS, fontSize: 10 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bristol"
                    name="Bristol"
                    stroke={SERIES.leaf}
                    strokeWidth={2}
                    dot={{ r: 4, fill: SERIES.leaf, stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </section>

          {/* ── Energia × Sono ────────────────────────────────── */}
          <section className="space-y-3">
            <SectionTitle
              eyebrow="Vitalidade"
              title="Energia e sono"
              hint="Ambos na mesma escala de 1 a 5."
            />
            <Card padded={false} className="p-4 pl-1">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradEnergia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SERIES.leaf} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={SERIES.leaf} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradSono" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SERIES.lunar} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={SERIES.lunar} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="day" {...chartAxisProps} />
                  <YAxis domain={[0, 5]} ticks={[1, 3, 5]} width={28} {...chartAxisProps} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: GRID, strokeWidth: 2 }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: AXIS, paddingTop: 8 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="energia"
                    name="Energia"
                    stroke={SERIES.leaf}
                    strokeWidth={2}
                    fill="url(#gradEnergia)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sono"
                    name="Sono"
                    stroke={SERIES.lunar}
                    strokeWidth={2}
                    fill="url(#gradSono)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </section>

          {/* ── Inchaço × fissura ─────────────────────────────── */}
          <section className="space-y-3">
            <SectionTitle
              eyebrow="Sintomas"
              title="Inchaço e vontade de doce"
              hint="Quanto mais baixas as barras, melhor."
            />
            <Card padded={false} className="p-4 pl-1">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={2}>
                  <CartesianGrid stroke={GRID} vertical={false} />
                  <XAxis dataKey="day" {...chartAxisProps} />
                  <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} width={28} {...chartAxisProps} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: GRID, fillOpacity: 0.6 }} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: AXIS, paddingTop: 8 }}
                  />
                  <Bar dataKey="inchaco" name="Inchaço" fill={SERIES.clay} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fissura" name="Fissura" fill={SERIES.lunar} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>

          {/* ── Alternativa em tabela (acessibilidade) ────────── */}
          <section className="space-y-3">
            <button
              onClick={() => setShowTable(v => !v)}
              aria-expanded={showTable}
              className="tap press inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-ink-2 hover:border-leaf-300"
            >
              <Table2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {showTable ? 'Ocultar tabela' : 'Ver os dados em tabela'}
            </button>

            {showTable && (
              <Card padded={false} className="rise overflow-x-auto">
                <table className="w-full min-w-[420px] text-left">
                  <caption className="sr-only">
                    Registros diários de {info.name}: Bristol, energia, sono, inchaço e fissura.
                  </caption>
                  <thead>
                    <tr className="border-b border-line">
                      {['Dia', 'Bristol', 'Energia', 'Sono', 'Inchaço', 'Fissura'].map(h => (
                        <th
                          key={h}
                          scope="col"
                          className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wide text-ink-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {data.map(row => (
                      <tr key={row.day}>
                        <th
                          scope="row"
                          className="tnum px-4 py-2.5 text-[13px] font-semibold text-ink"
                        >
                          {row.day}
                        </th>
                        {[row.bristol, row.energia, row.sono, row.inchaco, row.fissura].map(
                          (v, i) => (
                            <td key={i} className="tnum px-4 py-2.5 text-[13px] text-ink-2">
                              {v}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </section>
        </>
      )}

      {/* ── Leitura da terapeuta ──────────────────────────────── */}
      <Card className="bg-leaf-50/60">
        <Quote className="mb-3 h-4 w-4 text-leaf-500" strokeWidth={1.8} aria-hidden="true" />
        <p className="font-display text-[15px] leading-relaxed text-ink-2">{info.note}</p>
        <p className="mt-4 text-[12px] font-semibold text-ink-3">Ana Carla Nesi · CRP 17/2833</p>
      </Card>
    </div>
  );
};
