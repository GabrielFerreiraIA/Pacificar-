# Plano de finalização — PACIFICAR

> Documento de referência. **O estado das tarefas vive em [TAREFAS.md](TAREFAS.md)**, não aqui.
> Mudou uma decisão? Edite a seção "Decisões" e registre no log da sessão.

## Objetivo

Levar o protótipo atual (100% `localStorage`, sem login) a um produto vendável:

1. O paciente compra na **Kiwify** → recebe e-mail → define senha → entra no app.
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
 Kiwify ──webhook──▶ Vercel /api/kiwify-webhook ──service role──▶ Supabase Auth (convite por e-mail)
                                                              └──▶ tabela purchases + profiles
 Paciente (PWA) ──anon key + sessão──▶ Supabase (Postgres com RLS, Storage "exames")
 Vercel Cron (1x/dia) ─┐
 GitHub Actions (12h) ─┴──▶ Vercel /api/keepalive ──▶ insert/select na tabela heartbeat
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
| D3 | Idempotência do webhook pela chave única `purchases (order_id, event)` | A Kiwify reenvia eventos. Aprovação e reembolso chegam com o mesmo `order_id`, então a unicidade só por pedido descartaria o reembolso. |
| D4 | Keep-alive com **duas fontes**: Vercel Cron diário + GitHub Actions a cada 12h | A Vercel Hobby só permite cron 1x/dia, com horário impreciso. A redundância garante margem folgada dentro da janela de 7 dias. |
| D5 | O keep-alive faz **escrita e leitura reais** no Postgres, não só um ping HTTP | O Supabase mede "atividade de banco". Um ping sem query pode não contar. |
| D6 | Áudios em `public/audio/` (mp3 mono 64 kbps), **não** no Supabase Storage | O plano gratuito do Supabase tem 5 GB/mês de egress. 100 pacientes × 21 áudios estouram isso. A Vercel tem 100 GB. |
| D7 | Repositório **privado** no GitHub | Os outros repos do usuário são públicos. Este tem regra de negócio de cliente e config de pagamento. |
| D8 | Questionário de doshas como módulo opcional fora da anamnese (`subScreen: 'doshas'`) | Aprovado na análise do áudio da cliente. Não pode contar no progresso da anamnese. |
| D9 | SMTP próprio (Resend, grátis até 3 mil e-mails/mês) no Supabase Auth | O SMTP padrão do Supabase só envia para membros da equipe e tem limite mínimo. Sem isso, o convite de compra não chega. |
| D10 | Migrations aplicadas pela API de gestão do Supabase; o arquivo local usa a versão (timestamp) que o servidor gravou | Mantém `supabase/migrations/` e o histórico remoto iguais, para a CLI não reaplicar nada |
| D11 | Exames: 10 MB por arquivo, cota de 20 arquivos por paciente (policy no Storage) e fotos comprimidas no aparelho antes do envio (T-50) | O Storage gratuito tem 1 GB no total. Foto de celular cai de ~3 MB para ~300 KB. PDF escaneado de laboratório precisa da folga de 10 MB. |
| D12 | Supabase Auth: **cadastro público desligado**, senha mínima de 8, link de convite/recuperação válido por 24h. Ao sair, o app apaga o cache local | Acesso só por compra (D1): com o cadastro aberto, qualquer um com a chave pública criaria conta. Quem compra nem sempre abre o e-mail na primeira hora. Celular pode ser compartilhado (LGPD). |

## Riscos que o Gabriel precisa conhecer

1. **Vercel Hobby é só para uso não comercial.** O app é vendido, então tecnicamente viola os termos. Tudo neste plano roda igual no Pro (US$ 20/mês), e a troca é só de plano, sem mudar código. Decidir até o go-live (tarefa T-81).
2. **Supabase gratuito não tem backup baixável.** Para dado de saúde, um dump manual mensal é o mínimo (T-82).
3. **Limites do Supabase gratuito:** 500 MB de banco, 1 GB de storage (exames em PDF/foto), 50 mil usuários ativos por mês. Folgado para o começo. Monitorar o storage.
4. **A Kiwify não documenta o payload nem a assinatura do webhook.** O formato precisa ser capturado de um evento real (T-30) antes de implementar (T-31). Referências da comunidade indicam `?signature=` com HMAC-SHA1 do corpo usando o token do webhook. **Confirmar com o evento real.**
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

## Fluxo Kiwify em detalhe (Fase 3)

| Evento Kiwify | Ação |
|---|---|
| `compra_aprovada` | Se o e-mail não existe no Auth → `inviteUserByEmail` com `redirectTo = APP_URL/definir-senha`. Se já existe → reativa (`access_status = 'active'`). Cria/atualiza `profiles` (nome, telefone, `kiwify_order_id`, `journey_start_date = hoje`). |
| `compra_reembolsada`, `chargeback` | `access_status = 'revoked'`. |
| demais | Só registra em `purchases`. |

Toda chamada é registrada em `purchases` (`(order_id, event)` único, `event`, `email`, `payload jsonb`, `processed_at`, `error`). Responder **200 rapidamente** mesmo em evento ignorado. Responder 401 em assinatura inválida.

## Trilhas de trabalho paralelo

Depois da Fase 0, dá para rodar sessões em paralelo **desde que cada uma fique numa trilha** (as trilhas não mexem nos mesmos arquivos):

| Trilha | Tarefas | Arquivos principais |
|---|---|---|
| **A — Backend** | Fases 1, 2, 3 | `supabase/`, `api/kiwify-*`, `src/lib/`, `src/context/`, telas de login |
| **B — Infra** | Fase 4, T-80 | `api/keepalive.ts`, `vercel.json`, `.github/` |
| **C — Front/conteúdo** | T-52, T-53, T-55, Fase 7 | `src/pages/`, `src/components/`, `src/data/`, `public/` |

T-14 (migrar o AppContext) toca em quase tudo: rode **sozinha**, sem outra sessão da trilha C ativa.

## Variáveis de ambiente

| Nome | Onde | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` | Vercel + `.env.local` | cliente |
| `VITE_SUPABASE_ANON_KEY` | Vercel + `.env.local` | cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | **só Vercel** (nunca `VITE_`) | funções `api/` |
| `KIWIFY_WEBHOOK_TOKEN` | só Vercel | validar assinatura |
| `CRON_SECRET` | Vercel + GitHub Secrets | keep-alive |
| `APP_URL` | Vercel + GitHub Secrets | redirects e keep-alive |
