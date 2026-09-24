import React from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { Button, Logo } from '../ui/Primitives';

/* ═══════════════════════════════════════════════════════════════
   Rede de segurança para erros de renderização.
   - variant "app": tela cheia, usada em volta do app inteiro.
   - variant "page": dentro do layout, o menu continua funcionando.
   Trocar qualquer valor de `resetKeys` limpa o erro (ex.: mudar de aba).
   ═══════════════════════════════════════════════════════════════ */

const RELOAD_FLAG = 'pacificar_chunk_reload';

/** Depois de um deploy, o PWA pode pedir um pedaço do app que não existe mais. */
function isChunkLoadError(error: Error) {
  return /dynamically imported module|Importing a module script failed|Loading chunk|ChunkLoadError/i.test(
    `${error.name} ${error.message}`
  );
}

interface Props {
  children: React.ReactNode;
  variant?: 'app' | 'page';
  resetKeys?: unknown[];
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidMount() {
    // App carregou bem: libera a recarga automática para um próximo deploy
    if (this.props.variant !== 'page') {
      window.setTimeout(() => {
        try {
          sessionStorage.removeItem(RELOAD_FLAG);
        } catch {
          /* ignore */
        }
      }, 10_000);
    }
  }

  componentDidCatch(error: Error) {
    if (isChunkLoadError(error)) {
      // Recarrega uma vez só para buscar a versão nova; se falhar de novo, mostra a tela.
      try {
        if (!sessionStorage.getItem(RELOAD_FLAG)) {
          sessionStorage.setItem(RELOAD_FLAG, '1');
          window.location.reload();
          return;
        }
      } catch {
        /* sessionStorage indisponível: segue para a tela de erro */
      }
    }
    // Só o tipo e a mensagem técnica; nunca estado nem dados de saúde da pessoa.
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error);
    else console.error('[ErrorBoundary]', error.name, error.message);
  }

  componentDidUpdate(prev: Props) {
    if (!this.state.error) return;
    const a = prev.resetKeys ?? [];
    const b = this.props.resetKeys ?? [];
    if (a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]))) {
      this.setState({ error: null });
    }
  }

  private retry = () => this.setState({ error: null });

  private reload = () => {
    try {
      sessionStorage.removeItem(RELOAD_FLAG);
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return this.props.variant === 'page' ? (
      <ErrorScreen compact onRetry={this.retry} onReload={this.reload} />
    ) : (
      <div className="grain flex min-h-dvh items-center justify-center bg-canvas px-5">
        <ErrorScreen onRetry={this.retry} onReload={this.reload} />
      </div>
    );
  }
}

const ErrorScreen: React.FC<{ compact?: boolean; onRetry: () => void; onReload: () => void }> = ({
  compact = false,
  onRetry,
  onReload
}) => (
  <section
    role="alert"
    className={`card mx-auto flex w-full max-w-md flex-col items-center text-center ${compact ? 'mt-6 p-6' : 'p-8'}`}
  >
    <Logo className="mb-5 h-12 w-12" />
    <p className="eyebrow mb-2">Um tropeço no caminho</p>
    <h2 className="text-[22px] leading-tight text-ink">Algo não saiu como esperado</h2>
    <p className="mt-3 max-w-[36ch] text-[14px] leading-relaxed text-ink-2">
      Respire fundo: suas respostas e registros continuam guardados. Tente de novo ou recarregue o
      aplicativo.
    </p>
    <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
      <Button icon={RotateCcw} onClick={onRetry}>
        Tentar de novo
      </Button>
      <Button variant="secondary" icon={RefreshCw} onClick={onReload}>
        Recarregar o app
      </Button>
    </div>
    <p className="mt-5 text-[12px] leading-relaxed text-ink-3">
      Se continuar acontecendo, fale com a Ana Carla pelo WhatsApp.
    </p>
  </section>
);
