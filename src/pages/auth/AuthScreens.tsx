import React, { useId, useState } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound, LogIn, MailCheck, Send } from 'lucide-react';
import { Button, Field, Logo, inputClass } from '../../components/ui/Primitives';
import { useAuth } from '../../context/AuthContext';
import { DEMO_ATIVA } from '../../data/demo';

/* ═══════════════════════════════════════════════════════════════
   Telas de acesso (T-21): entrar, esqueci a senha e definir senha.
   Não há cadastro: o acesso nasce da compra (convite por e-mail).
   ═══════════════════════════════════════════════════════════════ */

const MIN_SENHA = 8;
const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

const AuthLayout: React.FC<{ eyebrow: string; title: string; lead?: string; children: React.ReactNode }> = ({
  eyebrow,
  title,
  lead,
  children
}) => (
  <div className="grain flex min-h-dvh flex-col bg-canvas">
    <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
      <div className="mb-8 flex items-center gap-3">
        <Logo className="h-11 w-11 shrink-0" />
        <div>
          <p className="font-display text-[19px] font-semibold leading-none tracking-tight text-ink">Pacificar</p>
          <p className="mt-1 text-[12px] leading-none text-ink-3">Ana Carla Nesi · CRP 17/2833</p>
        </div>
      </div>

      <section className="card rise p-6 sm:p-7">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="text-[24px] leading-tight text-ink">{title}</h2>
        {lead && <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{lead}</p>}
        <div className="mt-6">{children}</div>
      </section>

      <p className="mt-6 px-2 text-center text-[12px] leading-relaxed text-ink-3">
        Jornada de 21 dias de desinflamação e saúde integrativa.
      </p>
    </main>
  </div>
);

const Erro: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    role="alert"
    className="rounded-field border border-clay-100 bg-clay-50 px-4 py-3 text-[13px] leading-relaxed text-clay-600"
  >
    {children}
  </p>
);

const CampoSenha: React.FC<{
  id: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: 'current-password' | 'new-password';
  invalid?: boolean;
  describedBy?: string;
}> = ({ id, value, onChange, autoComplete, invalid, describedBy }) => {
  const [visivel, setVisivel] = useState(false);
  const Icone = visivel ? EyeOff : Eye;
  return (
    <div className="relative">
      <input
        id={id}
        type={visivel ? 'text' : 'password'}
        autoComplete={autoComplete}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${inputClass} pr-12`}
        required
      />
      <button
        type="button"
        onClick={() => setVisivel(v => !v)}
        aria-label={visivel ? 'Esconder senha' : 'Mostrar senha'}
        aria-pressed={visivel}
        className="tap absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 hover:bg-leaf-50 hover:text-leaf-700"
      >
        <Icone className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
    </div>
  );
};

/* ── Entrar / Esqueci a senha ─────────────────────────────────── */

export const LoginPage: React.FC<{ onDemo?: () => void }> = ({ onDemo }) => {
  const { signIn, sendPasswordReset, configured } = useAuth();
  const [modo, setModo] = useState<'entrar' | 'esqueci' | 'enviado'>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const idEmail = useId();
  const idSenha = useId();

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValido(email)) return setErro('Digite um e-mail válido, como nome@exemplo.com.');
    if (!senha) return setErro('Digite sua senha.');
    setErro(null);
    setEnviando(true);
    const msg = await signIn(email, senha);
    setEnviando(false);
    if (msg) setErro(msg);
  };

  const pedirLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValido(email)) return setErro('Digite um e-mail válido, como nome@exemplo.com.');
    setErro(null);
    setEnviando(true);
    const msg = await sendPasswordReset(email);
    setEnviando(false);
    if (msg) setErro(msg);
    else setModo('enviado');
  };

  const trocarModo = (m: typeof modo) => {
    setErro(null);
    setModo(m);
  };

  if (modo === 'enviado') {
    return (
      <AuthLayout eyebrow="Confira seu e-mail" title="Link a caminho">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
            <MailCheck className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="text-[14px] leading-relaxed text-ink-2">
            Se <strong className="text-ink">{email.trim()}</strong> tiver acesso ao Pacificar, você vai receber um link
            para criar uma nova senha. Ele vale por 24 horas.
          </p>
          <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
            Não chegou em alguns minutos? Olhe a caixa de spam ou de promoções.
          </p>
        </div>
        <Button variant="secondary" full className="mt-6" icon={ArrowLeft} onClick={() => trocarModo('entrar')}>
          Voltar para o login
        </Button>
      </AuthLayout>
    );
  }

  const esqueci = modo === 'esqueci';

  return (
    <AuthLayout
      eyebrow={esqueci ? 'Recuperar acesso' : 'Que bom ter você aqui'}
      title={esqueci ? 'Esqueci minha senha' : 'Entrar na sua jornada'}
      lead={
        esqueci
          ? 'Digite o e-mail usado na compra. Enviaremos um link para você criar uma senha nova.'
          : 'Use o e-mail da sua compra e a senha que você criou pelo convite.'
      }
    >
      <form onSubmit={esqueci ? pedirLink : entrar} noValidate className="space-y-4">
        <Field label="E-mail" htmlFor={idEmail}>
          <input
            id={idEmail}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="nome@exemplo.com"
            className={inputClass}
            required
          />
        </Field>

        {!esqueci && (
          <Field label="Senha" htmlFor={idSenha}>
            <CampoSenha id={idSenha} value={senha} onChange={setSenha} autoComplete="current-password" />
          </Field>
        )}

        {erro && <Erro>{erro}</Erro>}

        <Button type="submit" size="lg" full loading={enviando} icon={esqueci ? Send : LogIn} disabled={!configured}>
          {esqueci ? 'Enviar link' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-4 flex flex-col items-center gap-1">
        <Button variant="ghost" onClick={() => trocarModo(esqueci ? 'entrar' : 'esqueci')}>
          {esqueci ? 'Lembrei a senha, quero entrar' : 'Esqueci minha senha'}
        </Button>
        {!configured && (
          <p className="text-center text-[12px] text-clay-600">
            Servidor não configurado: faltam as variáveis VITE_SUPABASE_* no .env.local.
          </p>
        )}
        {DEMO_ATIVA && onDemo && (
          <Button variant="ghost" onClick={onDemo}>
            Abrir modo demonstração
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};

/* ── Definir senha (convite ou recuperação) ───────────────────── */

export const SetPasswordPage: React.FC = () => {
  const { session, loading, linkError, updatePassword, finishSetPassword, signOut } = useAuth();
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const idSenha = useId();
  const idConfirma = useId();
  const idDica = useId();

  if (loading) return null;

  // Link vencido, já usado ou aberto sem token
  if (linkError || !session) {
    return (
      <AuthLayout
        eyebrow="Link do e-mail"
        title={linkError === 'expired' ? 'Este link expirou' : 'Este link não vale mais'}
        lead="Por segurança, cada link funciona uma vez só e por 24 horas. Peça um novo e use o mais recente que chegar."
      >
        <Button full size="lg" icon={Send} onClick={() => void signOut()}>
          Pedir um novo link
        </Button>
        <p className="mt-3 text-center text-[12px] leading-relaxed text-ink-3">
          Na tela de login, toque em "Esqueci minha senha".
        </p>
      </AuthLayout>
    );
  }

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < MIN_SENHA) return setErro(`A senha precisa ter pelo menos ${MIN_SENHA} caracteres.`);
    if (senha !== confirma) return setErro('As duas senhas não estão iguais.');
    setErro(null);
    setSalvando(true);
    const msg = await updatePassword(senha);
    setSalvando(false);
    if (msg) setErro(msg);
    else finishSetPassword();
  };

  const curta = senha.length > 0 && senha.length < MIN_SENHA;

  return (
    <AuthLayout
      eyebrow="Seu acesso"
      title="Crie sua senha"
      lead={`Você vai usar esta senha com o e-mail ${session.user.email ?? ''} para entrar no app.`}
    >
      <form onSubmit={salvar} noValidate className="space-y-4">
        <Field label="Nova senha" htmlFor={idSenha}>
          <CampoSenha
            id={idSenha}
            value={senha}
            onChange={setSenha}
            autoComplete="new-password"
            invalid={curta}
            describedBy={idDica}
          />
          <p id={idDica} className={`text-[12px] ${curta ? 'text-clay-600' : 'text-ink-3'}`}>
            Mínimo de {MIN_SENHA} caracteres. Uma frase curta é fácil de lembrar e difícil de adivinhar.
          </p>
        </Field>

        <Field label="Repita a senha" htmlFor={idConfirma}>
          <CampoSenha id={idConfirma} value={confirma} onChange={setConfirma} autoComplete="new-password" />
        </Field>

        {erro && <Erro>{erro}</Erro>}

        <Button type="submit" size="lg" full loading={salvando} icon={KeyRound}>
          Salvar senha e entrar
        </Button>
      </form>
    </AuthLayout>
  );
};
