-- T-34 · A venda passou da Kiwify para a Eduzz (D13).
-- O id da compra no perfil passa a guardar o id da fatura da Eduzz (data.id do webhook).

alter table public.profiles rename column kiwify_order_id to eduzz_invoice_id;

comment on column public.profiles.eduzz_invoice_id is 'Id da fatura da Eduzz que liberou o acesso (webhook myeduzz.invoice_paid).';
comment on table public.purchases is 'Log do webhook da Eduzz (só service role). Único por (order_id, event); no chargeback o event inclui o status.';

-- A trigger cita a coluna pelo nome: recriar com o nome novo.
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
     or new.eduzz_invoice_id is distinct from old.eduzz_invoice_id
     or new.journey_start_date is distinct from old.journey_start_date
     or new.email is distinct from old.email then
    raise exception 'Campo protegido: só a terapeuta pode alterar.' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.protect_profile_fields() from public;
