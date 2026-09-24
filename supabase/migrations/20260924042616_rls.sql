-- rls · Políticas de acesso
-- Paciente: só os próprios dados, e só enquanto o acesso estiver ativo.
-- Terapeuta (role = 'admin'): lê tudo; escreve prescrições e a revisão de exames.
-- purchases e heartbeat: sem policy e sem grant (só a service role, nas funções de api/).

-- ---------------------------------------------------------------------------
-- Funções auxiliares num schema NÃO exposto pela Data API
-- ---------------------------------------------------------------------------
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Paciente com acesso ativo (reembolso/chargeback deixa 'revoked').
create or replace function private.has_access()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and access_status = 'active'
  );
$$;

revoke all on function private.is_admin(), private.has_access() from public;
grant execute on function private.is_admin(), private.has_access() to authenticated;

-- ---------------------------------------------------------------------------
-- Grants: anon não toca em nada; authenticated passa pelo RLS
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke execute on functions from anon;

grant select, insert, update, delete on
  public.profiles, public.anamneses, public.checkins, public.lab_exams,
  public.prescriptions, public.parasite_cycles, public.zeolite_days,
  public.preparo_checked, public.dosha_results, public.consents
to authenticated;

revoke all on public.purchases, public.heartbeat from anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles: ler o próprio ou admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));

create policy "profiles: editar o próprio" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles: admin edita todos" on public.profiles
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- O paciente edita nome, telefone, peso etc., mas não os campos de controle.
create or replace function private.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- service role (api/) e SQL do painel não têm auth.uid(): passam direto
  if (select auth.uid()) is null or private.is_admin() then
    return new;
  end if;
  if new.role is distinct from old.role
     or new.access_status is distinct from old.access_status
     or new.kiwify_order_id is distinct from old.kiwify_order_id
     or new.journey_start_date is distinct from old.journey_start_date
     or new.email is distinct from old.email then
    raise exception 'Campo protegido: só a terapeuta pode alterar.' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.protect_profile_fields() from public;

create trigger profiles_protect_fields before update on public.profiles
  for each row execute function private.protect_profile_fields();

-- ---------------------------------------------------------------------------
-- Tabelas do paciente: dono com acesso ativo faz tudo; admin lê
-- (o próprio paciente pode apagar marcações e exames que enviou)
-- ---------------------------------------------------------------------------
-- anamneses
create policy "anamneses: dono lê" on public.anamneses for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "anamneses: dono cria" on public.anamneses for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.has_access()));
create policy "anamneses: dono edita" on public.anamneses for update to authenticated
  using (user_id = (select auth.uid()) and (select private.has_access()))
  with check (user_id = (select auth.uid()));

-- checkins
create policy "checkins: dono lê" on public.checkins for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "checkins: dono cria" on public.checkins for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.has_access()));
create policy "checkins: dono edita" on public.checkins for update to authenticated
  using (user_id = (select auth.uid()) and (select private.has_access()))
  with check (user_id = (select auth.uid()));

-- lab_exams: o paciente envia e apaga; só a terapeuta revisa
create policy "lab_exams: dono lê" on public.lab_exams for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "lab_exams: dono envia" on public.lab_exams for insert to authenticated
  with check (
    user_id = (select auth.uid()) and (select private.has_access())
    and therapist_reviewed = false and therapist_notes is null
    and storage_path like (select auth.uid())::text || '/%'
  );
create policy "lab_exams: dono apaga" on public.lab_exams for delete to authenticated
  using (user_id = (select auth.uid()) and (select private.has_access()));
create policy "lab_exams: admin revisa" on public.lab_exams for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

-- prescriptions: paciente só lê; admin faz tudo
create policy "prescriptions: dono lê" on public.prescriptions for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "prescriptions: admin cria" on public.prescriptions for insert to authenticated
  with check ((select private.is_admin()));
create policy "prescriptions: admin edita" on public.prescriptions for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
create policy "prescriptions: admin apaga" on public.prescriptions for delete to authenticated
  using ((select private.is_admin()));

-- parasite_cycles
create policy "parasite_cycles: dono lê" on public.parasite_cycles for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "parasite_cycles: dono cria" on public.parasite_cycles for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.has_access()));
create policy "parasite_cycles: dono edita" on public.parasite_cycles for update to authenticated
  using (user_id = (select auth.uid()) and (select private.has_access()))
  with check (user_id = (select auth.uid()));

-- zeolite_days
create policy "zeolite_days: dono lê" on public.zeolite_days for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "zeolite_days: dono marca" on public.zeolite_days for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.has_access()));
create policy "zeolite_days: dono desmarca" on public.zeolite_days for delete to authenticated
  using (user_id = (select auth.uid()) and (select private.has_access()));

-- preparo_checked
create policy "preparo_checked: dono lê" on public.preparo_checked for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "preparo_checked: dono marca" on public.preparo_checked for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.has_access()));
create policy "preparo_checked: dono desmarca" on public.preparo_checked for delete to authenticated
  using (user_id = (select auth.uid()) and (select private.has_access()));

-- dosha_results
create policy "dosha_results: dono lê" on public.dosha_results for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "dosha_results: dono cria" on public.dosha_results for insert to authenticated
  with check (user_id = (select auth.uid()) and (select private.has_access()));

-- consents: registro de aceite, imutável para o paciente
create policy "consents: dono lê" on public.consents for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
create policy "consents: dono aceita" on public.consents for insert to authenticated
  with check (user_id = (select auth.uid()));
