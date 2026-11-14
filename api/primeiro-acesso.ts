// Primeiro acesso sem verificação de e-mail (T-89).
// O webhook da Eduzz cria a conta já confirmada com user_metadata.needs_password = true.
// Na primeira vez que a paciente entra com o e-mail da compra, este endpoint grava a senha
// escolhida e desliga needs_password. Contas que já definiram senha nunca são sobrescritas.
import { supabaseAdmin } from './_lib/supabaseAdmin';

const MIN_SENHA = 8;

export async function POST(request: Request): Promise<Response> {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Requisição inválida.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: 'Digite um e-mail válido, como nome@exemplo.com.' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data: perfil, error: erroPerfil } = await db
    .from('profiles')
    .select('id, access_status')
    .ilike('email', email)
    .maybeSingle();

  if (erroPerfil) {
    return Response.json({ ok: false, error: 'Não foi possível verificar seu acesso agora.' }, { status: 500 });
  }
  if (!perfil) {
    return Response.json(
      {
        ok: false,
        codigo: 'sem_conta',
        error: 'E-mail ou senha não conferem. Se for seu primeiro acesso, use o mesmo e-mail escolhido na compra.',
      },
      { status: 404 }
    );
  }
  if (perfil.access_status === 'revoked') {
    return Response.json(
      { ok: false, codigo: 'suspenso', error: 'O acesso desta conta está pausado.' },
      { status: 403 }
    );
  }

  const { data: userRes, error: erroUser } = await db.auth.admin.getUserById(perfil.id);
  if (erroUser || !userRes?.user) {
    return Response.json({ ok: false, error: 'Não foi possível localizar sua conta.' }, { status: 500 });
  }

  const u = userRes.user;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const precisaCriarSenha = meta.needs_password === true || (Boolean(u.invited_at) && !u.last_sign_in_at);

  if (!precisaCriarSenha) {
    return Response.json(
      { ok: false, codigo: 'ja_tem_senha', error: 'E-mail ou senha não conferem. Confira e tente de novo.' },
      { status: 409 }
    );
  }

  if (password.length < MIN_SENHA) {
    return Response.json(
      {
        ok: false,
        codigo: 'senha_curta',
        error: `Para criar sua senha no primeiro acesso, escolha pelo menos ${MIN_SENHA} caracteres.`,
      },
      { status: 400 }
    );
  }

  const { error: erroUpdate } = await db.auth.admin.updateUserById(perfil.id, {
    password,
    email_confirm: true,
    user_metadata: { ...meta, needs_password: false, password_set: true },
  });

  if (erroUpdate) {
    return Response.json({ ok: false, error: 'Não foi possível salvar sua senha. Tente de novo.' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
