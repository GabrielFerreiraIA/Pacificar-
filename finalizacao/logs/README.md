# Logs de sessão

Um arquivo por sessão de trabalho, criado com `npm run log -- T-NN <agente>`.
Nome: `AAAA-MM-DD_HHMM_<agente>_<T-NN|infra>.md`. O script já preenche commits e arquivos da tarefa, e o agente escreve o resto.

- Nunca edite o log de outra sessão. Se discordar de algo, registre no seu log.
- `npm run log:ultimos` mostra os 5 mais recentes com suas pendências.
- `.sessoes.jsonl` é o registro automático do hook SessionEnd do Claude Code. Fica só nesta máquina, fora do git.
