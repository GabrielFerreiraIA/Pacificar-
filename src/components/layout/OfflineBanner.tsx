import React, { useState, useEffect } from 'react';
import { CloudOff, TriangleAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, []);

  const { syncError, dismissSyncError, pendingSync } = useApp();
  const registros = pendingSync === 1 ? '1 registro' : `${pendingSync} registros`;

  // Falha ao salvar/carregar no servidor (T-14), com a internet aparentemente ligada
  if (isOnline && syncError) {
    return (
      <div role="alert" className="pt-safe sticky top-0 z-50 bg-clay-50 px-5 py-2.5">
        <div className="mx-auto flex max-w-3xl items-start gap-2.5">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-clay-600" strokeWidth={2} aria-hidden="true" />
          <p className="flex-1 text-[12.5px] font-semibold leading-relaxed text-clay-600">{syncError}</p>
          <button
            onClick={dismissSyncError}
            aria-label="Fechar aviso"
            className="tap -mr-2 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-clay-600 hover:bg-clay-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  if (isOnline && pendingSync > 0) {
    return (
      <div role="status" aria-live="polite" className="pt-safe sticky top-0 z-50 bg-leaf-50 px-5 py-2.5 text-center">
        <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-leaf-700">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
          Enviando {registros} feitos sem internet…
        </p>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pt-safe sticky top-0 z-50 bg-ochre-100 px-5 py-2.5 text-center"
    >
      <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-ochre-700">
        <CloudOff className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        {pendingSync > 0
          ? `Sem conexão · ${registros} guardados neste aparelho, enviamos quando a internet voltar`
          : 'Sem conexão · o que você registrar fica guardado e é enviado quando a internet voltar'}
      </p>
    </div>
  );
};
