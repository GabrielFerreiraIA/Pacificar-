-- storage_exames · Bucket privado para exames laboratoriais
-- Caminho: {user_id}/{arquivo}. Leitura só por signed URL (bucket não é público).
-- Plano gratuito = 1 GB de Storage no total, por isso:
--   * 10 MB por arquivo (PDF escaneado de laboratório);
--   * fotos são comprimidas no aparelho antes do envio (T-50), daí o image/webp;
--   * cota de 20 arquivos por paciente, garantida aqui no servidor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exames', 'exames', false, 10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Quantos arquivos o usuário logado já tem no bucket (security definer para contar
-- sem depender da policy de select que está sendo avaliada).
create or replace function private.exames_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from storage.objects
  where bucket_id = 'exames'
    and (storage.foldername(name))[1] = (select auth.uid())::text;
$$;
revoke all on function private.exames_count() from public;
grant execute on function private.exames_count() to authenticated;

create policy "exames: dono ou terapeuta lê" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'exames'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.is_admin()))
  );

create policy "exames: dono envia na própria pasta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'exames'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select private.has_access())
    and (select private.exames_count()) < 20
  );

create policy "exames: dono apaga" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'exames'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
-- Sem policy de update: nada de sobrescrever arquivo (cada envio tem nome único).
