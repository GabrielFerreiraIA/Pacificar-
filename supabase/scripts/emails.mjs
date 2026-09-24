// E-mails do Supabase Auth em português (T-20).
// Monta cada e-mail a partir de supabase/templates/_base.html e grava o HTML final
// em supabase/templates/<nome>.html (para revisar no navegador).
//
// Uso:
//   node supabase/scripts/emails.mjs              → só gera os arquivos
//   node --env-file=.env.local supabase/scripts/emails.mjs --aplicar
//        → também aplica no projeto (precisa de SUPABASE_ACCESS_TOKEN e SUPABASE_PROJECT_REF)
//
// Variáveis do Supabase usadas: {{ .ConfirmationURL }}, {{ .Email }}, {{ .NewEmail }}.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates');
const base = fs.readFileSync(path.join(dir, '_base.html'), 'utf8');

const P = t => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#4f5d55;">${t}</p>`;
const PEQUENO = t => `<p style="margin:18px 0 0;font-size:12.5px;line-height:1.6;color:#6e7c75;">${t}</p>`;
const BOTAO = (texto, url = '{{ .ConfirmationURL }}') => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px;"><tr>
  <td style="border-radius:999px;background:#2d6b48;">
    <a href="${url}" style="display:inline-block;padding:15px 28px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">${texto}</a>
  </td>
</tr></table>
${PEQUENO(`Se o botão não abrir, copie e cole este endereço no navegador:<br><a href="${url}" style="color:#2d6b48;word-break:break-all;">${url}</a>`)}`;

const EMAILS = [
  {
    arquivo: 'convite',
    chave: 'invite',
    assunto: 'Sua jornada no Pacificar começa aqui 🌿',
    eyebrow: 'Boas-vindas',
    titulo: 'Crie sua senha e comece a jornada',
    preheader: 'Seu acesso ao app da jornada de 21 dias está pronto.',
    corpo:
      P('Que alegria ter você aqui! Sua compra foi confirmada e o seu acesso ao <strong style="color:#16211c;">Pacificar</strong>, o app da jornada de 21 dias de desinflamação, já está pronto.') +
      P('Toque no botão abaixo para criar a sua senha. Depois, é só entrar com o e-mail <strong style="color:#16211c;">{{ .Email }}</strong> e essa senha.') +
      BOTAO('Criar minha senha') +
      PEQUENO('O link vale por 24 horas e funciona uma vez só. Se ele expirar, abra o app e toque em "Esqueci minha senha".')
  },
  {
    arquivo: 'recuperacao',
    chave: 'recovery',
    assunto: 'Crie uma nova senha no Pacificar',
    eyebrow: 'Recuperar acesso',
    titulo: 'Vamos criar uma nova senha',
    preheader: 'Recebemos um pedido para trocar a senha do seu acesso.',
    corpo:
      P('Recebemos um pedido para criar uma nova senha para <strong style="color:#16211c;">{{ .Email }}</strong>.') +
      BOTAO('Criar nova senha') +
      PEQUENO('O link vale por 24 horas e funciona uma vez só. Se não foi você que pediu, pode ignorar este e-mail: sua senha atual continua valendo.')
  },
  {
    arquivo: 'troca-email',
    chave: 'email_change',
    assunto: 'Confirme seu novo e-mail no Pacificar',
    eyebrow: 'Sua conta',
    titulo: 'Confirme seu novo e-mail',
    preheader: 'Falta um toque para trocar o e-mail do seu acesso.',
    corpo:
      P('Recebemos um pedido para trocar o e-mail do seu acesso de <strong style="color:#16211c;">{{ .Email }}</strong> para <strong style="color:#16211c;">{{ .NewEmail }}</strong>.') +
      BOTAO('Confirmar novo e-mail') +
      PEQUENO('Se não foi você que pediu, ignore este e-mail e fale com a Ana Carla.')
  },
  {
    arquivo: 'senha-alterada',
    chave: 'password_changed_notification',
    assunto: 'Sua senha do Pacificar foi alterada',
    eyebrow: 'Aviso de segurança',
    titulo: 'Sua senha foi alterada',
    preheader: 'A senha do seu acesso acabou de ser trocada.',
    corpo:
      P('A senha do acesso <strong style="color:#16211c;">{{ .Email }}</strong> acabou de ser alterada.') +
      P('Se foi você, está tudo certo e não precisa fazer nada. Se não foi, abra o app, toque em "Esqueci minha senha" para criar uma nova e avise a Ana Carla.')
  }
];

const html = e =>
  base
    .replaceAll('{{TITULO}}', e.titulo)
    .replace('{{EYEBROW}}', e.eyebrow)
    .replace('{{PREHEADER}}', e.preheader)
    .replace('{{CORPO}}', e.corpo);

const config = {};
for (const e of EMAILS) {
  const conteudo = html(e);
  fs.writeFileSync(path.join(dir, `${e.arquivo}.html`), conteudo);
  config[`mailer_subjects_${e.chave}`] = e.assunto;
  config[`mailer_templates_${e.chave}_content`] = conteudo;
  console.log(`✔ ${e.arquivo}.html (${(conteudo.length / 1024).toFixed(1)} KB) · "${e.assunto}"`);
}

if (process.argv.includes('--aplicar')) {
  const { SUPABASE_ACCESS_TOKEN: token, SUPABASE_PROJECT_REF: ref } = process.env;
  if (!token || !ref) {
    console.error('Para aplicar, defina SUPABASE_ACCESS_TOKEN e SUPABASE_PROJECT_REF (Account → Access Tokens no painel do Supabase).');
    process.exit(1);
  }
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/config/auth`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) {
    console.error('Falha ao aplicar:', res.status, await res.text());
    process.exit(1);
  }
  console.log(`\nAplicado no projeto ${ref}.`);
}
