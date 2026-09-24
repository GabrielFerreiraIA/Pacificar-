-- seed_admin · Promove uma conta existente a terapeuta (role = 'admin').
-- Uso no SQL Editor do Supabase:
--   1. Crie/convide a conta em Authentication → Users → "Invite user" (ou rode
--      supabase/scripts/criar-admin.mjs, que faz o convite e a promoção de uma vez).
--   2. Troque o e-mail abaixo e execute.
-- Nenhuma senha passa por aqui: a Ana define a própria senha pelo link do convite.
do $$
declare
  alvo text := 'EMAIL-DA-ANA@exemplo.com';  -- ← troque aqui
  n int;
begin
  update public.profiles
     set role = 'admin', access_status = 'active'
   where lower(email) = lower(alvo);
  get diagnostics n = row_count;
  if n = 0 then
    raise exception 'Nenhuma conta com o e-mail %. Convide a conta primeiro.', alvo;
  end if;
  raise notice 'Conta % agora é terapeuta (admin).', alvo;
end $$;
