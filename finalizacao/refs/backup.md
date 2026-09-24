# Backup do banco (T-82)

O Supabase gratuito não tem backup baixável. Este é o procedimento mensal.

## Todo mês (5 minutos)

```bash
node --env-file=.env.local supabase/scripts/backup.mjs
```

Gera `backups/pacificar-AAAA-MM-DD.bak`: dados do banco (incluindo as contas de login) e os arquivos dos exames, **criptografados**.
Copie o arquivo para fora do computador (ex.: Google Drive pessoal). A pasta `backups/` nunca vai para o git.

Para conferir um backup sem extrair nada:

```bash
node --env-file=.env.local supabase/scripts/abrir-backup.mjs backups/pacificar-AAAA-MM-DD.bak
```

## A senha do backup

A `BACKUP_PASSPHRASE` está no `.env.local`. **Guarde-a também num gerenciador de senhas.** Sem ela, nenhum backup abre, e ninguém consegue recuperar.

## Restaurar num projeto Supabase novo

1. Crie o projeto (região São Paulo) e aplique as migrations de `supabase/migrations/` em ordem (SQL Editor ou `supabase db push`).
2. Extraia o backup:
   `node --env-file=.env.local supabase/scripts/abrir-backup.mjs backups/<arquivo>.bak --extrair restauro`
3. Carregue os dados no projeto novo (URL do pooler, porta 5432):
   `"C:/Program Files/PostgreSQL/17/bin/psql.exe" "<url do projeto novo>" -f restauro/dados.sql`
4. Reenvie os arquivos de `restauro/exames/` para o bucket `exames`, mantendo as pastas `{user_id}/`.
5. Atualize as chaves no `.env.local` e na Vercel. **Apague a pasta `restauro/`** (dado de saúde).

As senhas das pacientes continuam valendo, porque as contas do Auth vão no backup. Sessões abertas não vão: todo mundo entra de novo.

## Teste do procedimento

`node --env-file=.env.local supabase/tests/backup_test.mjs` cria uma paciente temporária e depois:
1. gera o backup;
2. confere que ele está criptografado e que a senha errada não abre;
3. extrai e compara os dados e o exame byte a byte;
4. apaga tudo.
