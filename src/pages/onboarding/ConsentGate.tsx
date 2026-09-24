import React, { useEffect, useId, useState } from 'react';
import { Check, LogOut, ShieldCheck } from 'lucide-react';
import { Button, Logo } from '../../components/ui/Primitives';
import { useAuth } from '../../context/AuthContext';
import { acceptConsent, hasConsent } from '../../lib/api/consents';
import { TERMO_RESUMO, TERMO_TEXTO, TERMO_VERSAO } from '../../data/termo';

/* ═══════════════════════════════════════════════════════════════
   Termo de consentimento no primeiro acesso (T-60 · LGPD art. 11).
   Sem o aceite da versão atual do termo, o app não abre.
   O aceite fica em public.consents e é lembrado neste aparelho
   (para abrir sem internet depois do primeiro aceite).
   ═══════════════════════════════════════════════════════════════ */

const cacheKey = (uid: string) => `pacificar_termo_${uid}_${TERMO_VERSAO}`;

function lembrado(uid: string) {
  try {
    return localStorage.getItem(cacheKey(uid)) === '1';
  } catch {
    return false;
  }
}

export const ConsentGate: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const [estado, setEstado] = useState<'verificando' | 'pendente' | 'aceito'>(() =>
    lembrado(userId) ? 'aceito' : 'verificando'
  );

  useEffect(() => {
    if (estado !== 'verificando') return;
    let vivo = true;
    hasConsent(userId, TERMO_VERSAO)
      .then(aceito => {
        if (!vivo) return;
        if (aceito) {
          try {
            localStorage.setItem(cacheKey(userId), '1');
          } catch {
            /* sem cache */
          }
        }
        setEstado(aceito ? 'aceito' : 'pendente');
      })
      // Sem conseguir confirmar, pede o aceite (nunca libera sem registro)
      .catch(() => vivo && setEstado('pendente'));
    return () => {
      vivo = false;
    };
  }, [userId, estado]);

  if (estado === 'aceito') return <>{children}</>;
  if (estado === 'verificando') {
    return (
      <div className="grain flex min-h-dvh items-center justify-center bg-canvas" role="status">
        <Logo className="h-14 w-14 animate-pulse" />
        <span className="sr-only">Carregando…</span>
      </div>
    );
  }
  return (
    <ConsentPage
      userId={userId}
      onAceito={() => {
        try {
          localStorage.setItem(cacheKey(userId), '1');
        } catch {
          /* sem cache */
        }
        setEstado('aceito');
      }}
    />
  );
};

const ConsentPage: React.FC<{ userId: string; onAceito: () => void }> = ({ userId, onAceito }) => {
  const { signOut, profile } = useAuth();
  const [concordo, setConcordo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const idCheck = useId();
  const nome = profile?.full_name?.split(' ')[0];

  const aceitar = async () => {
    if (!concordo) return;
    setErro(null);
    setSalvando(true);
    try {
      await acceptConsent(userId, TERMO_VERSAO);
      onAceito();
    } catch {
      setErro('Não conseguimos registrar seu aceite agora. Confira a internet e tente de novo.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="grain min-h-dvh bg-canvas">
      <main className="relative z-10 mx-auto w-full max-w-xl px-5 py-10">
        <div className="mb-7 flex items-center gap-3">
          <Logo className="h-11 w-11 shrink-0" />
          <div>
            <p className="font-display text-[19px] font-semibold leading-none tracking-tight text-ink">Pacificar</p>
            <p className="mt-1 text-[12px] leading-none text-ink-3">Ana Carla Nesi · CRP 17/2833</p>
          </div>
        </div>

        <section className="card rise space-y-6 p-6 sm:p-7">
          <header>
            <p className="eyebrow mb-2">Antes de começar</p>
            <h2 className="text-[26px] leading-tight text-ink">
              {nome ? `${nome}, seus dados estão em boas mãos` : 'Seus dados estão em boas mãos'}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
              Para acompanhar sua jornada, a Ana precisa guardar informações sobre a sua saúde. Leia os pontos
              principais e dê o seu consentimento.
            </p>
          </header>

          <ul className="space-y-3">
            {TERMO_RESUMO.map(item => (
              <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-ink">
                <ShieldCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-leaf-600" strokeWidth={1.8} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <details className="rounded-field border border-line bg-canvas-2 px-4 py-3">
            <summary className="cursor-pointer text-[13.5px] font-semibold text-leaf-700">
              Ler o termo completo
            </summary>
            <div className="mt-3 max-h-[50vh] space-y-4 overflow-y-auto pr-1">
              {TERMO_TEXTO.map(s => (
                <div key={s.titulo}>
                  <h3 className="text-[14px] font-semibold text-ink">{s.titulo}</h3>
                  {s.paragrafos.map(p => (
                    <p key={p} className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                      {p}
                    </p>
                  ))}
                </div>
              ))}
              <p className="text-[11.5px] text-ink-3">Versão do termo: {TERMO_VERSAO}</p>
            </div>
          </details>

          <label
            htmlFor={idCheck}
            className={`flex cursor-pointer gap-3 rounded-field border p-4 transition-colors ${
              concordo ? 'border-leaf-500 bg-leaf-50' : 'border-line bg-surface'
            }`}
          >
            <input
              id={idCheck}
              type="checkbox"
              checked={concordo}
              onChange={e => setConcordo(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-leaf-600"
            />
            <span className="text-[13.5px] leading-relaxed text-ink">
              Li o termo e <strong>autorizo</strong> o uso dos meus dados de saúde para o acompanhamento da minha
              jornada no Pacificar.
            </span>
          </label>

          {erro && (
            <p role="alert" className="rounded-field border border-clay-100 bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-clay-600">
              {erro}
            </p>
          )}

          <div className="space-y-2">
            <Button full size="lg" icon={Check} loading={salvando} disabled={!concordo} onClick={() => void aceitar()}>
              Aceitar e começar
            </Button>
            <Button full variant="ghost" icon={LogOut} onClick={() => void signOut()}>
              Agora não, sair
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};
