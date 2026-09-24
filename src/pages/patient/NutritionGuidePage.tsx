import React, { useMemo, useState } from 'react';
import {
  NUTRITION_GUIDELINES,
  MASSALAS_DATA,
  RECIPES_DATABASE,
  LABEL_TRAPS
} from '../../data/nutritionData';
import { SHOPPING_GROUPS } from '../../data/shoppingList';
import { Card, EmptyState, Pill, SectionTitle, inputClass } from '../../components/ui/Primitives';
import {
  Search,
  Clock,
  ChevronDown,
  Wheat,
  Milk,
  Candy,
  Wine,
  Carrot,
  Droplet,
  Egg,
  Leaf,
  Flame,
  Sparkles,
  Wrench,
  X,
  ShieldAlert,
  SearchX
} from 'lucide-react';

type Tab = 'guia' | 'lista' | 'massalas' | 'receitas' | 'rotulos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'guia', label: 'Guia' },
  { id: 'lista', label: 'Lista' },
  { id: 'massalas', label: 'Massalas' },
  { id: 'receitas', label: 'Receitas' },
  { id: 'rotulos', label: 'Rótulos' }
];

/** Ícones vetoriais no lugar dos emojis vindos dos dados. */
const RESTRICTED_ICONS = [Wheat, Milk, Candy, Wine];
const ALLOWED_ICONS = [Carrot, Droplet, Egg, Leaf];
const GROUP_ICONS: Record<string, React.ElementType> = {
  leaf: Leaf,
  flame: Flame,
  sparkles: Sparkles,
  wheat: Wheat,
  droplet: Droplet,
  tool: Wrench
};

/** Bloco expansível reutilizável — divulgação progressiva. */
const Disclosure: React.FC<{
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ElementType;
  tone?: 'leaf' | 'clay' | 'ochre';
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, subtitle, icon: Icon, tone = 'leaf', children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const tones = {
    leaf: 'bg-leaf-50 text-leaf-600',
    clay: 'bg-clay-50 text-clay-500',
    ochre: 'bg-ochre-50 text-ochre-600'
  };

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="tap press flex w-full items-center gap-3.5 p-4 text-left"
      >
        {Icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tones[tone]}`}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold leading-snug text-ink">{title}</span>
          {subtitle && (
            <span className="mt-0.5 block text-[12.5px] leading-snug text-ink-3">{subtitle}</span>
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

      {open && <div className="rise border-t border-line-soft px-4 pb-4 pt-4">{children}</div>}
    </div>
  );
};

export const NutritionGuidePage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('guia');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(RECIPES_DATABASE.map(r => r.category)))],
    []
  );

  const recipes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RECIPES_DATABASE.filter(r => {
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q));
      return matchesQuery && (category === 'all' || r.category === category);
    });
  }, [query, category]);

  const recipe = RECIPES_DATABASE.find(r => r.id === openRecipe);

  return (
    <div className="space-y-7 pb-8">
      <header className="rise">
        <p className="eyebrow">Biblioteca</p>
        <h2 className="mt-2 text-[30px] leading-[1.15]">Comida de verdade</h2>
        <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-ink-2">
          O que entra, o que sai, os temperos que acendem o Agni e as armadilhas escondidas nos
          rótulos.
        </p>
      </header>

      {/* Navegação secundária — role horizontal em telas pequenas */}
      <div
        role="tablist"
        aria-label="Seções do guia nutricional"
        className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5"
      >
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`tap press shrink-0 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold ${
              tab === t.id
                ? 'border-leaf-600 bg-leaf-600 text-white'
                : 'border-line bg-surface text-ink-2 hover:border-leaf-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Guia: eliminar × priorizar ─────────────────────────── */}
      {tab === 'guia' && (
        <div className="space-y-7">
          <section className="space-y-3">
            <SectionTitle
              eyebrow="Sai do prato"
              title="As quatro eliminações"
              hint="Toque em cada uma para entender o mecanismo fisiológico."
            />
            {NUTRITION_GUIDELINES.restricted.map((item, i) => {
              const Icon = RESTRICTED_ICONS[i] ?? ShieldAlert;
              return (
                <Disclosure
                  key={item.category}
                  icon={Icon}
                  tone="clay"
                  title={item.category}
                  subtitle="Ver o que evitar e por quê"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="eyebrow mb-1.5">Onde aparece</p>
                      <p className="text-[13.5px] leading-relaxed text-ink-2">{item.examples}</p>
                    </div>
                    <div className="rounded-field bg-clay-50 px-4 py-3">
                      <p className="eyebrow mb-1.5 text-clay-600">Por que sai</p>
                      <p className="text-[13px] leading-relaxed text-ink-2">{item.reason}</p>
                    </div>
                  </div>
                </Disclosure>
              );
            })}
          </section>

          <section className="space-y-3">
            <SectionTitle
              eyebrow="Entra no prato"
              title="A base nutritiva"
              hint="Regional, acessível e anti-inflamatória."
            />
            {NUTRITION_GUIDELINES.allowed.map((item, i) => {
              const Icon = ALLOWED_ICONS[i] ?? Leaf;
              return (
                <Disclosure
                  key={item.category}
                  icon={Icon}
                  tone="leaf"
                  title={item.category}
                  subtitle="Ver exemplos e como preparar"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="eyebrow mb-1.5">Exemplos</p>
                      <p className="text-[13.5px] leading-relaxed text-ink-2">{item.examples}</p>
                    </div>
                    <div className="rounded-field bg-leaf-50 px-4 py-3">
                      <p className="eyebrow mb-1.5 text-leaf-700">Dica da Ana</p>
                      <p className="text-[13px] leading-relaxed text-ink-2">{item.tip}</p>
                    </div>
                  </div>
                </Disclosure>
              );
            })}
          </section>
        </div>
      )}

      {/* ── Lista de compras ───────────────────────────────────── */}
      {tab === 'lista' && (
        <div className="space-y-5">
          <Card className="border-ochre-200 bg-ochre-50/60">
            <p className="text-[13.5px] leading-relaxed text-ink-2">
              <strong className="font-semibold text-ink">Antes do Dia 1.</strong> Tenha estes itens
              em casa para não improvisar no meio da jornada. Nada aqui é caro ou raro.
            </p>
          </Card>

          {SHOPPING_GROUPS.map(group => {
            const Icon = GROUP_ICONS[group.icon] ?? Leaf;
            return (
              <section key={group.id} className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                    <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="text-[17px] leading-tight">{group.title}</h3>
                </div>

                {group.note && (
                  <p className="px-1 text-[12.5px] leading-relaxed text-ink-3">{group.note}</p>
                )}

                <ul className="card divide-y divide-line-soft" role="list">
                  {group.items.map(item => (
                    <li key={item.name} className="px-4 py-3">
                      <p className="text-[14px] font-medium text-ink">{item.name}</p>
                      {item.detail && (
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
                          {item.detail}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {/* ── Massalas ───────────────────────────────────────────── */}
      {tab === 'massalas' && (
        <div className="space-y-3">
          <SectionTitle
            eyebrow="Temperos terapêuticos"
            title="As três massalas"
            hint="Uma colher de chá de cada especiaria, misturada e guardada em vidro."
          />
          {MASSALAS_DATA.map(massala => (
            <Disclosure
              key={massala.name}
              icon={Flame}
              tone="ochre"
              title={massala.name}
              subtitle={massala.targetDosha}
            >
              <div className="space-y-4">
                <p className="text-[13.5px] leading-relaxed text-ink-2">{massala.description}</p>

                <div>
                  <p className="eyebrow mb-2">Ingredientes</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {massala.ingredients.map(ing => (
                      <li key={ing}>
                        <Pill tone="ochre">{ing}</Pill>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-field bg-canvas px-4 py-3">
                  <p className="eyebrow mb-1.5">Como preparar</p>
                  <p className="text-[13px] leading-relaxed text-ink-2">{massala.instructions}</p>
                </div>
              </div>
            </Disclosure>
          ))}
        </div>
      )}

      {/* ── Receitas ───────────────────────────────────────────── */}
      {tab === 'receitas' && (
        <div className="space-y-4">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
              strokeWidth={2}
              aria-hidden="true"
            />
            <label htmlFor="recipe-search" className="sr-only">
              Buscar receitas
            </label>
            <input
              id="recipe-search"
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar por nome, ingrediente ou benefício"
              className={`${inputClass} pl-11`}
            />
          </div>

          <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={`press shrink-0 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold ${
                  category === cat
                    ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                    : 'border-line bg-surface text-ink-3 hover:border-leaf-200'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>

          {recipes.length === 0 ? (
            <Card>
              <EmptyState
                icon={SearchX}
                title="Nenhuma receita encontrada"
                description="Tente outro termo ou limpe o filtro de categoria para ver tudo."
              />
            </Card>
          ) : (
            <ul className="space-y-2.5">
              {recipes.map(r => (
                <li key={r.id}>
                  <button
                    onClick={() => setOpenRecipe(r.id)}
                    className="tap press card w-full p-4 text-left hover:border-leaf-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-[15px] font-semibold leading-snug text-ink">{r.title}</h4>
                      <span className="tnum inline-flex shrink-0 items-center gap-1 text-[11.5px] font-semibold text-ink-3">
                        <Clock className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                        {r.prepTime}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{r.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.tags.slice(0, 3).map(t => (
                        <Pill key={t} tone="leaf">
                          {t}
                        </Pill>
                      ))}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Rótulos ────────────────────────────────────────────── */}
      {tab === 'rotulos' && (
        <div className="space-y-3">
          <SectionTitle
            eyebrow="Perigos ocultos"
            title="Como ler um rótulo"
            hint="Quatro nomes que escondem glúten, leite, açúcar e gordura inflamatória."
          />
          {LABEL_TRAPS.map(trap => (
            <Disclosure
              key={trap.hiddenName}
              icon={ShieldAlert}
              tone="clay"
              title={trap.hiddenName}
              subtitle={trap.category}
            >
              <div className="space-y-3">
                <div>
                  <p className="eyebrow mb-1.5">O que realmente é</p>
                  <p className="text-[13.5px] leading-relaxed text-ink-2">{trap.realSource}</p>
                </div>
                <div>
                  <p className="eyebrow mb-1.5">Onde se esconde</p>
                  <p className="text-[13.5px] leading-relaxed text-ink-2">{trap.foundIn}</p>
                </div>
                <div className="rounded-field bg-leaf-50 px-4 py-3">
                  <p className="eyebrow mb-1.5 text-leaf-700">Troque por</p>
                  <p className="text-[13px] leading-relaxed text-ink-2">{trap.cleanAlternative}</p>
                </div>
              </div>
            </Disclosure>
          ))}
        </div>
      )}

      {/* ── Folha de receita ───────────────────────────────────── */}
      {recipe && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-leaf-900/45 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={e => e.target === e.currentTarget && setOpenRecipe(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-title"
            className="rise max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-bloom border border-line bg-surface sm:rounded-bloom"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
              <div className="min-w-0">
                <p className="eyebrow">{recipe.category}</p>
                <h3 id="recipe-title" className="mt-1 text-[20px] leading-snug">
                  {recipe.title}
                </h3>
              </div>
              <button
                onClick={() => setOpenRecipe(null)}
                aria-label="Fechar receita"
                className="tap press -mr-2 -mt-1 flex items-center justify-center rounded-full text-ink-3 hover:bg-canvas hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-6 px-5 py-5">
              <p className="text-[14px] leading-relaxed text-ink-2">{recipe.description}</p>

              <Pill tone="neutral" icon={Clock}>
                {recipe.prepTime}
              </Pill>

              <section>
                <p className="eyebrow mb-2.5">Ingredientes</p>
                <ul className="space-y-1.5">
                  {recipe.ingredients.map(ing => (
                    <li key={ing} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-leaf-400"
                        aria-hidden="true"
                      />
                      {ing}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <p className="eyebrow mb-2.5">Modo de preparo</p>
                <ol className="space-y-3">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="tnum flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-[12px] font-bold text-leaf-700">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-[13.5px] leading-relaxed text-ink-2">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="rounded-card bg-leaf-50 px-4 py-4">
                <p className="eyebrow mb-1.5 text-leaf-700">Leitura ayurvédica</p>
                <p className="text-[13px] leading-relaxed text-ink-2">{recipe.ayurvedicBenefits}</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
