-- rls_ajustes · Correções apontadas pelos advisors do Supabase

-- Função criada pela plataforma (auto-RLS). Não deve ser chamável pela Data API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Uma policy de UPDATE só em profiles (evita avaliar duas por linha)
drop policy "profiles: editar o próprio" on public.profiles;
drop policy "profiles: admin edita todos" on public.profiles;
create policy "profiles: editar o próprio ou admin" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

create index prescriptions_created_by_idx on public.prescriptions (created_by);
