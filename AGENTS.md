# AGENTS.md — PACIFICAR

Regras para **qualquer agente** neste repositório (Claude Code, Antigravity, Codex…). Leia inteiro antes de mexer em código.

## O projeto

PWA de saúde integrativa e Ayurveda da terapeuta **Ana Carla Nesi**: jornada de 21 dias com anamnese, check-in diário, nutrição e protocolos.
Stack: Vite + React 19 + TypeScript + Tailwind 4 + vite-plugin-pwa. Destino: **Vercel** (front + funções em `api/`) e **Supabase** (Postgres, Auth, Storage). Venda pela **Kiwify**, cujo webhook cria o login.

Estamos na **fase de finalização**:
- O que fazer e em que ordem: [finalizacao/TAREFAS.md](finalizacao/TAREFAS.md) (fonte da verdade)
- Por quê, arquitetura e decisões: [finalizacao/PLANO.md](finalizacao/PLANO.md)
- O que cada sessão já fez: [finalizacao/logs/](finalizacao/logs/)
- O que o Gabriel já validou: checklist visual em https://claude.ai/artifact/Mm2y53TBiG4NmCFUxJzhfQ (só ele marca)

## Protocolo de sessão (obrigatório)

Use seu nome de agente em minúsculas: `claude`, `antigravity`, `codex`. Se houver duas sessões da mesma ferramenta ao mesmo tempo, use `claude-2`.

1. **Situe-se:** `npm run status` e `npm run log:ultimos`. No Claude Code isso chega sozinho pelo hook de início de sessão.
2. **Escolha UMA tarefa** da lista "PRONTAS PARA AGENTE". Nunca pegue uma marcada como em andamento (`[~]`).
3. **Reserve:** `npm run tarefa -- iniciar T-NN <agente>` e faça o commit na hora: `git commit -m "[T-NN] iniciar" -- finalizacao/TAREFAS.md`. É isso que avisa as outras sessões.
4. **Trabalhe.** Commits pequenos, sempre com a marca: `[T-NN] o que mudou`. Faça `git add` só dos arquivos que você tocou. **Nunca** use `git add -A` nem `git add .`, porque outra sessão pode estar trabalhando na mesma pasta.
5. **Valide** o critério de aceite da tarefa, mais `npm run lint` e `npm run build`.
6. **Feche:**
   ```
   npm run tarefa -- concluir T-NN <agente>
   npm run log -- T-NN <agente>
   ```
   Preencha as seções do log ("O que foi feito", "Decisões", "Como testar", "Pendências") e faça o commit `[T-NN] concluir e registrar log` com `TAREFAS.md` e o arquivo de log.
7. **Travou?** `npm run tarefa -- bloquear T-NN "motivo objetivo"`, crie o log mesmo assim e faça o commit. Não fique rodando em círculos.

Ajuste fora de qualquer tarefa: commit com `[infra]` ou `[docs]` e log com `npm run log -- infra <agente>`.

## Regras

- **Uma tarefa por sessão.** Achou outro problema? Não resolva junto. Adicione uma tarefa nova em `TAREFAS.md` (próximo número livre da fase, mesmo formato de linha, com `@dono` e `dep:`) e cite no seu log.
- **Tarefas só de `@gabriel` ou `@ana` não são suas.** Você pode deixar no log um passo a passo para a pessoa executar.
- **Não edite `TAREFAS.md` à mão para mudar status.** Use `npm run tarefa`, porque o formato é lido pelos scripts e hooks.
- **Não edite o log de outra sessão.**
- **Mudou uma decisão?** Atualize a tabela "Decisões" do `PLANO.md` no mesmo commit.
- **Segredos:** nunca em código, log ou commit. A `SUPABASE_SERVICE_ROLE_KEY` só existe dentro de `api/`. Nenhuma variável `VITE_*` pode conter segredo, porque vai para o navegador.
- **Dado de saúde é sensível (LGPD).** Nunca em `console.log`, logs de sessão ou fixtures. Payloads em `finalizacao/refs/` vão sempre anonimizados.
- **Banco:** toda mudança de schema é uma **migration nova** em `supabase/migrations/`. Nunca edite uma migration que já foi aplicada.
- **Design:** use os componentes de `src/components/ui/Primitives.tsx` e os tokens de `src/index.css`. Textos em português do Brasil, com tom acolhedor.
- **Trilhas paralelas:** só rode sessões simultâneas em trilhas diferentes (tabela em `PLANO.md` → "Trilhas"). A T-14 roda sozinha.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | App em http://localhost:3000 |
| `npm run build` | Build de produção |
| `npm run lint` | Typecheck. Os scripts chamam `node ./node_modules/...` direto, porque o `&` no nome da pasta quebra o `npx` e o `.bin` do npm no Windows. |
| `npm run status` | Progresso, tarefas em andamento, bloqueadas e prontas |
| `npm run tarefa -- <iniciar\|concluir\|bloquear\|liberar> T-NN ...` | Muda o status de uma tarefa |
| `npm run log -- T-NN <agente>` | Cria o log da sessão com commits e arquivos já preenchidos |
| `npm run log:ultimos` | Últimos 5 logs e suas pendências |

## Hooks ativos

| Hook | Ferramenta | Efeito |
|---|---|---|
| `commit-msg` (git) | todas | Recusa commit sem `[T-NN]`, `[infra]` ou `[docs]` na mensagem |
| `SessionStart` | Claude Code | Injeta o status e os últimos logs no contexto |
| `Stop` | Claude Code | Não deixa encerrar se uma tarefa foi concluída hoje sem log |
| `SessionEnd` | Claude Code | Registro automático em `finalizacao/logs/.sessoes.jsonl` (local) |
| Workflows `/iniciar-sessao` e `/encerrar-sessao` | Antigravity | Mesmo protocolo, disparado por comando |

Os git hooks são ativados pelo `npm install` (script `prepare`). Se um commit passar sem validação, rode `node finalizacao/scripts/instalar-hooks.mjs`.

## Mapa do código

| Caminho | Conteúdo |
|---|---|
| `src/App.tsx` | Navegação por estado (`activeTab` + `subScreen`). Não há router. |
| `src/context/AppContext.tsx` | Estado global. Hoje salva tudo em `localStorage` (a T-14 migra para o Supabase). |
| `src/data/anamneseSchema.ts` | Anamnese orientada a dados: um renderizador desenha tudo |
| `src/data/journeyDays.ts` | Conteúdo dos 21 dias, incluindo os roteiros dos áudios |
| `src/data/mockData.ts` | Dados fictícios. Sai do build de produção na T-56. |
| `src/lib/supabase.ts` | Cliente Supabase (existe, mas ainda não é usado) |
| `api/` | Funções serverless da Vercel (a criar) |
| `supabase/migrations/` | Schema versionado (a criar) |
| `finalizacao/` | Plano, tarefas, logs, scripts e hooks desta fase |
