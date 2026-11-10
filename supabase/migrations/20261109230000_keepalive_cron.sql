-- T-44 · Keep-alive interno: o próprio Supabase se mantém ativo.
-- Terceira camada, junto com o Vercel Cron (T-41) e o GitHub Actions (T-42).
--
-- A cada 6 horas o pg_cron:
--   1. grava uma linha em public.heartbeat (fonte 'supabase-cron') e apaga as com mais de 30 dias;
--   2. faz uma chamada HTTP real à API REST do projeto (pg_net), que passa pelo mesmo
--      gateway que um acesso de fora. Escrita interna sozinha pode não contar como atividade.
--
-- A URL e a chave anon ficam no Vault (fora do git). Cadastrar uma vez, no SQL Editor:
--   select vault.create_secret('https://SEU-PROJETO.supabase.co', 'keepalive_project_url');
--   select vault.create_secret('CHAVE_ANON_PUBLICA', 'keepalive_anon_key');
-- Sem esses segredos, o cron continua gravando no heartbeat e só pula a chamada HTTP.

create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- Leitura mínima que a chamada HTTP aciona. Não expõe dado de paciente.
create or replace function public.keepalive_status()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object('ok', true, 'total', count(*)) from public.heartbeat;
$$;
revoke all on function public.keepalive_status() from public;
grant execute on function public.keepalive_status() to anon, authenticated;

create or replace function private.keepalive_cron()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url   text;
  v_chave text;
begin
  insert into public.heartbeat (source) values ('supabase-cron');
  delete from public.heartbeat where created_at < now() - interval '30 days';

  select decrypted_secret into v_url   from vault.decrypted_secrets where name = 'keepalive_project_url';
  select decrypted_secret into v_chave from vault.decrypted_secrets where name = 'keepalive_anon_key';
  if v_url is not null and v_chave is not null then
    perform net.http_post(
      url     := rtrim(v_url, '/') || '/rest/v1/rpc/keepalive_status',
      headers := jsonb_build_object(
        'apikey', v_chave,
        'Authorization', 'Bearer ' || v_chave,
        'Content-Type', 'application/json'
      ),
      body    := '{}'::jsonb
    );
  end if;
end;
$$;
revoke all on function private.keepalive_cron() from public, anon, authenticated;

-- Agendar (o nome repetido só atualiza o job existente)
select cron.schedule('pacificar-keepalive', '0 */6 * * *', $$select private.keepalive_cron()$$);
