import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

/* ═══════════════════════════════════════════════════════════════
   Sessão do Supabase Auth (T-21).
   Login só por convite (D1): não existe cadastro público no app.
   Links de convite e de recuperação chegam em /definir-senha com o
   token no endereço; o supabase-js lê o token e abre a sessão sozinho.
   ═══════════════════════════════════════════════════════════════ */

export const SET_PASSWORD_PATH = '/definir-senha';

/** Prefixo de tudo que o app guarda no aparelho (cache offline). */
const LOCAL_PREFIX = 'pacificar_';

type LinkError = 'expired' | 'invalid' | null;

interface AuthContextType {
  session: Session | null;
  /** true enquanto a sessão salva no aparelho ainda está sendo lida */
  loading: boolean;
  configured: boolean;
  /** Chegou por link de convite/recuperação: precisa definir a senha */
  mustSetPassword: boolean;
  /** O link do e-mail veio com erro (vencido ou já usado) */
  linkError: LinkError;
  signIn: (email: string, password: string) => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  finishSetPassword: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Mensagens do Supabase em português acolhedor. */
export function traduzirErroAuth(message: string | undefined): string {
  const m = (message ?? '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha não conferem. Confira e tente de novo.';
  if (m.includes('email not confirmed')) return 'Seu acesso ainda não foi ativado. Abra o convite que enviamos por e-mail.';
  if (m.includes('password should be at least') || m.includes('weak password'))
    return 'A senha precisa ter pelo menos 8 caracteres.';
  if (m.includes('should be different from the old password'))
    return 'A nova senha precisa ser diferente da anterior.';
  if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes'))
    return 'Muitas tentativas seguidas. Aguarde um minutinho e tente de novo.';
  if (m.includes('failed to fetch') || m.includes('network'))
    return 'Sem conexão com a internet. Verifique o sinal e tente de novo.';
  if (m.includes('session') && m.includes('missing'))
    return 'Seu link expirou. Peça um novo em "Esqueci minha senha".';
  return 'Algo não saiu como esperado. Tente de novo em instantes.';
}

/** Lê do endereço se o link do e-mail é de convite/recuperação ou se veio com erro. */
function lerLinkDoEmail(): { isSetPassword: boolean; error: LinkError } {
  const { pathname, hash, search } = window.location;
  const params = new URLSearchParams(hash.replace(/^#/, '') || search.replace(/^\?/, ''));
  const code = params.get('error_code') ?? '';
  const error: LinkError = params.get('error')
    ? code.includes('expired') ? 'expired' : 'invalid'
    : null;
  const type = params.get('type');
  const isSetPassword = pathname === SET_PASSWORD_PATH || type === 'invite' || type === 'recovery';
  return { isSetPassword, error };
}

export function limparCacheLocal() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(LOCAL_PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch {
    /* armazenamento indisponível */
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [link] = useState(lerLinkDoEmail);
  const [mustSetPassword, setMustSetPassword] = useState(link.isSetPassword);

  useEffect(() => {
    if (!supabase) return;
    let ativo = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === 'PASSWORD_RECOVERY') setMustSetPassword(true);
      if (event === 'SIGNED_OUT') setMustSetPassword(false);
    });

    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return 'O aplicativo ainda não está conectado ao servidor.';
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    return error ? traduzirErroAuth(error.message) : null;
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!supabase) return 'O aplicativo ainda não está conectado ao servidor.';
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}${SET_PASSWORD_PATH}`
    });
    // Não revela se o e-mail existe: só falha visível para rede/limite de envio
    if (error && !/user not found/i.test(error.message)) return traduzirErroAuth(error.message);
    return null;
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    if (!supabase) return 'O aplicativo ainda não está conectado ao servidor.';
    const { error } = await supabase.auth.updateUser({ password });
    return error ? traduzirErroAuth(error.message) : null;
  }, []);

  const finishSetPassword = useCallback(() => {
    setMustSetPassword(false);
    // Limpa o token do endereço e volta para a raiz do app
    window.history.replaceState(null, '', '/');
  }, []);

  const signOut = useCallback(async () => {
    // Aparelho pode ser compartilhado: nada de dado de saúde fica para trás
    limparCacheLocal();
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    window.history.replaceState(null, '', '/');
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      session,
      loading,
      configured: isSupabaseConfigured,
      mustSetPassword,
      linkError: link.error,
      signIn,
      sendPasswordReset,
      updatePassword,
      signOut,
      finishSetPassword
    }),
    [session, loading, mustSetPassword, link.error, signIn, sendPasswordReset, updatePassword, signOut, finishSetPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
