-- T-87 · Duas versões do app (D15): jornada de 7 dias ou de 21 dias, no mesmo sistema.
-- O plano vem do produto comprado na Eduzz (webhook). O upgrade 7 → 21 muda só esta coluna.
-- Quem já tem conta (e a terapeuta) fica com 21, o padrão.

alter table public.profiles
  add column plan_days smallint not null default 21
  constraint profiles_plan_days_check check (plan_days in (7, 21));

comment on column public.profiles.plan_days is
  'Duração da jornada comprada: 7 ou 21 dias. Gravada pelo webhook da Eduzz (produto 7D, 21D ou upgrade) ou pela terapeuta.';

-- A própria paciente não pode se dar os 21 dias: plan_days entra nos campos protegidos.
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
     or new.plan_days is distinct from old.plan_days
     or new.email is distinct from old.email then
    raise exception 'Campo protegido: só a terapeuta pode alterar.' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.protect_profile_fields() from public;
