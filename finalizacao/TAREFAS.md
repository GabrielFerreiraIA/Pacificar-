# Tarefas — PACIFICAR

<!--
FORMATO RÍGIDO — os scripts e hooks leem este arquivo. Não mude a sintaxe da linha de tarefa:
- [S] **T-NN** Título · @dono · dep: T-AA, T-BB · nota opcional
S: " " livre | "~" em andamento | "x" concluída | "!" bloqueada
Donos: @agente (Claude/Antigravity executa) · @gabriel (ação humana) · @ana (cliente)
Use os comandos em vez de editar à mão:  npm run tarefa -- iniciar|concluir|bloquear|liberar T-NN ...
-->

## Fase 0 · Fundação do repositório

- [!] **T-01** Commit inicial, branch main e repositório privado no GitHub · @gabriel @agente · dep: — · bloqueada: commit inicial e branch main feitos; falta o Gabriel criar o repo privado no GitHub e dar push (gh não instalado nesta máquina) (2026-09-24)
  - Aceite: `git log` mostra o commit inicial na branch `main`. Remote `origin` aponta para um repo **privado**. Push feito. Nenhum `.env` commitado.
- [x] **T-02** Higiene do projeto (nome, README, dependências mortas, .gitignore) · @agente · dep: T-01 · concluída: claude (2026-09-24)
  - `package.json`: nome `pacificar-app`, versão `0.1.0`. Remover `express`, `dotenv`, `@google/genai`, `motion` e `@types/express` (nenhum é importado em `src/`).
  - `.gitignore`: incluir `dev-dist/` e `.env.local`. README real (como rodar, env vars, link para AGENTS.md).
  - `.env.example` com as variáveis do PLANO.md (sem as do AI Studio).
  - Aceite: `npm run lint` e `npm run build` passam.
- [ ] **T-03** Renomear a pasta do projeto para `pacificar-app` (sem "&" e sem acentos) · @gabriel · dep: T-01
  - O `&` no caminho quebra o `npx` no Windows. Fechar todas as sessões antes de renomear.
- [ ] **T-04** Conectar a Vercel ao repositório (deploy de preview automático) · @gabriel · dep: T-01
  - Aceite: cada push em `main` gera deploy. URL anotada em `PLANO.md` → `APP_URL`.

## Fase 1 · Supabase (banco de dados)

- [x] **T-10** Criar o projeto Supabase (região São Paulo) e cadastrar as chaves · @gabriel · dep: T-01 · concluída: gabriel (2026-09-24)
  - Chaves em `.env.local` e nas env vars da Vercel (ver tabela no PLANO.md).
- [x] **T-11** Migration inicial do schema · @agente · dep: T-10 · concluída: claude (2026-09-24)
  - `supabase/migrations/0001_init.sql`: `profiles` (id = auth.users, role, full_name, phone, access_status, journey_start_date, kiwify_order_id), `anamneses` (answers jsonb, completed), `checkins`, `lab_exams`, `prescriptions`, `parasite_cycles`, `zeolite_days`, `preparo_checked`, `dosha_results`, `consents`, `purchases`, `heartbeat`.
  - Trigger que cria `profiles` ao surgir um `auth.users`.
  - Aceite: a migration aplica num banco vazio sem erro. Tipos gerados em `src/types/database.ts`.
- [x] **T-12** Políticas RLS (paciente vê só o próprio, terapeuta vê tudo) · @agente · dep: T-11 · concluída: claude (2026-09-24)
  - Função `is_admin()` com `security definer`. Toda tabela com RLS ligada. `purchases` e `heartbeat` sem policy (só service role).
  - Aceite: script SQL de teste prova que o paciente A não lê dados do paciente B.
- [x] **T-13** Bucket privado `exames` no Storage com policies por pasta do usuário · @agente · dep: T-12 · concluída: claude (2026-09-24)
  - Caminho `{user_id}/{arquivo}`. Leitura por signed URL. Limite de 10 MB, só PDF/JPG/PNG/HEIC.
- [ ] **T-14** Migrar o AppContext de localStorage para Supabase · @agente · dep: T-12, T-21
  - Camada `src/lib/api/*.ts` por entidade. `localStorage` vira só cache offline. Auto-save da anamnese com debounce.
  - **Rodar sozinha:** toca em quase todos os arquivos (ver PLANO.md → Trilhas).
  - Aceite: preencher a anamnese no celular e ver as respostas no notebook com o mesmo login.
- [ ] **T-15** Criar a conta de terapeuta da Ana (role admin) · @gabriel @agente · dep: T-12
  - Script `supabase/seed_admin.sql` parametrizado por e-mail. Nada de senha no repositório.

## Fase 2 · Autenticação

- [ ] **T-20** SMTP próprio (Resend) no Supabase e e-mails em português · @gabriel @agente · dep: T-10
  - Gabriel cria a conta no Resend e verifica o domínio. O agente escreve os templates HTML de convite e de recuperação de senha em `supabase/templates/`.
  - Aceite: um convite enviado pelo painel chega na caixa de entrada, não no spam.
- [ ] **T-21** Telas de login, esqueci a senha e definir senha · @agente · dep: T-10
  - E-mail + senha, recuperação, rota `/definir-senha` (convite e reset), logout no menu. Seguir o design system de `src/components/ui/Primitives.tsx`.
- [ ] **T-22** Guarda de sessão e remoção do "Modo de demonstração" · @agente · dep: T-21
  - Sem sessão, só a tela de login renderiza. `role` vem de `profiles.role`. O menu "Modo de demonstração" (`AppHeader.tsx`) só existe com `import.meta.env.DEV`.
  - Aceite: um paciente logado não consegue abrir o painel da terapeuta de nenhum jeito.
- [ ] **T-23** Tela de acesso suspenso (reembolso/chargeback) · @agente · dep: T-22
  - Quando `access_status = 'revoked'`, mostra mensagem acolhedora e o contato da Ana.

## Fase 3 · Kiwify (compra cria o login)

- [ ] **T-30** Capturar um payload real do webhook da Kiwify · @gabriel @agente · dep: —
  - Criar um webhook na Kiwify apontando para `webhook.site` e disparar o evento de teste de `compra_aprovada` e de `compra_reembolsada`.
  - Salvar em `finalizacao/refs/kiwify-compra_aprovada.json` e `kiwify-compra_reembolsada.json` **com dados pessoais trocados por fictícios**. Anotar a query string recebida (assinatura).
- [ ] **T-31** Função `api/kiwify-webhook.ts` · @agente · dep: T-30, T-12, T-20
  - Valida a assinatura (confirmar o algoritmo com T-30). Idempotente por `order_id`. Fluxo e tabela de eventos no PLANO.md → "Fluxo Kiwify".
  - Testes com os payloads de `finalizacao/refs/`.
- [ ] **T-32** Cadastrar o webhook de produção na Kiwify · @gabriel · dep: T-31, T-04
  - URL `APP_URL/api/kiwify-webhook`, eventos: compra aprovada, reembolsada e chargeback. Token copiado para `KIWIFY_WEBHOOK_TOKEN` na Vercel.
- [ ] **T-33** Teste de ponta a ponta de compra · @gabriel · dep: T-32, T-22
  - Compra real com cupom de 100% → e-mail chega → define senha → entra → reembolso → acesso suspenso.

## Fase 4 · Keep-alive (Supabase gratuito não pausa)

- [x] **T-40** Função `api/keepalive.ts` com escrita e leitura na tabela `heartbeat` · @agente · dep: T-11 · concluída: claude (2026-09-24)
  - Protegida por `CRON_SECRET`. Especificação completa no PLANO.md → "Keep-alive em detalhe".
- [x] **T-41** Cron diário na Vercel (`vercel.json`) · @agente · dep: T-40 · concluída: claude (2026-09-24)
- [ ] **T-42** Cron redundante a cada 12h no GitHub Actions · @agente @gabriel · dep: T-40, T-01
  - O agente escreve `.github/workflows/keepalive.yml`. O Gabriel cadastra os secrets `CRON_SECRET` e `APP_URL` no GitHub.
- [ ] **T-43** Validar 7 dias seguidos de heartbeat sem acesso humano · @gabriel · dep: T-41, T-42
  - Aceite: `select source, date(created_at), count(*) from heartbeat group by 1,2` mostra as duas fontes em todos os dias.

## Fase 5 · Funcionalidades e conteúdo

- [ ] **T-50** Upload real de exames para o Storage · @agente · dep: T-13, T-14
  - Substitui `file_url: '#'` em `ExamesUploadPage.tsx`. Progresso de envio e tratamento de erro.
  - **Plano grátis:** comprimir fotos no aparelho (canvas → WebP/JPEG, lado maior 1600 px, qualidade ~0,8) antes de enviar. PDF vai como está. Mostrar a cota (20 arquivos) quando chegar perto (ver D11).
- [ ] **T-51** Ana grava os 21 áudios da jornada · @ana · dep: —
  - Roteiros prontos em `src/data/journeyDays.ts` (`audio_transcript`). Entrega em mp3 ou m4a, um arquivo por dia.
- [ ] **T-52** Player com áudio real (mantendo a voz sintética como reserva) · @agente · dep: T-51
  - Arquivos em `public/audio/dia-01.mp3` … `dia-21.mp3`, mono 64 kbps. Cache em runtime no service worker, **fora** do precache.
- [ ] **T-53** Questionário de doshas opcional · @agente · dep: T-54
  - Especificação na análise aprovada: `subScreen 'doshas'`, pré-preenchido pela anamnese, fora do progresso da anamnese, resultado separado de `prescription.dosha_predominant`.
- [ ] **T-54** Ana aprova o questionário de doshas (prakriti, perguntas autorais) · @ana · dep: —
- [ ] **T-55** Datas lunares calculadas em vez de fixas · @agente · dep: —
  - Hoje param em janeiro/2027 (`src/data/mockData.ts`). Calcular as luas cheias por algoritmo ou gerar tabela até 2030.
- [ ] **T-56** Remover dados fictícios e fotos do Unsplash do build de produção · @agente · dep: T-14
  - `DEFAULT_*`, `OTHER_PATIENTS_LIST` e as URLs do Unsplash saem do bundle. Avatar com iniciais ou foto enviada pela Ana.
- [ ] **T-57** Painel da terapeuta com dados reais · @agente · dep: T-14, T-50
  - Lista de pacientes do banco, anamnese completa, check-ins, exames (signed URL), salvar prescrição.

## Fase 6 · LGPD e jurídico

- [ ] **T-60** Termo de consentimento com aceite registrado no primeiro acesso · @agente · dep: T-22
  - Tabela `consents` (user_id, versão do termo, aceito em). Sem aceite, o app não avança.
- [ ] **T-61** Textos de política de privacidade e termos de uso · @ana @gabriel · dep: —
  - O agente pode redigir um rascunho, mas a validação é da cliente ou de um advogado.
- [ ] **T-62** Aviso de que o app não substitui atendimento médico · @agente · dep: T-61
  - No onboarding e no topo de Protocolos (zeólita, desparasitação).
- [ ] **T-63** Exportar meus dados e pedir exclusão da conta · @agente · dep: T-14
  - Exporta JSON de todas as tabelas do usuário. A exclusão abre um pedido para a Ana (não apaga na hora).

## Fase 7 · Qualidade e PWA

- [ ] **T-70** ErrorBoundary com tela de erro amigável · @agente · dep: —
- [ ] **T-71** Ícones PNG do PWA (180, 192, 512 e maskable) · @agente · dep: —
  - `apple-touch-icon.png` está declarado no `vite.config.ts`, mas não existe em `public/`.
- [ ] **T-72** Code splitting das páginas (bundle hoje com 881 kB) · @agente · dep: —
  - `React.lazy` por página. `recharts` num chunk separado. Meta: chunk inicial < 300 kB.
- [ ] **T-73** Check-in offline sincroniza quando a internet volta · @agente · dep: T-14
- [ ] **T-74** Teste em iPhone e Android reais · @gabriel · dep: T-22, T-52, T-71
  - Instalar o PWA, logar, fazer check-in, ouvir áudio, enviar exame, usar offline.
- [ ] **T-75** Lighthouse ≥ 90 em Performance, Acessibilidade e Boas práticas · @agente · dep: T-72

## Fase 8 · Go-live

- [ ] **T-80** Domínio próprio na Vercel e URLs de redirect no Supabase Auth · @gabriel · dep: T-04, T-21
- [ ] **T-81** Decidir entre Vercel Hobby e Pro (uso comercial) · @gabriel · dep: —
  - Ver PLANO.md → Riscos, item 1.
- [ ] **T-82** Rotina de backup mensal do banco · @agente @gabriel · dep: T-11
  - Script `supabase db dump`. O arquivo fica **fora** do GitHub (dado de saúde).
- [ ] **T-83** Manual da Ana (ver pacientes, prescrever, suspender acesso) · @agente · dep: T-57
- [ ] **T-84** Primeira venda real acompanhada e 7 dias de monitoramento · @gabriel @ana · dep: T-33, T-43, T-60, T-74
