# Go-live do PACIFICAR com a Eduzz

> Para o Gabriel. Escrito em 09/11/2026 (sessão T-34 / T-86).
> Ordem de execução: **1 → 2 → 3 → 4 → 5 → 6 → 7**. Na seção 3, os passos 3.1 e 3.2 **já foram feitos**: comece pelo 3.3.

## 0. Onde estamos

| Peça | Situação |
|---|---|
| App (login, anamnese, check-in, exames, painel da Ana, LGPD, PWA) | Pronto |
| Webhook da Eduzz `api/eduzz-webhook.ts` | **Pronto e testado localmente** (assinatura, eventos, idempotência) |
| Modo demo | **Escondido**: não há mais botão. Ver seção 8 |
| Supabase | ✅ **Restaurado em 09/11.** Todas as migrations aplicadas (inclusive Eduzz). Keep-alive interno ligado: `pg_cron` a cada 6h grava no `heartbeat` e chama a API do projeto (T-44), então ele não pausa mais nem antes do deploy |
| Vercel, Eduzz, e-mail (Resend) | Falta configurar (seções 3 a 6) |

**Como funciona a compra, do começo ao fim:**

```
Paciente paga na Eduzz
  └─▶ Eduzz chama  https://SEU-APP/api/eduzz-webhook   (evento myeduzz.invoice_paid)
        └─▶ o app confere a assinatura, cria o login e manda o e-mail de convite (via Resend)
              └─▶ paciente clica no e-mail → define a senha → aceita o termo → começa o Dia 1
Reembolso ou chargeback na Eduzz → o acesso é suspenso (os dados ficam guardados)
```

---

## 1. Respostas do formulário "Novo Produto Digital" da Eduzz

Caminho: Órbita Eduzz → **Produtos → Novo Produto → Produto digital**.

### Dados básicos do produto

**Título do produto** (precisa bater com o que é entregue):
```
Pacificar — Jornada de 21 Dias de Desinflamação e Saúde Integrativa
```

**Descrição do produto** (até 4.000 caracteres; esta tem ~1.500). Evitei promessa de cura ou resultado garantido, que a moderação da Eduzz recusa em produtos de saúde:
```
O Pacificar é um aplicativo de acompanhamento de 21 dias criado pela terapeuta Ana Carla Nesi (CRP 17/2833), que une Ayurveda, alimentação de verdade e saúde integrativa para ajudar você a desinflamar o corpo com gentileza e constância.

O que você recebe ao comprar:
• Acesso ao app Pacificar por e-mail, logo após a confirmação do pagamento. Funciona no celular e no computador e pode ser instalado na tela inicial.
• Jornada guiada de 21 dias: a cada dia, um tema, um áudio de orientação, cardápio sugerido (café da manhã, almoço, jantar e chá) e uma prática simples de autocuidado.
• Anamnese completa de saúde integrativa, que a Ana usa para personalizar suas orientações.
• Check-in diário de sintomas, sono, digestão e energia, com relatório semanal da sua evolução.
• Guia de nutrição com receitas anti-inflamatórias feitas com ingredientes brasileiros.
• Protocolos acompanhados pela terapeuta, com calendário e lembretes.
• Envio de exames laboratoriais pelo próprio app, de forma privada e segura.

Como funciona:
1. Após a compra, você recebe um e-mail com o convite para criar sua senha.
2. Você preenche a anamnese e começa o Dia 1 quando quiser.
3. A Ana acompanha suas respostas e envia suas orientações pelo app.

Importante: o Pacificar é um programa educativo e de acompanhamento em saúde integrativa. Ele não substitui consulta, diagnóstico ou tratamento médico. Não interrompa medicamentos sem orientação do seu médico.

Seus dados de saúde são tratados conforme a LGPD: só você e a sua terapeuta têm acesso.
```

**Categorias:** escolha as duas mais próximas na lista da Eduzz, nesta ordem de preferência: **Saúde e Bem-estar** · **Alimentação / Nutrição** (ou **Saúde e Esportes**, se for o nome disponível).

**Imagem do produto:** quadrada, no mínimo 1000 × 1000 px, JPG ou PNG, com a logo do Pacificar e o nome da jornada. Não use print do app com dado de paciente. Ponto de partida: `public/logo.png` e as artes de `finalizacao/refs/prompts-imagens-marca.md`.

**E-mail de suporte:** o e-mail profissional da Ana (o mesmo que ela vai usar no app como terapeuta). → **[preencher]**

### Formas de cobrança

| Campo | Resposta |
|---|---|
| Tipo de cobrança | **Única** (a jornada tem começo, meio e fim; não é assinatura) |
| Moeda | BRL (já vem fixo) |
| Preço | **[definir com a Ana]** |
| Nome na fatura do cartão (EDZ + até 10 letras) | `PACIFICAR` (9 letras). Vai aparecer como **EDZ PACIFICAR**, que a pessoa reconhece e reduz chargeback |

### Recuperação de vendas

| Campo | Resposta |
|---|---|
| Recuperar vendas perdidas | **Ligado** |
| Nome do remetente do e-mail | `Ana Carla Nesi - Pacificar` |

### Entregas de produto

O acesso é entregue **pelo nosso webhook** (seção 6), não por área de membros da Eduzz. Em **Adicionar Entrega**, escolha a opção de **link externo / entrega personalizada** (o nome varia) e use:

- **Link:** `https://SEU-APP` (a URL final da Vercel ou o domínio próprio)
- **Texto para o comprador:**
  ```
  Seu acesso ao Pacificar chega por e-mail em poucos minutos, no endereço usado na compra.
  Abra o e-mail "Sua jornada no Pacificar começa aqui", crie sua senha e comece a jornada.
  Não chegou? Confira a caixa de spam ou fale com a Ana pelo e-mail de suporte.
  ```

Não escolha Nutror, Alpaclass nem "área de membros": o conteúdo está no app.

### Direitos privados de etiqueta (PLR)

**Não preencher.** O conteúdo é autoral da Ana.

### Depois de salvar

Clique em **Pronto para vender** (vai para moderação). Quando o produto for criado, anote o **código/ID do produto** (Meus Produtos → coluna ID). Ele vai na variável `EDUZZ_PRODUCT_IDS` (seção 4).

---

## 2. O que preparar e enviar

### Da Ana

| Item | Para quê | Onde vai |
|---|---|---|
| E-mail profissional | Suporte na Eduzz e conta de terapeuta no app | Eduzz + script da seção 5 |
| Preço | Formulário da Eduzz | Eduzz |
| WhatsApp (só dígitos, ex.: `5547999998888`) | Botão de contato e tela de acesso suspenso | `VITE_ANA_WHATSAPP` na Vercel |
| Imagem do produto (quadrada) | Vitrine e checkout | Eduzz |
| Validação da política de privacidade e termos de uso (T-61) | Exigência da LGPD para dado de saúde | Link no app e na página de vendas |
| 21 áudios da jornada (T-51), se já tiver | O app usa voz sintética enquanto não houver | `public/audio/dia-01.mp3` … `dia-21.mp3` |

### Do Gabriel (contas e chaves)

| Item | Onde se cria | Onde se cola |
|---|---|---|
| Projeto Supabase ativo | supabase.com | `.env.local` + Vercel |
| Conta Resend com o domínio verificado | resend.com | Supabase → Auth → SMTP |
| Chave secreta do webhook | Console da Eduzz | `EDUZZ_WEBHOOK_SECRET` na Vercel |
| `CRON_SECRET` (texto aleatório longo) | gerar (comando abaixo) | Vercel + GitHub Secrets |

Gerar um segredo aleatório (PowerShell):
```powershell
-join ((48..57)+(65..90)+(97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

### Arquivos do repositório que fazem a integração funcionar

| Arquivo | Papel |
|---|---|
| `api/eduzz-webhook.ts` | Recebe a Eduzz, cria/reativa/suspende o acesso |
| `api/_lib/eduzz.ts` | Confere a assinatura e interpreta os eventos |
| `api/keepalive.ts` + `vercel.json` + `.github/workflows/keepalive.yml` | Impedem o Supabase gratuito de pausar de novo |
| `supabase/migrations/*.sql` | Estrutura do banco, segurança (RLS) e storage de exames |
| `supabase/scripts/emails.mjs` + `supabase/templates/` | E-mails de convite e senha em português |
| `supabase/scripts/criar-admin.mjs` | Cria a conta de terapeuta da Ana |
| `.env.example` | Lista de todas as variáveis |

---

## 3. Supabase (primeiro, sem ele nada funciona)

### 3.1 Restaurar ou recriar o projeto ✅ feito em 09/11 (fica como referência se acontecer de novo)

1. Entre em supabase.com/dashboard.
2. **Se o projeto aparece como "Paused":** clique em **Restore project** e espere uns minutos. As chaves continuam as mesmas. Vá para o passo 3.2 e aplique **só** a migration nova.
3. **Se o projeto não aparece mais (apagado):** crie um novo, região **South America (São Paulo)**, senha forte do banco guardada no gerenciador de senhas. Depois:
   - Copie as chaves novas (Project Settings → API) para o `.env.local`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
   - Atualize também o `SUPABASE_DB_URL` (Connect → Session pooler) usado no backup.
   - No passo 3.2, aplique **todas** as migrations.

### 3.2 Aplicar as migrations ✅ feito em 09/11

No painel: **SQL Editor → New query**, cole o conteúdo de cada arquivo e rode, **nesta ordem**:

| Arquivo | Projeto restaurado | Projeto novo |
|---|---|---|
| `supabase/migrations/20260924042226_init.sql` | — | rodar |
| `supabase/migrations/20260924042616_rls.sql` | — | rodar |
| `supabase/migrations/20260924042701_rls_ajustes.sql` | — | rodar |
| `supabase/migrations/20260924042845_storage_exames.sql` | — | rodar |
| `supabase/migrations/20260924105403_pedidos_exclusao.sql` | — | rodar |
| `supabase/migrations/20261109120000_eduzz.sql` | **rodar** | rodar |
| `supabase/migrations/20261109230000_keepalive_cron.sql` | **rodar** | rodar (e cadastrar os 2 segredos do Vault descritos no topo do arquivo) |

Confirmação: em **Table Editor → profiles**, a coluna `eduzz_invoice_id` existe (e `kiwify_order_id` não).

> Se preferir, me chame numa sessão com o Supabase de volta no ar que eu aplico e testo (`supabase/tests/rls_test.sql`, testes E2E).

### 3.3 Autenticação (Authentication → Sign In / Providers e URL Configuration)

| Configuração | Valor | Por quê |
|---|---|---|
| Allow new users to sign up | **Desligado** | Acesso só por compra (D12) |
| Minimum password length | **8** | |
| Email OTP / link expiration | **86400** (24h) | Quem compra nem sempre abre o e-mail na hora |
| Site URL | `https://SEU-APP` | |
| Redirect URLs | `https://SEU-APP/definir-senha` e `https://SEU-APP/**` | O link do convite volta para o app |

### 3.4 E-mail que chega de verdade (Resend)

Sem isso o convite **não chega** para quem compra: o SMTP padrão do Supabase só envia para a equipe do projeto.

1. resend.com → crie a conta → **Domains → Add domain** com o domínio da Ana (ex.: `pacificar.com.br`) → copie os registros DNS para o provedor do domínio → espere ficar **Verified**.
2. Resend → **API Keys → Create** (permissão Sending).
3. Supabase → **Authentication → Emails → SMTP Settings → Enable custom SMTP**:
   - Host `smtp.resend.com` · Port `465` · User `resend` · Password = a API key
   - Sender email `contato@SEU-DOMINIO` · Sender name `Ana Carla Nesi · Pacificar`
4. Modelos em português: em **Authentication → Emails → Templates**, cole o HTML de `supabase/templates/convite.html` (Invite user) e `recuperacao.html` (Reset password). Assuntos (os mesmos de `supabase/scripts/emails.mjs`): "Sua jornada no Pacificar começa aqui 🌿" e "Crie uma nova senha no Pacificar".
5. Teste: **Authentication → Users → Invite user** com o seu e-mail. Tem que chegar na caixa de entrada, não no spam.

---

## 4. GitHub e Vercel

### 4.1 GitHub

O repositório `GabrielFerreiraIA/Pacificar-` já existe. Confira em Settings que ele está **Private** e envie os commits desta sessão:
```
git push origin main
```

### 4.2 Vercel

1. vercel.com → **Add New → Project** → importe `Pacificar-`. Framework: **Vite** (detecta sozinho). Não mude build nem output.
2. **Settings → Environment Variables** (marque Production e Preview):

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → anon / publishable key |
| `SUPABASE_URL` | igual ao `VITE_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → service_role / secret key (**nunca** com prefixo `VITE_`) |
| `APP_URL` | `https://SEU-APP` (sem barra no final) |
| `CRON_SECRET` | o segredo aleatório gerado na seção 2 |
| `EDUZZ_WEBHOOK_SECRET` | a chave secreta do webhook (seção 6, passo 3) |
| `EDUZZ_PRODUCT_IDS` | o ID do produto na Eduzz (seção 1). Mais de um: `123,456` |
| `VITE_ANA_WHATSAPP` | WhatsApp da Ana, só dígitos |
| `VITE_DEMO` | **não criar** (ou deixar vazio) |

Apague a `KIWIFY_WEBHOOK_TOKEN` se ela existir em algum lugar: não é mais usada.

3. **Deploy.** Depois que terminar, abra `https://SEU-APP`: deve aparecer a tela de login, **sem** botão de demonstração.
4. **Plano:** a Vercel Hobby é só para uso não comercial. Como o app é vendido, mude para **Pro** (US$ 20/mês) antes da primeira venda (T-81). Nada no código muda.
5. **Domínio próprio (opcional, recomendado):** Settings → Domains → `app.SEU-DOMINIO`. Se usar, troque `APP_URL` e as URLs do Supabase (3.3) para ele e faça redeploy.

### 4.3 Conferir o keep-alive

No navegador, nada aparece (precisa do segredo). No PowerShell:
```powershell
curl.exe -H "Authorization: Bearer SEU_CRON_SECRET" "https://SEU-APP/api/keepalive?src=manual"
```
Resposta esperada: `{"ok":true,"source":"manual",...}`.

Depois, no GitHub: **Settings → Secrets and variables → Actions → New repository secret**: `CRON_SECRET` e `APP_URL`. Em **Actions → keepalive → Run workflow**, rode uma vez para testar. A partir daí o Supabase não pausa mais.

---

## 5. Conta de terapeuta da Ana

Com o `.env.local` atualizado (chaves do Supabase e `APP_URL` de produção):
```
node --env-file=.env.local supabase/scripts/criar-admin.mjs email-da-ana@dominio.com
```
A Ana recebe o convite, define a senha e entra direto no painel de pacientes. O manual dela está em `finalizacao/MANUAL-ANA.md`.

---

## 6. Webhook na Eduzz (a compra cria o login)

O webhook novo fica no **Console de desenvolvedor** da Eduzz: no topo da Órbita, menu de apps (os 9 pontinhos) → **Integrações** (console.eduzz.com). Documentação: developers.eduzz.com/docs/webhook.

1. **Webhook → Criar configuração.**
2. **URL:** `https://SEU-APP/api/eduzz-webhook`
3. **Chave de acesso:** crie uma chave nova (ex.: "Pacificar app"). Copie o segredo dela e cole em `EDUZZ_WEBHOOK_SECRET` na Vercel → **Redeploy** (variável nova só vale depois do redeploy).
4. **Eventos** (MyEduzz → Fatura):
   - ✅ Paga (`myeduzz.invoice_paid`)
   - ✅ Reembolsada (`myeduzz.invoice_refunded`)
   - ✅ Chargeback (`myeduzz.invoice_chargeback`)
   - ✅ Cancelada (`myeduzz.invoice_canceled`)
5. **Filtro (opcional):** se a tela permitir filtrar por produto, filtre pelo ID do produto Pacificar. É redundante com `EDUZZ_PRODUCT_IDS`, mas reduz chamadas.
6. **Verificar URL** e depois **Ativar**. A Eduzz manda um evento `ping`.
7. **Confira a resposta do ping** no **Histórico de envios**:
   - `{"ok":true,"ping":true,"assinatura":"hex"}` ou `"base64"` → ✅ tudo certo.
   - `"assinatura":"invalida"` → a chave na Vercel não é a mesma da Eduzz, ou faltou o redeploy. Corrija e clique em verificar de novo.

> **Desative o webhook antigo da Órbita** (menu Avançado → Webhooks), se houver algum apontando para outro sistema com a mesma função, para não criar acessos em dobro.

---

## 7. Teste de ponta a ponta (antes de divulgar)

1. Na Eduzz, crie um **cupom de 100%** para o produto (ou um preço de teste mínimo).
2. Compre com um e-mail seu que **não** tenha conta no app.
3. Em até 1 minuto:
   - Eduzz → Histórico de envios: `invoice_paid` com resposta **200** e `"resultado":"acesso liberado"`.
   - Seu e-mail: chegou "Sua jornada no Pacificar começa aqui".
4. Clique no convite → crie a senha → aceite o termo → o app abre no Dia 1.
5. Entre como Ana: a paciente de teste aparece no painel.
6. Na Eduzz, **reembolse** a compra de teste → a paciente vê a tela de acesso suspenso.
7. Supabase → Table Editor → `purchases`: as linhas `myeduzz.invoice_paid` e `myeduzz.invoice_refunded` com `processed_at` preenchido e `error` vazio.
8. Me mande o JSON do evento (Histórico de envios → detalhes) **com nome, e-mail, CPF e endereço trocados por fictícios**. Eu salvo em `finalizacao/refs/` e fecho a T-36.

Se o passo 3 falhar, veja a seção 9.

---

## 8. Modo demonstração escondido

- **Na produção não existe botão.** Quem compra nunca vê dados fictícios.
- **Para abrir:** na tela de login, toque **5 vezes seguidas no logo** (em até 3 segundos). Abre a demo com a paciente fictícia "Camila", sem login e sem tocar no banco.
- **Dentro da demo:** o menu do topo (ícone de perfil) troca entre **Visão do paciente** e **Painel da terapeuta**, e tem **Sair da demonstração**.
- Recarregar a página mantém a demo aberta naquela aba. Fechar a aba ou "Sair da demonstração" volta ao login.
- Tudo o que se faz na demo fica só no navegador de quem testa.
- Os dados fictícios ficam num arquivo separado, baixado só quando alguém faz o gesto.

---

## 9. Se algo der errado

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Ping com `"assinatura":"invalida"` | Chave diferente ou sem redeploy | Copie a chave de novo para a Vercel e faça redeploy |
| `invoice_paid` com **401** | Mesmo motivo acima | Idem. Depois clique em **Reenviar** no histórico da Eduzz |
| `invoice_paid` com **500** e erro de SMTP / "Error sending invite email" | Resend não configurado | Seção 3.4. Depois reenvie o evento (é seguro: não duplica) |
| `invoice_paid` com **500** "SUPABASE_URL … ausente" | Faltou variável na Vercel | Seção 4.2 + redeploy |
| `"resultado":"ignorado: outro produto"` | `EDUZZ_PRODUCT_IDS` com ID errado | Confira o ID do produto, corrija e reenvie |
| Convite chega, mas o link abre página de erro | Redirect URL faltando no Supabase | Seção 3.3 |
| Pessoa diz que não recebeu o e-mail | Spam ou e-mail digitado errado na compra | Supabase → Authentication → Users: se o e-mail está lá, clique em "Send magic link/invite" de novo |
| Supabase pausou de novo | Keep-alive parado | Seção 4.3. Veja a tabela `heartbeat`: deve ter linhas `supabase-cron` a cada 6h. No SQL Editor: `select * from cron.job_run_details order by start_time desc limit 5` e `select status_code from net._http_response order by created desc limit 5` |

---

## 10. Checklist dos 100%

- [x] Supabase ativo, migrations aplicadas, `eduzz_invoice_id` existe
- [x] Keep-alive interno (`pg_cron`) gravando no `heartbeat` a cada 6h
- [ ] Cadastro público desligado e URLs de redirect configuradas
- [ ] Resend verificado e convite de teste chegando na caixa de entrada
- [ ] Repositório privado e push feito
- [ ] Vercel com todas as variáveis, deploy verde, plano Pro
- [ ] `/api/keepalive` responde `ok` e os secrets do GitHub estão cadastrados
- [ ] Conta de terapeuta da Ana criada e testada
- [ ] Produto aprovado na moderação da Eduzz e ID anotado em `EDUZZ_PRODUCT_IDS`
- [ ] Webhook ativo na Eduzz, ping com `"assinatura":"hex"` ou `"base64"`
- [ ] Compra de teste → convite → senha → app → reembolso → acesso suspenso
- [ ] Política de privacidade e termos validados (T-61)
- [ ] Testado em iPhone e Android reais (T-74)
