import React, { useState, useEffect } from 'react';
import { CloudOff } from 'lucide-react';

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

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pt-safe sticky top-0 z-50 bg-ochre-100 px-5 py-2.5 text-center"
    >
      <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-ochre-700">
        <CloudOff className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
        Sem conexão · seus guias e receitas continuam disponíveis
      </p>
    </div>
  );
};
