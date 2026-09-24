@AGENTS.md

## Específico do Claude Code

- Os hooks de `.claude/settings.json` rodam sozinhos: status no início da sessão, bloqueio de encerramento quando há tarefa concluída sem log, registro automático no fim.
- **Checklist visual do Gabriel:** https://claude.ai/artifact/Mm2y53TBiG4NmCFUxJzhfQ
  - As marcações ficam no banco da página, coleção `checks`, um documento por ID de tarefa (`{ feito: true, em: ISO }`). É o registro do que o **Gabriel validou**, diferente do status dos agentes em `TAREFAS.md`.
  - Para saber o que já foi validado: `ArtifactData` com `action: "list"`, `collection: "checks"` e a URL acima. **Não marque nada ali:** quem marca é o Gabriel.
  - Quando `TAREFAS.md` ganhar ou perder tarefas, ou quando o Gabriel pedir: rode `npm run checklist`, leia a página com `Artifact` (`action: "read"`, `url` acima) e republique `finalizacao/checklist/checklist.html` passando a mesma `url`. Omita `capabilities` para manter o banco. As marcações sobrevivem porque ficam indexadas pelo ID.
  - O visual fica em `finalizacao/checklist/template.html`. O `checklist.html` é gerado e não vai para o git.
