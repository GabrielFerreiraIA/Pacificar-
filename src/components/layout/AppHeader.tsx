import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { Logo } from '../ui/Primitives';
import { ShieldCheck, User, ChevronDown, Check, CircleUser, Compass } from 'lucide-react';

interface AppHeaderProps {
  onNavigateToTab?: (tab: string) => void;
  onReplayTour?: () => void;
  activeTab?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onNavigateToTab, onReplayTour }) => {
  const { role, switchRole } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora ou pressionar Esc (escape-routes)
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <header className="pt-safe sticky top-0 z-40 border-b border-line/70 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Logo className="h-9 w-9 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display text-[17px] font-semibold leading-none tracking-tight text-ink">
              Pacificar
            </h1>
            <p className="mt-1 truncate text-[11.5px] leading-none text-ink-3">
              Ana Carla Nesi · CRP 17/2833
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <PWAInstallPrompt />

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={`Alternar visão. Atual: ${role === 'admin' ? 'terapeuta' : 'paciente'}`}
              className={`tap press flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-semibold ${
                role === 'admin'
                  ? 'border-ochre-200 bg-ochre-50 text-ochre-700'
                  : 'border-line bg-surface text-ink-2 hover:border-leaf-300'
              }`}
            >
              {role === 'admin' ? (
                <ShieldCheck className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              ) : (
                <User className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{role === 'admin' ? 'Terapeuta' : 'Paciente'}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-ink-3 transition-transform duration-200 ${
                  menuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="rise absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-card border border-line bg-surface p-1.5 shadow-leaf-lg"
              >
                {role !== 'admin' && (
                  <>
                    <p className="eyebrow px-3 pb-1.5 pt-2">Sua conta</p>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigateToTab?.('perfil');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-[13px] font-semibold text-ink-2 hover:bg-canvas"
                    >
                      <CircleUser className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                      Meu perfil e prescrição
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        onReplayTour?.();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-[13px] font-semibold text-ink-2 hover:bg-canvas"
                    >
                      <Compass className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                      <span className="flex-1 text-left">Rever a apresentação</span>
                      <kbd className="shrink-0 rounded border border-line bg-canvas px-1.5 py-0.5 font-sans text-[11px] font-bold text-ink-3">
                        ?
                      </kbd>
                    </button>
                    <hr className="my-1.5 border-line-soft" />
                  </>
                )}

                <p className="eyebrow px-3 pb-1.5 pt-2">Modo de demonstração</p>
                {(
                  [
                    { key: 'patient', label: 'Visão do paciente', icon: User, tab: 'hoje' },
                    { key: 'admin', label: 'Painel da terapeuta', icon: ShieldCheck, tab: 'admin' }
                  ] as const
                ).map(item => {
                  const active = role === item.key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      role="menuitemradio"
                      aria-checked={active}
                      onClick={() => {
                        switchRole(item.key);
                        setMenuOpen(false);
                        onNavigateToTab?.(item.tab);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-field px-3 py-2.5 text-[13px] font-semibold ${
                        active ? 'bg-leaf-50 text-leaf-800' : 'text-ink-2 hover:bg-canvas'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                        {item.label}
                      </span>
                      {active && <Check className="h-4 w-4 text-leaf-600" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
