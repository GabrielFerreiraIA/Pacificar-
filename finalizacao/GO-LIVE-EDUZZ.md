# Go-live do PACIFICAR com a Eduzz

> Para o Gabriel. Escrito em 09/11/2026 (sessão T-34 / T-86). **Atualizado em 13/11/2026 (T-87): o app agora tem duas versões, 7 e 21 dias, com upgrade dentro do app.**
> Ordem de execução: **1 → 1B → 2 → 3 → 4 → 5 → 6 → 7**. Na seção 3, os passos 3.1 e 3.2 **já foram feitos** (inclusive a `plano_dias`, em 13/11): comece pelo 3.3.

## 0. Onde estamos

| Peça | Situação |
|---|---|
| App (login, anamnese, check-in, exames, painel da Ana, LGPD, PWA) | Pronto |
| Webhook da Eduzz `api/eduzz-webhook.ts` + `api/primeiro-acesso.ts` | **Pronto e sem verificação de e-mail (T-89):** a compra cria a conta já ativa e a paciente escolhe a senha direto na tela de login do app |
| **Duas versões: 7 e 21 dias + upgrade** (T-87) | **Pronto.** Migration `plano_dias` aplicada em 13/11. Falta cadastrar os produtos de 7 dias e de upgrade (1B) |
| Modo demo | **Escondido**: não há mais botão. Ver seção 8 |
| Supabase | ✅ **Ativo e configurado.** Todas as migrations aplicadas (inclusive `plano_dias`, 13/11). Cadastro público desligado (`disable_signup = true`), senha mín. 8 e expiração 24h já configurados. Keep-alive interno ligado (`pg_cron` a cada 6h) |
| Vercel (`https://detoxpacificar21.vercel.app`), Eduzz | Deploy no ar; falta cadastrar produtos/webhook na Eduzz (seções 1, 1B, 4 e 6) |

**Como funciona a compra, do começo ao fim (sem verificação de e-mail):**

```
Paciente paga na Eduzz (produto de 7 dias OU de 21 dias)
  └─▶ Eduzz chama  https://detoxpacificar21.vercel.app/api/eduzz-webhook   (evento myeduzz.invoice_paid)
        └─▶ o app confere a assinatura, vê QUAL produto foi pago e cria a conta JÁ ATIVA (email_confirm: true)
              └─▶ paciente abre o app → digita o e-mail da compra + a senha que quer usar → entra no Dia 1 na hora
```

Quem tem 7 dias vê os dias 8 a 21 com cadeado e a oferta "Desbloquear os 21 dias"
  └─▶ checkout do produto UPGRADE na Eduzz (mesmo e-mail) → webhook → plano vira 21
        └─▶ ao voltar para o app, os dias se abrem sozinhos (a jornada continua de onde estava)

Reembolso/chargeback da jornada → acesso suspenso (os dados ficam guardados)
Reembolso/chargeback do upgrade → a pessoa volta para os 7 dias (não perde o acesso)
```

### Os três produtos na Eduzz (um só app)

| Produto | Para quem | Preço | Variável na Vercel |
|---|---|---|---|
| **Jornada de 21 dias** | Quem quer o programa completo | **R$ 1.500** (valor da Ana, 12/11) | `EDUZZ_PRODUCT_21D` |
| **Jornada de 7 dias** | Porta de entrada, ticket menor | **[definir com a Ana]** | `EDUZZ_PRODUCT_7D` |
| **Upgrade 7 → 21 dias** | Só quem já tem os 7 dias. Vendido **dentro do app**, sem divulgar | **[definir com a Ana]** | `EDUZZ_PRODUCT_UPGRADE` + link em `VITE_EDUZZ_UPGRADE_URL` |

**Sugestão de preço** (a decisão é da Ana): 7 dias a **R$ 397** e upgrade a **R$ 1.103**. Assim quem começa pelos 7 dias e faz o upgrade paga os mesmos R$ 1.500 de quem comprou direto. Ninguém se sente punido por ter testado antes, e os 21 dias continuam valendo R$ 1.500. Se quiserem um empurrão, o upgrade pode sair a **R$ 997** (R$ 1.394 no total), um desconto real para quem já está dentro.

**Onde a oferta de upgrade aparece no app** (só para quem tem 7 dias):
1. **Home, a partir do dia 5:** cartão "Faltam X dias para concluir seu plano".
2. **Home, depois do check-in do dia 7:** cartão de destaque "Você concluiu os 7 dias · Continue até o dia 21", com o que vem nas semanas 2 e 3. É o momento de maior vontade de continuar.
3. **Tela de parabéns do check-in do dia 7:** o mesmo cartão, logo abaixo do "Dia 07 concluído".
4. **Linha do tempo:** os dias 8 a 21 aparecem com cadeado dourado e, ao tocar, abrem a janela da oferta.
5. **Perfil:** "Seu plano: jornada de 7 dias", com o botão.

Depois de pagar, a pessoa volta para o app. Ele confere o plano sozinho quando a tela volta ao primeiro plano, e há um botão "Já paguei, atualizar". Enquanto `VITE_EDUZZ_UPGRADE_URL` não estiver configurada, o botão abre o WhatsApp da Ana com a mensagem pronta, para nenhuma venda travar.

A Ana também pode liberar os 21 dias à mão (ex.: pagamento por Pix fora da Eduzz): **Painel → paciente → Prescrição → "Plano: jornada de 7 dias" → Liberar 21 dias**.

---

## 1. Produto de 21 dias: respostas do formulário "Novo Produto Digital"

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
• Acesso imediato ao app Pacificar logo após a confirmação do pagamento, usando o e-mail da compra. Funciona no celular e no computador e pode ser instalado na tela inicial.
• Jornada guiada de 21 dias: a cada dia, um tema, cardápio sugerido (café da manhã, almoço, jantar e chá) e uma prática simples de autocuidado.
• Anamnese completa de saúde integrativa, que a Ana usa para personalizar suas orientações.
• Check-in diário de sintomas, sono, digestão e energia, com relatório semanal da sua evolução.
• Guia de nutrição com receitas anti-inflamatórias feitas com ingredientes brasileiros.
• Protocolos acompanhados pela terapeuta, com calendário lunar.
• Envio de exames laboratoriais pelo próprio app, de forma privada e segura.

Como funciona:
1. Assim que o pagamento é confirmado, sua conta é liberada automaticamente com o e-mail da compra.
2. Você abre o app, digita o e-mail da compra, escolhe sua senha e começa o Dia 1 quando quiser.
3. A Ana acompanha suas respostas e envia suas orientações pelo app.

Importante: o Pacificar é um programa educativo e de acompanhamento em saúde integrativa. Ele não substitui consulta, diagnóstico ou tratamento médico. Não interrompa medicamentos sem orientação do seu médico.

Seus dados de saúde são tratados conforme a LGPD: só você e a sua terapeuta têm acesso.
```

> ⚠️ Os áudios diários ainda estão desligados no app (T-51: a Ana precisa gravar). Por isso a descrição **não** os promete. Quando eles forem ao ar, acrescente a frase "um áudio de orientação da Ana" na descrição.

**Categorias:** escolha as duas mais próximas na lista da Eduzz, nesta ordem de preferência: **Saúde e Bem-estar** · **Alimentação / Nutrição** (ou **Saúde e Esportes**, se for o nome disponível).

**Imagem do produto:** quadrada, no mínimo 1000 × 1000 px, JPG ou PNG, com a logo do Pacificar e o nome da jornada. Não use print do app com dado de paciente. Ponto de partida: `public/logo.png` e as artes de `finalizacao/refs/prompts-imagens-marca.md`.

**E-mail de suporte:** o e-mail profissional da Ana (o mesmo que ela vai usar no app como terapeuta). → **[preencher]**

### Formas de cobrança

| Campo | Resposta |
|---|---|
| Tipo de cobrança | **Única** (a jornada tem começo, meio e fim; não é assinatura) |
| Moeda | BRL (já vem fixo) |
| Preço | **R$ 1.500,00** (definido pela Ana em 12/11). Parcelamento: deixe o máximo que a Eduzz oferecer, ticket alto vende parcelado |
| Nome na fatura do cartão (EDZ + até 10 letras) | `PACIFICAR` (9 letras). Vai aparecer como **EDZ PACIFICAR**, que a pessoa reconhece e reduz chargeback |

### Recuperação de vendas

| Campo | Resposta |
|---|---|
| Recuperar vendas perdidas | **Ligado** |
| Nome do remetente do e-mail | `Ana Carla Nesi - Pacificar` |

### Entregas de produto

O acesso é entregue pelo nosso endpoint (`/api/eduzz-webhook`), que agora aceita **tanto o Webhook do Console quanto a Entrega Customizada do Órbita** (`https://github.com/eduzz/custom-delivery`, T-90). Em **Adicionar Entrega → Customizada**:

- **URL da Entrega Customizada:** `https://detoxpacificar21.vercel.app/api/eduzz-webhook`
  *(Atenção: na Entrega Customizada da Eduzz, a URL precisa terminar em `/api/eduzz-webhook`, porque a Eduzz faz um disparo HTTP para validar e entregar os dados da venda e exige retorno HTTP 200. Se usar a opção de "Redirecionamento / Link externo", aí sim o link é `https://detoxpacificar21.vercel.app`).*
- **Texto para o comprador:**
  ```
  Seu acesso ao Pacificar já foi liberado com o mesmo e-mail usado na compra!
  Acesse https://detoxpacificar21.vercel.app, digite o e-mail da sua compra e escolha uma senha (mínimo de 8 caracteres) para entrar na sua jornada.
  Qualquer dúvida, fale com a Ana pelo e-mail de suporte.
  ```

Não escolha Nutror, Alpaclass nem "área de membros": o conteúdo está no app.

### Direitos privados de etiqueta (PLR)

**Não preencher.** O conteúdo é autoral da Ana.

### Depois de salvar

Clique em **Pronto para vender** (vai para moderação). Quando o produto for criado, anote o **código/ID do produto** (Meus Produtos → coluna ID). Ele vai na variável `EDUZZ_PRODUCT_21D` (seção 4).

---

## 1B. Produtos de 7 dias e de upgrade (T-88)

Crie os dois do mesmo jeito da seção 1 (**Novo Produto → Produto digital**). Repita tudo o que não está escrito aqui: categorias, e-mail de suporte, cobrança **Única**, nome na fatura `PACIFICAR`, recuperação de vendas, entrega por link externo e PLR em branco. A **imagem** pode ser a mesma, com um selo "7 dias" ou "Upgrade".

> O webhook decide o plano **pelo ID do produto**. Por isso são três produtos separados, e não três ofertas do mesmo produto.

### Produto "Jornada de 7 dias"

**Título:**
```
Pacificar — Jornada de 7 Dias de Desinflamação e Saúde Integrativa
```

**Descrição:**
```
O Pacificar é um aplicativo de acompanhamento criado pela terapeuta Ana Carla Nesi (CRP 17/2833), que une Ayurveda, alimentação de verdade e saúde integrativa para ajudar você a desinflamar o corpo com gentileza e constância.

Esta é a jornada de 7 dias: a primeira semana do programa, dedicada à desinflamação e à limpeza do terreno biológico.

O que você recebe ao comprar:
• Acesso imediato ao app Pacificar logo após a confirmação do pagamento, usando o e-mail da compra. Funciona no celular e no computador e pode ser instalado na tela inicial.
• 7 dias guiados: a cada dia, um tema, cardápio sugerido (café da manhã, almoço, jantar e chá) e uma prática simples de autocuidado.
• Anamnese completa de saúde integrativa, que a Ana usa para personalizar suas orientações.
• Check-in diário de sintomas, sono, digestão e energia, com o relatório da sua primeira semana.
• Guia de nutrição com receitas anti-inflamatórias feitas com ingredientes brasileiros.
• Envio de exames laboratoriais pelo próprio app, de forma privada e segura.

Quer continuar depois dos 7 dias? Dentro do próprio app você pode desbloquear a jornada completa de 21 dias, sem recomeçar: seus registros continuam.

Como funciona:
1. Assim que o pagamento é confirmado, sua conta é liberada automaticamente com o e-mail da compra.
2. Você abre o app, digita o e-mail da compra, escolhe sua senha e começa o Dia 1 quando quiser.
3. A Ana acompanha suas respostas e envia suas orientações pelo app.

Importante: o Pacificar é um programa educativo e de acompanhamento em saúde integrativa. Ele não substitui consulta, diagnóstico ou tratamento médico. Não interrompa medicamentos sem orientação do seu médico.

Seus dados de saúde são tratados conforme a LGPD: só você e a sua terapeuta têm acesso.
```

**Preço:** [definir com a Ana]. Sugestão no início deste guia (R$ 397).
**Depois de salvar:** o ID vai em `EDUZZ_PRODUCT_7D`.

### Produto "Upgrade para 21 dias"

**Título:**
```
Pacificar — Upgrade para a Jornada Completa de 21 Dias
```

**Descrição:**
```
Upgrade exclusivo para quem já faz a jornada de 7 dias do Pacificar, o aplicativo de saúde integrativa e Ayurveda da terapeuta Ana Carla Nesi (CRP 17/2833).

O que você desbloqueia:
• Semana 2 · Agni e vitalidade: restauração do fogo digestivo, com sete novos dias de cardápio, prática de autocuidado e foco diário.
• Semana 3 · Harmonia mente-corpo: consolidação dos hábitos para que eles fiquem com você depois da jornada.
• Relatórios de evolução dos dias 14 e 21 (energia, sono, inchaço e digestão), acompanhados pela Ana.

Sua jornada continua de onde parou: anamnese, check-ins e exames ficam como estão.

Importante: compre com o MESMO e-mail que você usa para entrar no app. É por ele que o acesso é liberado, em poucos minutos após a confirmação do pagamento.

O Pacificar é um programa educativo e de acompanhamento em saúde integrativa. Ele não substitui consulta, diagnóstico ou tratamento médico.
```

**Preço:** [definir com a Ana]. Sugestão: R$ 1.103 (total igual aos 21 dias) ou R$ 997 (incentivo).
**Entrega (texto para o comprador):**
```
Pronto! Volte para o app Pacificar: em poucos minutos os dias 8 a 21 se abrem sozinhos.
Se ainda estiverem com cadeado, toque em "Já paguei, atualizar". Use sempre o mesmo e-mail do app.
```
**Vitrine:** não divulgue nem coloque na página de vendas. Ele só faz sentido para quem já tem os 7 dias, e quem compra sem ter conta recebe os 21 dias direto (o webhook trata assim, então nada quebra, mas sai mais barato que o produto de 21).
**Depois de salvar:**
1. O ID vai em `EDUZZ_PRODUCT_UPGRADE`.
2. Copie o **link do checkout** (Meus Produtos → produto → Links de divulgação / Checkout) e coloque em `VITE_EDUZZ_UPGRADE_URL` na Vercel. É o link que o botão "Desbloquear os 21 dias" abre.
3. O app acrescenta `?email=<e-mail da paciente>` ao link para tentar deixar o e-mail preenchido. Na compra de teste (seção 7), confira se o checkout vem com o e-mail preenchido. Se não vier, nada quebra: a pessoa digita, e a descrição já pede o mesmo e-mail.

---

## 2. O que preparar e enviar

### Da Ana

| Item | Para quê | Onde vai |
|---|---|---|
| E-mail profissional | Suporte na Eduzz e conta de terapeuta no app | Eduzz + script da seção 5 |
| Preço dos 21 dias | ✅ R$ 1.500 (12/11) | Eduzz |
| Preço dos 7 dias e do upgrade | Formulários da seção 1B (sugestão no início do guia) | Eduzz |
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

### 3.2 Aplicar as migrations ✅ feito em 09/11 e 13/11

No painel: **SQL Editor → New query**, cole o conteúdo de cada arquivo e rode, **nesta ordem**:

| Arquivo | Projeto restaurado | Projeto novo |
|---|---|---|
| `supabase/migrations/20260924042226_init.sql` | — | rodar |
| `supabase/migrations/20260924042616_rls.sql` | — | rodar |
| `supabase/migrations/20260924042701_rls_ajustes.sql` | — | rodar |
| `supabase/migrations/20260924042845_storage_exames.sql` | — | rodar |
| `supabase/migrations/20260924105403_pedidos_exclusao.sql` | — | rodar |
| `supabase/migrations/20261109120000_eduzz.sql` | **rodar** | rodar |
| `supabase/migrations/20261109230000_keepalive_cron.sql` | ✅ feito | rodar (e cadastrar os 2 segredos do Vault descritos no topo do arquivo) |
| `supabase/migrations/20261113120000_plano_dias.sql` | ✅ feito (13/11) | rodar |

Confirmação: em **Table Editor → profiles**, as colunas `eduzz_invoice_id` e `plan_days` existem (e `kiwify_order_id` não). Todas as contas que já existiam ficam com `plan_days = 21`.

Num projeto novo, depois de rodar a `plano_dias` pelo SQL Editor, registre-a no histórico para a CLI não tentar reaplicar (no projeto atual já está registrada):
```sql
insert into supabase_migrations.schema_migrations(version, name) values ('20261113120000', 'plano_dias');
```

> Se preferir, me chame numa sessão com o Supabase de volta no ar que eu aplico e testo (`supabase/tests/rls_test.sql`, testes E2E).

### 3.3 Autenticação (Authentication → Sign In / Providers e URL Configuration)

> ✅ Os 3 primeiros itens **já estão configurados** no Supabase (`zuhodbucdsabztgxefdq`), e o webhook cria a conta com `email_confirm: true` (sem verificação de e-mail). As URLs abaixo servem apenas caso a paciente use "Esqueci minha senha".

| Configuração | Valor | Situação |
|---|---|---|
| Allow new users to sign up | **Desligado** (`disable_signup = true`) | ✅ Já configurado |
| Minimum password length | **8** | ✅ Já configurado |
| Email OTP / link expiration | **86400** (24h) | ✅ Já configurado |
| Verificação de e-mail na compra | **Dispensada** (`email_confirm: true` no webhook + `api/primeiro-acesso.ts`) | ✅ Feito (T-89) |
| Site URL (opcional, para recuperação de senha) | `https://detoxpacificar21.vercel.app` | Configurar no painel se usar recuperação por e-mail |
| Redirect URLs (opcional, para recuperação de senha) | `https://detoxpacificar21.vercel.app/definir-senha` e `https://detoxpacificar21.vercel.app/**` | Configurar no painel se usar recuperação por e-mail |

### 3.4 E-mail de recuperação de senha (Resend — opcional para o go-live)

Como a compra libera a conta na hora sem verificação de e-mail (T-89), **você não precisa do Resend para vender nem para a paciente entrar no app**. O Resend só é usado se a paciente clicar em "Esqueci minha senha" para receber link por e-mail (enquanto não tiver, a Ana ou você podem redefinir).

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
| `EDUZZ_PRODUCT_21D` | ID do produto de 21 dias (seção 1) |
| `EDUZZ_PRODUCT_7D` | ID do produto de 7 dias (seção 1B) |
| `EDUZZ_PRODUCT_UPGRADE` | ID do produto de upgrade (seção 1B) |
| `VITE_EDUZZ_UPGRADE_URL` | link do checkout do upgrade (seção 1B). Vazio = o botão abre o WhatsApp da Ana |
| `EDUZZ_PRODUCT_IDS` | **não criar** (nome antigo; se existir, conta como 21 dias) |
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

1. **Onde fica a Secret:** no menu lateral esquerdo do Console (`console.eduzz.com`), embaixo de **Webhook**, clique em **Chaves de acesso** (`https://console.eduzz.com/webhook/secrets`). Lá aparece a chave **Padrão** (com botão de copiar ao lado da coluna *Secret*; se aparecer mascarada com `***`, clique em **+ Nova Secret** no canto superior direito, dê o nome `Pacificar app` e copie o valor gerado). Cole esse valor em `EDUZZ_WEBHOOK_SECRET` na Vercel → **Redeploy**.
2. **Webhook → Lista de configurações → Nova configuração** (ou editar a existente).
3. **URL para envio dos dados:** `https://detoxpacificar21.vercel.app/api/eduzz-webhook` e **Secret:** selecione a chave (`Padrão` ou a que você criou).
4. **Eventos** (MyEduzz → Fatura):
   - ✅ Paga (`myeduzz.invoice_paid`)
   - ✅ Reembolsada (`myeduzz.invoice_refunded`)
   - ✅ Chargeback (`myeduzz.invoice_chargeback`)
   - ✅ Cancelada (`myeduzz.invoice_canceled`)
5. **Filtro (opcional):** se a tela permitir filtrar por produto, marque os **três** produtos Pacificar (7 dias, 21 dias e upgrade). É redundante com as variáveis `EDUZZ_PRODUCT_*`, mas reduz chamadas. Se esquecer o upgrade aqui, o upgrade pago não libera nada.
6. Clique em **Verificar URL**, depois em **Testar eventos selecionados** (todos os 4 eventos respondem `200 OK` sem criar paciente fictício no banco) e **Salvar configuração** / **Ativar**.
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
8. **Plano de 7 dias e upgrade** (com outro e-mail seu, sem conta):
   - Compre o produto de **7 dias** com cupom de 100% → histórico: `"resultado":"acesso liberado: 7 dias"`. No app: "Dia 1 de 7" e os dias 8 a 21 com cadeado dourado.
   - Toque num dia com cadeado → a janela da oferta abre → **Desbloquear os 21 dias** → o checkout do upgrade abre (confira se o e-mail veio preenchido).
   - Compre o **upgrade** com cupom de 100% e o mesmo e-mail → histórico: `"resultado":"acesso liberado: 21 dias"`. Volte para o app: os dias se abrem sozinhos (ou toque em "Já paguei, atualizar").
   - **Reembolse só o upgrade** → histórico: `"upgrade estornado: volta para 7 dias"`. O app volta a mostrar cadeado a partir do dia 8, mas a pessoa continua entrando.
9. Me mande o JSON do evento (Histórico de envios → detalhes) **com nome, e-mail, CPF e endereço trocados por fictícios**. Eu salvo em `finalizacao/refs/` e fecho a T-36.

Se o passo 3 falhar, veja a seção 9.

---

## 8. Modo demonstração escondido

- **Na produção não existe botão.** Quem compra nunca vê dados fictícios.
- **Para abrir:** na tela de login, toque **5 vezes seguidas no logo** (em até 3 segundos). Abre a demo com a paciente fictícia "Camila", sem login e sem tocar no banco.
- **Dentro da demo:** o menu do topo (ícone de perfil) troca entre **Visão do paciente** e **Painel da terapeuta**, tem **Simular plano de 7 dias** (para a Ana ver a oferta de upgrade como a paciente vê) e **Sair da demonstração**.
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
| `"resultado":"ignorado: outro produto"` | ID errado em `EDUZZ_PRODUCT_7D` / `_21D` / `_UPGRADE` | Confira o ID do produto, corrija, faça redeploy e reenvie |
| Comprou o upgrade, mas os dias seguem com cadeado | Comprou com outro e-mail (o histórico mostra `suspensão sem conta` ou cria uma conta nova) ou faltou o redeploy depois de criar `EDUZZ_PRODUCT_UPGRADE` | Painel da Ana → paciente → Prescrição → **Liberar 21 dias**. Depois confira as variáveis |
| Botão "Desbloquear os 21 dias" abre o WhatsApp | `VITE_EDUZZ_UPGRADE_URL` vazia ou sem redeploy | Cadastre o link (1B) e faça redeploy (variável `VITE_` só entra no build) |
| Paciente de 7 dias recebeu 21 | Produto de 7 dias não está em `EDUZZ_PRODUCT_7D` e todas as variáveis estão vazias (aí qualquer produto libera 21) | Preencha as três variáveis. Corrija a paciente no painel (**Voltar para 7 dias**) |
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
- [x] Migration `plano_dias` aplicada (coluna `plan_days` existe)
- [ ] Preços dos 7 dias e do upgrade definidos com a Ana
- [ ] Três produtos aprovados na moderação da Eduzz e IDs em `EDUZZ_PRODUCT_21D`, `_7D` e `_UPGRADE`
- [ ] Link do checkout do upgrade em `VITE_EDUZZ_UPGRADE_URL`
- [ ] Webhook ativo na Eduzz, ping com `"assinatura":"hex"` ou `"base64"`
- [ ] Compra de teste → convite → senha → app → reembolso → acesso suspenso
- [ ] Compra de 7 dias → cadeado no dia 8 → upgrade → 21 dias liberados → estorno do upgrade → volta para 7
- [ ] Política de privacidade e termos validados (T-61)
- [ ] Testado em iPhone e Android reais (T-74)
