import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Clock, Heart, ListChecks, ShieldCheck, Stethoscope, X, Sprout } from 'lucide-react';
import { Button } from '../ui/Primitives';

/* ═══════════════════════════════════════════════════════════════
   Pop-up que aparece ao tocar em "Iniciar minha anamnese".
   Explica, na voz da Ana, o que é a anamnese, por quê e como responder.
   RASCUNHO de texto escrito pelo agente no tom da Ana: ela precisa ler e ajustar.
   ═══════════════════════════════════════════════════════════════ */

const BLOCOS: { icon: React.ElementType; titulo: string; texto: string }[] = [
  {
    icon: ListChecks,
    titulo: 'O que é a anamnese?',
    texto:
      'É a nossa primeira conversa. Em vez de uma consulta com hora marcada, você me conta, no seu tempo, como estão o seu corpo, a sua rotina e o seu coração. São blocos curtinhos, de 1 a 3 minutos cada.'
  },
  {
    icon: Heart,
    titulo: 'Por que eu pergunto tanta coisa?',
    texto:
      'Porque corpo e mente contam a mesma história. Como você acorda, como digere, como dorme, como se sente nos dias difíceis: cada detalhe me mostra onde está o desequilíbrio e por onde começar. Sem isso, eu te entregaria um plano que serve para todo mundo. E você não é todo mundo.'
  },
  {
    icon: Sprout,
    titulo: 'Como responder?',
    texto:
      'Não existe resposta certa nem errada. Conte como você está vivendo agora, e não como gostaria que fosse. Se alguma pergunta não se aplica à sua vida, tudo bem: escolha o que mais se aproxima.'
  },
  {
    icon: Clock,
    titulo: 'No seu ritmo',
    texto:
      'Tudo é salvo sozinho. Se fizer de uma vez, leva uns 20 a 30 minutos. Se preferir, pare no meio, feche o app e volte outro dia: você continua exatamente de onde parou.'
  },
  {
    icon: ShieldCheck,
    titulo: 'Seus dados estão em boas mãos',
    texto:
      'O que você me conta é informação de saúde, e eu trato com todo o cuidado. Só você e eu temos acesso, e nada é compartilhado com terceiros.'
  },
  {
    icon: Stethoscope,
    titulo: 'Uma coisa importante',
    texto:
      'O Pacificar é um acompanhamento de saúde integrativa. Ele caminha junto com a sua equipe de saúde, e não no lugar dela. Não substitui consulta, diagnóstico ou tratamento médico.'
  }
];

interface Props {
  onConfirm: () => void;
  onClose: () => void;
}

export const AnamneseIntroDialog: React.FC<Props> = ({ onConfirm, onClose }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  // Esc fecha; o foco vai para o botão principal; a página de trás não rola enquanto o pop-up está aberto
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

  // Portal no <body>: dentro de um pai animado (transform) o position:fixed deixaria de cobrir a tela
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-leaf-900/45 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-anamnese-titulo"
        className="rise flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-bloom border border-line bg-surface sm:rounded-bloom"
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="eyebrow">Um recado da Ana</p>
            <h3 id="intro-anamnese-titulo" className="mt-1 text-[21px] leading-snug">
              Antes de começar, deixa eu te contar
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

        <div className="space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-[14.5px] leading-relaxed text-ink-2">
            Oi, que bom que você chegou até aqui. Esse primeiro passo é o mais importante da nossa
            jornada, então quero te explicar com carinho como ele funciona.
          </p>

          {BLOCOS.map(({ icon: Icon, titulo, texto }) => (
            <section key={titulo} className="flex gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h4 className="text-[14.5px] font-semibold leading-snug text-ink">{titulo}</h4>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{texto}</p>
              </div>
            </section>
          ))}

          <p className="font-display text-[15px] leading-relaxed text-ink">
            Estou com você em cada resposta. Vamos nessa?
            <span className="mt-1 block text-[13px] text-ink-3">Um abraço, Ana Carla Nesi</span>
          </p>
        </div>

        <footer className="space-y-2 border-t border-line bg-surface px-5 pb-5 pt-4">
          <Button
            data-confirm
            full
            size="lg"
            iconRight={ArrowRight}
            onClick={onConfirm}
          >
            Entendi, vamos começar
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="tap press w-full rounded-full py-2 text-[13px] font-semibold text-ink-3 hover:text-ink"
          >
            Agora não, quero ler de novo depois
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};
