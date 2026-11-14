import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Flame, LineChart, Lock, RefreshCw, Sparkles, Sprout, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { linkUpgrade } from '../../config/plano';
import { Button, Card } from '../ui/Primitives';

/* ═══════════════════════════════════════════════════════════════
   Oferta de upgrade 7 → 21 dias (T-87 · D15).
   Só aparece para quem comprou a jornada de 7 dias. Lugares:
   - Home: convite a partir do dia 5 e cartão de destaque ao concluir o dia 7
   - Linha do tempo: tocar num dia de 8 a 21 abre a janela
   - Check-in do dia 7 (tela de parabéns) e Perfil
   A compra acontece no checkout da Eduzz; o webhook troca o plano e o app
   confere sozinho quando a pessoa volta (AppContext.refreshProfile).
   ═══════════════════════════════════════════════════════════════ */

const GANHOS = [
  {
    icon: Flame,
    titulo: 'Semana 2 · Agni e vitalidade',
    texto: 'Restaurar o fogo digestivo, com sete novos dias de cardápio, ritual e foco.'
  },
  {
    icon: Sprout,
    titulo: 'Semana 3 · Harmonia mente-corpo',
    texto: 'Consolidar os hábitos para que eles fiquem com você depois da jornada.'
  },
  {
    icon: LineChart,
    titulo: 'Relatórios dos dias 14 e 21',
    texto: 'A evolução completa de energia, sono, inchaço e Bristol, que a Ana acompanha.'
  }
];

/** Abre o checkout e lembra que a pessoa foi pagar, para mostrar o "já paguei". */
function useUpgrade() {
  const { currentUser, refreshProfile } = useApp();
  const [aguardando, setAguardando] = useState(false);
  const [verificando, setVerificando] = useState(false);
  const [naoChegou, setNaoChegou] = useState(false);
  const { href, viaWhatsApp } = linkUpgrade(currentUser?.email);

  const abrir = () => {
    window.open(href, '_blank', 'noopener');
    if (!viaWhatsApp) setAguardando(true);
  };

  const verificar = async () => {
    setVerificando(true);
    setNaoChegou(false);
    const mudou = await refreshProfile();
    setVerificando(false);
    if (!mudou) setNaoChegou(true);
  };

  return { abrir, verificar, aguardando, verificando, naoChegou, viaWhatsApp };
}

const Aguardando: React.FC<{ u: ReturnType<typeof useUpgrade> }> = ({ u }) =>
  !u.aguardando ? null : (
    <div className="space-y-2 rounded-field border border-line bg-canvas p-3.5 text-left">
      <p className="text-[12.5px] leading-relaxed text-ink-2">
        Assim que a Eduzz confirmar o pagamento, os dias se abrem aqui sozinhos. No cartão e no
        Pix costuma levar poucos minutos. Use o mesmo e-mail do app na compra.
      </p>
      <Button variant="secondary" full icon={RefreshCw} loading={u.verificando} onClick={() => void u.verificar()}>
        Já paguei, atualizar
      </Button>
      {u.naoChegou && (
        <p role="status" className="text-[12px] leading-relaxed text-ochre-700">
          Ainda não chegou a confirmação. Tente de novo em alguns minutos. Boleto pode levar até 3
          dias úteis.
        </p>
      )}
    </div>
  );

const rotuloBotao = (viaWhatsApp: boolean) =>
  viaWhatsApp ? 'Quero os 21 dias: falar com a Ana' : 'Desbloquear os 21 dias';

/* ── Cartão (Home, Perfil, check-in) ───────────────────────── */

interface CardProps {
  /** convite: dias 5 a 7 · concluido: terminou o dia 7 · compacto: Perfil */
  variante: 'convite' | 'concluido' | 'compacto';
  className?: string;
}

export const UpgradeCard: React.FC<CardProps> = ({ variante, className = '' }) => {
  const { planDays, unlockedUntil } = useApp();
  const u = useUpgrade();
  if (planDays !== 7) return null;

  if (variante === 'compacto') {
    return (
      <Card className={`space-y-3 ${className}`}>
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-50 text-ochre-600">
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">Seu plano: jornada de 7 dias</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">
              Os dias 8 a 21 continuam a mesma jornada, com tudo o que você já registrou.
            </p>
          </div>
        </div>
        <Button full variant="secondary" iconRight={ArrowRight} onClick={u.abrir}>
          {rotuloBotao(u.viaWhatsApp)}
        </Button>
        <Aguardando u={u} />
      </Card>
    );
  }

  if (variante === 'convite') {
    const faltam = Math.max(0, 7 - unlockedUntil);
    return (
      <Card className={`space-y-3.5 border-ochre-200 bg-ochre-50/60 ${className}`}>
        <div className="flex items-start gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ochre-100 text-ochre-700">
            <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">
              {faltam === 0 ? 'Hoje é o último dia do seu plano' : `Faltam ${faltam} ${faltam === 1 ? 'dia' : 'dias'} para concluir seu plano`}
            </p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">
              Você está criando um ritmo bonito. Se quiser seguir, a jornada completa continua daqui,
              sem recomeçar nada.
            </p>
          </div>
        </div>
        <Button full variant="secondary" iconRight={ArrowRight} onClick={u.abrir}>
          {rotuloBotao(u.viaWhatsApp)}
        </Button>
        <Aguardando u={u} />
      </Card>
    );
  }

  // concluido: o momento de maior vontade de continuar
  return (
    <Card className={`space-y-5 border-leaf-200 text-left ${className}`}>
      <div>
        <p className="eyebrow">Você concluiu os 7 dias</p>
        <h3 className="mt-1.5 text-[22px] leading-snug">Continue até o dia 21</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
          A primeira semana desinflama e limpa o terreno. As próximas duas aprofundam o que você
          começou, com seus registros e o acompanhamento da Ana mantidos.
        </p>
      </div>
      <ul className="space-y-3.5">
        {GANHOS.map(({ icon: Icon, titulo, texto }) => (
          <li key={titulo} className="flex gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
              <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold leading-snug text-ink">{titulo}</p>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
      <Button full size="lg" iconRight={ArrowRight} onClick={u.abrir}>
        {rotuloBotao(u.viaWhatsApp)}
      </Button>
      <Aguardando u={u} />
    </Card>
  );
};

/* ── Janela (tocar num dia bloqueado da linha do tempo) ─────── */

export const UpgradeDialog: React.FC<{ dia: number; onClose: () => void }> = ({ dia, onClose }) => {
  const u = useUpgrade();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    boxRef.current?.querySelector<HTMLButtonElement>('[data-confirm]')?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = anterior;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-leaf-900/45 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-titulo"
        className="rise flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-bloom border border-line bg-surface sm:rounded-bloom"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="eyebrow flex items-center gap-1.5">
              <Lock className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
              Dia {dia} · jornada completa
            </p>
            <h3 id="upgrade-titulo" className="mt-1 text-[21px] leading-snug">
              Os dias 8 a 21 fazem parte da jornada completa
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="tap press -mr-2 -mt-1 flex items-center justify-center rounded-full text-ink-3 hover:bg-canvas hover:text-ink"
          >
            <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto px-5 py-5">
          <p className="text-[14px] leading-relaxed text-ink-2">
            Seu plano atual tem 7 dias. Com o upgrade, a jornada segue do ponto onde você está, com
            os mesmos registros, a anamnese e o acompanhamento da Ana.
          </p>
          <ul className="space-y-3.5">
            {GANHOS.map(({ icon: Icon, titulo, texto }) => (
              <li key={titulo} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                  <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold leading-snug text-ink">{titulo}</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-2">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
          <Aguardando u={u} />
        </div>

        <footer className="space-y-2 border-t border-line bg-surface px-5 pb-5 pt-4">
          <Button data-confirm full size="lg" iconRight={ArrowRight} onClick={u.abrir}>
            {rotuloBotao(u.viaWhatsApp)}
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="tap press w-full rounded-full py-2 text-[13px] font-semibold text-ink-3 hover:text-ink"
          >
            Agora não
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};
