# Plano de finalização — PACIFICAR

> Documento de referência. **O estado das tarefas vive em [TAREFAS.md](TAREFAS.md)**, não aqui.
> Mudou uma decisão? Edite a seção "Decisões" e registre no log da sessão.

## Objetivo

Levar o protótipo atual (100% `localStorage`, sem login) a um produto vendável:

1. O paciente compra na **Eduzz** → recebe e-mail → define senha → entra no app.
2. Todos os dados (anamnese, check-ins, exames) ficam no **Supabase**, e a Ana vê tudo no painel.
3. O app roda na **Vercel** (front + funções serverless), com custo zero enquanto couber nos planos gratuitos.
4. O Supabase gratuito **nunca pausa** por inatividade.

## Estado de partida (auditado em 24/09/2026)

| Área | Situação |
|---|---|
| Front-end | Completo como protótipo. Build e typecheck passam. 21 dias de conteúdo prontos. |
| Backend | Inexistente. `src/lib/supabase.ts` cria o cliente, mas **nada chama ele**. |
| Login | Inexistente. Qualquer pessoa entra como a paciente fictícia "Camila". |
| Segurança | O menu "Modo de demonstração" transforma qualquer usuário em terapeuta. |
| Exames | Upload falso (`file_url: '#'`). |
| Áudios | Não existem. O player usa voz sintética do navegador. |
| Repositório | Nenhum commit, nenhum remote. Não existe repo no GitHub. |

## Arquitetura alvo

```
 Eduzz ───webhook──▶ Vercel /api/eduzz-webhook ──service role──▶ Supabase Auth (convite por e-mail)
                                                              └──▶ tabela purchases + profiles
 Paciente (PWA) ──anon key + sessão──▶ Supabase (Postgres com RLS, Storage "exames")
 Vercel Cron (1x/dia) ─┐
 GitHub Actions (12h) ─┴──▶ Vercel /api/keepalive ──▶ insert/select na tabela heartbeat
 Supabase pg_cron (6h) ──▶ insert no heartbeat + pg_net POST /rest/v1/rpc/keepalive_status
 Áudios da jornada ──▶ arquivos estáticos em public/audio (servidos pela CDN da Vercel)
```

- **Front:** Vite + React 19 como já está. Sem migrar para Next.js.
- **Funções:** pasta `api/` na raiz (Vercel Functions, Node). Só elas conhecem a `SUPABASE_SERVICE_ROLE_KEY`.
- **Banco:** migrations SQL versionadas em `supabase/migrations/`. Toda mudança de schema passa por migration.
- **Offline:** o `localStorage` continua como cache. O Supabase é a fonte da verdade.

## Decisões

| # | Decisão | Motivo |
|---|---|---|
| D1 | Login por **convite** (`auth.admin.inviteUserByEmail`) disparado pelo webhook | A pessoa define a própria senha, e não trafega senha por e-mail |
| D2 | Reembolso/chargeback **suspende** o acesso (`profiles.access_status = 'revoked'`), não apaga | Preserva o histórico clínico e permite reativar |
| D3 | Idempotência do webhook pela chave única `purchases (order_id, event)` | A plataforma de venda reenvia eventos. Aprovação e reembolso chegam com o mesmo `order_id`, então a unicidade só por pedido descartaria o reembolso. |
| D4 | Keep-alive com **quatro fontes**: Vercel Cron diário + GitHub Actions a cada 12h + n8n do Gabriel a cada 12h (`finalizacao/n8n/keepalive-supabase.json`, fonte `n8n`) + `pg_cron` no próprio Supabase a cada 6h (T-44) | A Vercel Hobby só permite cron 1x/dia, com horário impreciso. O `pg_cron` funciona mesmo sem deploy (o projeto pausou em out/2026 por isso) e, além de gravar no `heartbeat`, faz uma chamada HTTP real à API REST via `pg_net`, porque escrita interna sozinha pode não contar como atividade. |
| D5 | O keep-alive faz **escrita e leitura reais** no Postgres, não só um ping HTTP | O Supabase mede "atividade de banco". Um ping sem query pode não contar. |
| D6 | Áudios em `public/audio/` (mp3 mono 64 kbps), **não** no Supabase Storage | O plano gratuito do Supabase tem 5 GB/mês de egress. 100 pacientes × 21 áudios estouram isso. A Vercel tem 100 GB. |
| D7 | Repositório **privado** no GitHub | Os outros repos do usuário são públicos. Este tem regra de negócio de cliente e config de pagamento. |
| D8 | Questionário de doshas como módulo opcional fora da anamnese (`subScreen: 'doshas'`) | Aprovado na análise do áudio da cliente. Não pode contar no progresso da anamnese. |
| D9 | SMTP próprio (Resend, grátis até 3 mil e-mails/mês) no Supabase Auth | O SMTP padrão do Supabase só envia para membros da equipe e tem limite mínimo. Sem isso, o convite de compra não chega. |
| D10 | Migrations aplicadas pela API de gestão do Supabase; o arquivo local usa a versão (timestamp) que o servidor gravou | Mantém `supabase/migrations/` e o histórico remoto iguais, para a CLI não reaplicar nada |
| D11 | Exames: 10 MB por arquivo, cota de 20 arquivos por paciente (policy no Storage) e fotos comprimidas no aparelho antes do envio (T-50) | O Storage gratuito tem 1 GB no total. Foto de celular cai de ~3 MB para ~300 KB. PDF escaneado de laboratório precisa da folga de 10 MB. |
| D13 | Venda pela **Eduzz** (não mais Kiwify). Webhook `api/eduzz-webhook.ts`, coluna `profiles.eduzz_invoice_id` | Decisão comercial de 09/11/2026. A Eduzz documenta o payload e a assinatura (`x-signature`, HMAC-SHA256), o que dispensa a captura prévia que a Kiwify exigia. |
| D14 | Modo demo **sem botão**: 5 toques no logo da tela de login. O `mockData` vira um chunk separado, baixado só ao abrir a demo | A Ana continua apresentando o app em produção sem expor dados fictícios a quem compra. Substitui a variável `VITE_DEMO` (T-85), que segue só como atalho visível em preview. |
| D15 | **Duas versões no mesmo app: 7 e 21 dias**, com upgrade 7→21 vendido dentro do app. Coluna `profiles.plan_days` (7 ou 21, padrão 21, protegida). Três produtos na Eduzz (`EDUZZ_PRODUCT_7D`, `_21D`, `_UPGRADE`); o webhook decide o plano pelo ID do produto. Compra paga nunca reduz o plano. Estorno do upgrade volta para 7 (não suspende), estorno da jornada suspende. Checkout do upgrade em `VITE_EDUZZ_UPGRADE_URL`; sem ele, o botão abre o WhatsApp da Ana | Pedido da Ana em 12/11/2026: 21 dias a R$ 1.500 e uma opção de 7 dias mais barata. Um só sistema evita manter dois apps, e o upgrade dentro do app aproveita o fim da primeira semana, quando a vontade de continuar é maior. O `current_day` continua avançando até 21; o que limita é `min(current_day, plan_days)`, então o upgrade abre o dia 8 na hora, sem ajuste de dados. |
| D12 | Supabase Auth: **cadastro público desligado**, senha mínima de 8, link de convite/recuperação válido por 24h. Ao sair, o app apaga o cache local | Acesso só por compra (D1): com o cadastro aberto, qualquer um com a chave pública criaria conta. Quem compra nem sempre abre o e-mail na primeira hora. Celular pode ser compartilhado (LGPD). |
| D16 | **Acesso imediato sem verificação de e-mail (T-89):** o webhook cria a conta com `auth.admin.createUser({ email, email_confirm: true, user_metadata: { needs_password: true } })`. Na primeira entrada no app (`api/primeiro-acesso.ts`), a senha escolhida pela paciente (mín. 8 caracteres) é gravada e `needs_password` vira `false` | Pedido do Gabriel em 13/11/2026: substitui D1 (`inviteUserByEmail`) para não depender de verificação de e-mail nem de Resend/SMTP para liberar quem comprou. Contas que já definiram senha nunca têm a senha sobrescrita pelo endpoint de primeiro acesso. |
| D17 | **`api/eduzz-webhook.ts` aceita tanto o Webhook do Console quanto a Entrega Customizada do Órbita (`eduzz/custom-delivery`, T-90)** | Na Entrega Customizada do produto no Órbita, a Eduzz envia `GET`/`POST` para validar a URL da oferta (exigindo HTTP 200) e depois envia `{ type: 'create'\|'remove', sid, nsid, fields: { edz_* } }` sem header `x-signature` (autenticado por `edz_cli_origin_secret` e `nsid` SHA-1). Aceitar os dois formatos no mesmo endpoint evita falha de validação da oferta. |

## Riscos que o Gabriel precisa conhecer

1. **Vercel Hobby é só para uso não comercial.** O app é vendido, então tecnicamente viola os termos. Tudo neste plano roda igual no Pro (US$ 20/mês), e a troca é só de plano, sem mudar código. Decidir até o go-live (tarefa T-81).
2. **Supabase gratuito não tem backup baixável.** Para dado de saúde, um dump manual mensal é o mínimo (T-82).
3. **Limites do Supabase gratuito:** 500 MB de banco, 1 GB de storage (exames em PDF/foto), 50 mil usuários ativos por mês. Folgado para o começo. Monitorar o storage.
4. **A Eduzz não diz se a assinatura vem em hex ou base64.** O webhook aceita as duas e informa qual bateu na resposta do ping (`"assinatura": "hex"`). Se vier `"invalida"`, a chave cadastrada na Vercel não é a mesma do Console da Eduzz (T-36).
5. **Áudios dependem da Ana gravar.** É o caminho crítico de prazo: pedir já.

## Keep-alive em detalhe (Fase 4)

```sql
create table public.heartbeat (id bigint generated always as identity primary key, source text not null, created_at timestamptz default now());
alter table public.heartbeat enable row level security; -- sem policies: só a service role acessa
```

`api/keepalive.ts`:
1. Rejeita se o header `Authorization` não for `Bearer ${CRON_SECRET}`. A Vercel envia esse header automaticamente nos crons quando a env `CRON_SECRET` existe.
2. Faz `insert` em `heartbeat` com `source` = `vercel-cron` ou `github-actions` (via query `?src=`).
3. Faz `select count(*)` e apaga linhas com mais de 30 dias.
4. Responde `{ ok, source, at }`.

`vercel.json`:
```json
{ "crons": [{ "path": "/api/keepalive?src=vercel-cron", "schedule": "0 9 * * *" }] }
```

`.github/workflows/keepalive.yml`: `schedule: cron '0 */12 * * *'` + `workflow_dispatch`, com `curl -fsS -H "Authorization: Bearer $CRON_SECRET" "$APP_URL/api/keepalive?src=github-actions"`. Secrets no GitHub: `CRON_SECRET` e `APP_URL`.

> O GitHub desativa workflows agendados após 60 dias sem atividade **apenas em repositórios públicos**. Mais um motivo para o repo ser privado (D7).

**Critério de aceite:** a tabela `heartbeat` mostra linhas das duas fontes por 7 dias seguidos, sem nenhum acesso humano ao projeto.

## Fluxo Eduzz em detalhe (Fase 3)

Referência oficial: https://developers.eduzz.com/docs/webhook e https://developers.eduzz.com/reference/webhook/myeduzz-invoice-paid

Envelope: `{ id, event, data, sentDate }`. Header `x-signature` = HMAC-SHA256 do corpo com a chave secreta do webhook (`EDUZZ_WEBHOOK_SECRET`).

| Evento Eduzz | Ação |
|---|---|
| `ping` | Responde 200 sempre (senão a URL não ativa) e devolve `assinatura` = `hex`, `base64` ou `invalida`. |
| (todos) | Antes de tudo, `tipoDoProduto(data.items[].productId)` → `7d`, `21d`, `upgrade` ou `null` (outro produto: ignora). Sem nenhuma `EDUZZ_PRODUCT_*` configurada, qualquer produto vale `21d` (D15). |
| `myeduzz.invoice_paid` | Grava `plan_days` (7 para `7d`, 21 para `21d`/`upgrade`, nunca reduz). E-mail de `data.student` (quem recebe o acesso) ou de `data.buyer`. Sem conta → `createUser({ email, email_confirm: true, user_metadata: { needs_password: true } })` (D16). Com conta → reativa. Grava nome, celular, `eduzz_invoice_id = data.id` e `journey_start_date = hoje` (se ainda vazio). |
| `myeduzz.invoice_refunded` | `access_status = 'revoked'`. Se o produto for o upgrade: só `plan_days = 7`. |
| `myeduzz.invoice_chargeback` | Suspende; se `data.chargeback.status = 'rejected'` (contestação recusada), reativa. A chave de idempotência inclui o status. |
| `myeduzz.invoice_canceled` e demais | Só registra em `purchases`. |

`EDUZZ_PRODUCT_7D`, `EDUZZ_PRODUCT_21D` e `EDUZZ_PRODUCT_UPGRADE` dizem qual produto libera qual plano e restringem a liberação aos produtos do app, para outras vendas da Ana na mesma conta não criarem login. `EDUZZ_PRODUCT_IDS`, o nome antigo, ainda vale como 21 dias.
Em `purchases.payload` vai só um resumo (id, status, produtos, valor): **sem CPF nem endereço** (LGPD).
Respostas: 401 assinatura inválida, 200 processado/duplicado/ignorado, 500 falha (a Eduzz pode reenviar com segurança).

## Trilhas de trabalho paralelo

Depois da Fase 0, dá para rodar sessões em paralelo **desde que cada uma fique numa trilha** (as trilhas não mexem nos mesmos arquivos):

| Trilha | Tarefas | Arquivos principais |
|---|---|---|
| **A — Backend** | Fases 1, 2, 3 | `supabase/`, `api/eduzz-*`, `src/lib/`, `src/context/`, telas de login |
| **B — Infra** | Fase 4, T-80 | `api/keepalive.ts`, `vercel.json`, `.github/` |
| **C — Front/conteúdo** | T-52, T-53, T-55, Fase 7 | `src/pages/`, `src/components/`, `src/data/`, `public/` |

T-14 (migrar o AppContext) toca em quase tudo: rode **sozinha**, sem outra sessão da trilha C ativa.

## Variáveis de ambiente

| Nome | Onde | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel + `.env.local` | cliente |
| `VITE_SUPABASE_ANON_KEY` | Vercel + `.env.local` | cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | **só Vercel** (nunca `VITE_`) | funções `api/` |
| `EDUZZ_WEBHOOK_SECRET` | só Vercel | validar `x-signature` do webhook |
| `EDUZZ_PRODUCT_7D` / `_21D` / `_UPGRADE` | só Vercel | ids dos produtos de cada versão (D15) |
| `VITE_EDUZZ_UPGRADE_URL` | Vercel (público) | link do checkout do upgrade, aberto pelo app |
| `VITE_ANA_WHATSAPP` | Vercel (público) | contato da Ana e reserva do botão de upgrade |
| `CRON_SECRET` | Vercel + GitHub Secrets | keep-alive |
| `APP_URL` | Vercel + GitHub Secrets | redirects e keep-alive |
