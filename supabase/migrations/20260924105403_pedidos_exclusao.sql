-- pedidos_exclusao · Pedido de exclusão da conta (T-63 · LGPD art. 18, VI)
-- O pedido não apaga nada na hora: a terapeuta avalia (guarda legal de registros)
-- e conclui. Um pedido em aberto por pessoa.

create table public.deletion_requests (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references public.profiles (id) on delete cascade,
  reason       text check (char_length(reason) <= 1000),
  status       text not null default 'pending' check (status in ('pending', 'done', 'cancelled')),
  created_at   timestamptz not null default now(),
  handled_at   timestamptz
);
create unique index deletion_requests_um_aberto on public.deletion_requests (user_id) where status = 'pending';

alter table public.deletion_requests enable row level security;
grant select, insert, update on public.deletion_requests to authenticated;
grant usage on sequence public.deletion_requests_id_seq to authenticated;

create policy "deletion_requests: dono ou admin lê" on public.deletion_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- Pedir exclusão é um direito: vale mesmo com o acesso suspenso
create policy "deletion_requests: dono pede" on public.deletion_requests
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending' and handled_at is null);

create policy "deletion_requests: admin conclui" on public.deletion_requests
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
