import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PREPARO_ITEMS } from '../../data/preparoData';
import { Button, Card, Pill, Progress, SectionTitle } from '../../components/ui/Primitives';
import {
  Check,
  ChevronDown,
  Gem,
  Moon,
  Flame,
  Droplet,
  Leaf,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  ArrowRight,
  Info
} from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  scraper: Sparkles,
  gem: Gem,
  moon: Moon,
  flame: Flame,
  droplet: Droplet,
  leaf: Leaf
};

interface PreparoPageProps {
  onOpenNutrition: () => void;
  onStartJourney: () => void;
}

export const PreparoPage: React.FC<PreparoPageProps> = ({ onOpenNutrition, onStartJourney }) => {
  const { preparoChecked, togglePreparoItem } = useApp();
  const [openId, setOpenId] = useState<string | null>(PREPARO_ITEMS[0].id);

  const essentials = PREPARO_ITEMS.filter(i => i.essential);
  const essentialsDone = essentials.filter(i => preparoChecked.includes(i.id)).length;
  const ready = essentialsDone === essentials.length;

  return (
    <div className="space-y-7 pb-8">
      <header className="rise">
        <Pill tone="ochre">Comece aqui</Pill>
        <h2 className="mt-4 text-[30px] leading-[1.15]">
          Antes do
          <br />
          Dia 1
        </h2>
        <p className="mt-3 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
          Sete itens para ter em casa. Nada caro, nada raro — mas chegar no Dia 1 sem eles é a
          maior causa de abandono da jornada.
        </p>
      </header>

      {/* ── Progresso do preparo ──────────────────────────────── */}
      <Card className="rise space-y-4" style={{ animationDelay: '60ms' }}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Itens essenciais</p>
            <p className="mt-1.5 font-display text-[28px] leading-none text-ink">
              <span className="tnum">{essentialsDone}</span>
              <span className="text-[18px] text-ink-3"> / {essentials.length}</span>
            </p>
          </div>
          {ready && (
            <Pill tone="leaf" icon={Check}>
              Tudo pronto
            </Pill>
          )}
        </div>

        <Progress
          value={(essentialsDone / essentials.length) * 100}
          label="Progresso do preparo"
          tone={ready ? 'leaf' : 'ochre'}
        />

        {ready ? (
          <Button full size="lg" iconRight={ArrowRight} onClick={onStartJourney}>
            Começar meus 21 dias
          </Button>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink-2">
            Marque cada item conforme for conseguindo. Com os {essentials.length} essenciais em
            casa, você começa o Dia 1 sem precisar improvisar.
          </p>
        )}
      </Card>

      {/* ── Itens ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <SectionTitle
          eyebrow="Checklist"
          title="O que ter em casa"
          hint="Toque em um item para entender por que ele importa."
        />

        <ul className="space-y-2.5">
          {PREPARO_ITEMS.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Leaf;
            const done = preparoChecked.includes(item.id);
            const open = openId === item.id;

            return (
              <li
                key={item.id}
                className="rise card overflow-hidden"
                style={{ animationDelay: `${80 + i * 35}ms` }}
              >
                <div className="flex items-stretch">
                  {/* Marcar como comprado */}
                  <button
                    onClick={() => togglePreparoItem(item.id)}
                    aria-pressed={done}
                    aria-label={`${item.title}: ${done ? 'já tenho' : 'marcar como já tenho'}`}
                    className="tap press flex shrink-0 items-center pl-4 pr-1"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                        done ? 'border-leaf-600 bg-leaf-600' : 'border-line bg-surface'
                      }`}
                      aria-hidden="true"
                    >
                      {done && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />}
                    </span>
                  </button>

                  {/* Abrir detalhes */}
                  <button
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                    className="tap press flex min-w-0 flex-1 items-center gap-3 py-4 pl-2 pr-4 text-left"
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        done ? 'bg-leaf-50 text-leaf-600' : 'bg-canvas text-ink-3'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[14.5px] font-semibold leading-snug ${
                          done ? 'text-ink-3 line-through' : 'text-ink'
                        }`}
                      >
                        {item.title}
                      </span>
                      {!item.essential && (
                        <span className="mt-0.5 block text-[11.5px] font-semibold uppercase tracking-wide text-ink-3">
                          Opcional
                        </span>
                      )}
                    </span>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                      }`}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {open && (
                  <div className="rise space-y-3.5 border-t border-line-soft px-4 pb-4 pt-4">
                    <div>
                      <p className="eyebrow mb-1.5">O que é</p>
                      <p className="text-[13.5px] leading-relaxed text-ink-2">{item.what}</p>
                    </div>

                    {item.how && (
                      <div className="rounded-field bg-leaf-50 px-4 py-3">
                        <p className="eyebrow mb-1.5 text-leaf-700">Como usar</p>
                        <p className="text-[13px] leading-relaxed text-ink-2">{item.how}</p>
                      </div>
                    )}

                    {item.warning && (
                      <p className="flex items-start gap-2.5 rounded-field bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-ink-2">
                        <AlertTriangle
                          className="mt-0.5 h-4 w-4 shrink-0 text-clay-500"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        {item.warning}
                      </p>
                    )}

                    {/* Só vira botão quando existe link real */}
                    {item.buyUrl ? (
                      <a
                        href={item.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tap press inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[13px] font-semibold text-leaf-700 hover:border-leaf-300 hover:bg-leaf-50"
                      >
                        {item.buyLabel ?? 'Onde comprar'}
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </a>
                    ) : (
                      item.buyHint && (
                        <p className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink-3">
                          <Info
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          {item.buyHint}
                        </p>
                      )
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Ponte para a lista completa ───────────────────────── */}
      <Card className="flex items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
          <Leaf className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">Lista completa de compras</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
            Todas as ervas, especiarias e farinhas, item por item.
          </p>
        </div>
        <Button variant="secondary" onClick={onOpenNutrition}>
          Ver
        </Button>
      </Card>
    </div>
  );
};
