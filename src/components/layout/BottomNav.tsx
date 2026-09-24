import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sunrise, PackageCheck, Leaf, Moon, ClipboardList, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

/**
 * Navegação de nível superior. Máximo 5 destinos (Material: bottom-nav-limit),
 * sempre ícone + rótulo (nav-label-icon), estado atual sempre visível.
 */
export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { role, anamnese, preparoChecked } = useApp();

  const items = [
    { id: 'hoje', label: 'Hoje', icon: Sunrise },
    {
      id: 'preparo',
      label: 'Preparo',
      icon: PackageCheck,
      // Ponto de atenção enquanto o preparo não começou (tab-badge)
      dot: preparoChecked.length === 0
    },
    { id: 'nutricao', label: 'Nutrição', icon: Leaf },
    { id: 'protocolos', label: 'Protocolos', icon: Moon },
    role === 'admin'
      ? { id: 'admin', label: 'Clínica', icon: ShieldCheck }
      : { id: 'anamnese', label: 'Anamnese', icon: ClipboardList, dot: !anamnese.completed }
  ];

  return (
    <nav
      aria-label="Navegação principal"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-canvas/90 backdrop-blur-xl [@media(min-width:640px)and(min-height:640px)]:inset-x-auto [@media(min-width:640px)and(min-height:640px)]:bottom-5 [@media(min-width:640px)and(min-height:640px)]:left-1/2 [@media(min-width:640px)and(min-height:640px)]:w-auto [@media(min-width:640px)and(min-height:640px)]:-translate-x-1/2 [@media(min-width:640px)and(min-height:640px)]:rounded-full [@media(min-width:640px)and(min-height:640px)]:border [@media(min-width:640px)and(min-height:640px)]:border-line [@media(min-width:640px)and(min-height:640px)]:bg-surface [@media(min-width:640px)and(min-height:640px)]:px-2 [@media(min-width:640px)and(min-height:640px)]:pb-2 [@media(min-width:640px)and(min-height:640px)]:shadow-leaf-lg"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around px-1 pt-1.5">
        {items.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <li key={item.id} className="min-w-0 flex-1" data-tour={`nav-${item.id}`}>
              <button
                onClick={() => onSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                className="tap group relative flex w-full flex-col items-center gap-1 rounded-field px-1 py-1.5"
              >
                <span
                  className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 ${
                    active ? 'bg-leaf-100' : 'bg-transparent group-hover:bg-line-soft'
                  }`}
                >
                  <Icon
                    className={`h-[19px] w-[19px] transition-colors ${
                      active ? 'text-leaf-700' : 'text-ink-3'
                    }`}
                    strokeWidth={active ? 2.2 : 1.7}
                    aria-hidden="true"
                  />
                  {'dot' in item && item.dot && (
                    <span
                      className="absolute right-3 top-1 h-2 w-2 rounded-full bg-ochre-400 ring-2 ring-canvas"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span
                  className={`max-w-full truncate text-[10.5px] leading-none tracking-tight ${
                    active ? 'font-bold text-leaf-800' : 'font-medium text-ink-2'
                  }`}
                >
                  {item.label}
                  {'dot' in item && item.dot && <span className="sr-only"> (pendente)</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
