import React, { useState, useEffect, useRef } from 'react';
import { Download, X, Share, Plus, Check } from 'lucide-react';
import { Button, Logo } from '../ui/Primitives';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STEPS = [
  { icon: Share, text: 'Toque no botão Compartilhar na barra do Safari.' },
  { icon: Plus, text: 'Role a lista e escolha “Adicionar à Tela de Início”.' },
  { icon: Check, text: 'Confirme em “Adicionar”. Pronto.' }
];

export const PWAInstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setInstalled(
      window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
    setIsIOS(/iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Esc fecha a folha; o foco vai para o botão de fechar (escape-routes)
  useEffect(() => {
    if (!showSheet) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowSheet(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showSheet]);

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setDeferred(null);
      }
    } else if (isIOS) {
      setShowSheet(true);
    }
  };

  if (installed || (!deferred && !isIOS)) return null;

  return (
    <>
      <button
        onClick={install}
        aria-label="Instalar o aplicativo Pacificar"
        className="tap press flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2 text-[12px] font-semibold text-ink-2 hover:border-leaf-300"
      >
        <Download className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        <span className="hidden sm:inline">Instalar</span>
      </button>

      {showSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-leaf-900/45 p-4 backdrop-blur-sm sm:items-center"
          onClick={e => e.target === e.currentTarget && setShowSheet(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-title"
            className="rise w-full max-w-sm space-y-5 rounded-bloom border border-line bg-surface p-6 shadow-leaf-lg"
          >
            <header className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Logo className="h-10 w-10" />
                <div>
                  <h3 id="pwa-title" className="text-[17px] leading-tight">
                    Instalar no iPhone
                  </h3>
                  <p className="mt-0.5 text-[12.5px] text-ink-3">Acesso em um toque</p>
                </div>
              </div>
              <button
                ref={closeRef}
                onClick={() => setShowSheet(false)}
                aria-label="Fechar"
                className="tap press -mr-2 -mt-2 flex items-center justify-center rounded-full text-ink-3 hover:bg-canvas hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </header>

            <ol className="space-y-2.5">
              {STEPS.map(({ icon: Icon, text }, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-field border border-line bg-canvas p-3.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white">
                    <Icon className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <span className="text-[13px] leading-relaxed text-ink-2">{text}</span>
                </li>
              ))}
            </ol>

            <Button full size="lg" onClick={() => setShowSheet(false)}>
              Entendi
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
