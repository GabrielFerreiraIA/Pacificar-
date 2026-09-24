# PACIFICAR — Saúde Integrativa & Ayurveda

PWA da terapeuta **Ana Carla Nesi**: jornada de 21 dias com anamnese, check-in diário, nutrição e protocolos.

**Stack:** Vite + React 19 + TypeScript + Tailwind 4 + vite-plugin-pwa · Supabase (Postgres, Auth, Storage) · Vercel (front + funções em `api/`) · venda pela Kiwify.

## Rodar localmente

Pré-requisito: Node.js 20+.

```bash
npm install          # também ativa os git hooks do projeto
cp .env.example .env.local   # preencha com as chaves do Supabase
npm run dev          # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run lint` | Checagem de tipos (TypeScript) |
| `npm run status` | Progresso da finalização |

## Variáveis de ambiente

Veja [.env.example](.env.example) e a tabela em [finalizacao/PLANO.md](finalizacao/PLANO.md#variáveis-de-ambiente).
Variáveis `VITE_*` vão para o navegador: nunca coloque segredo nelas. A `SUPABASE_SERVICE_ROLE_KEY` só existe nas funções de `api/`.

## Para agentes e colaboradores

Leia [AGENTS.md](AGENTS.md) antes de mexer no código. O que falta fazer está em [finalizacao/TAREFAS.md](finalizacao/TAREFAS.md).
