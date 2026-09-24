---
description: Encerra a sessão no PACIFICAR com status atualizado, log e commit
---

1. Rode `npm run lint` e `npm run build`. Se falharem, corrija antes de continuar.
2. Confira o critério de aceite da tarefa em `finalizacao/TAREFAS.md`.
3. Se passou: `npm run tarefa -- concluir T-NN antigravity`. Se não deu para terminar: `npm run tarefa -- bloquear T-NN "motivo"`.
4. Rode `npm run log -- T-NN antigravity` e preencha "O que foi feito", "Decisões", "Como testar" e "Pendências" no arquivo criado.
5. Faça o commit só dos arquivos desta tarefa, mais `finalizacao/TAREFAS.md` e o log, com a mensagem `[T-NN] concluir e registrar log`. Nunca use `git add -A`.
6. Diga ao usuário o que ele precisa testar para marcar a tarefa no checklist visual.
