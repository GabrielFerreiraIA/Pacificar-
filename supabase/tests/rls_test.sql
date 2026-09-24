-- Teste de RLS (T-12). Roda inteiro numa transação e desfaz tudo no fim.
-- Uso: cole no SQL Editor do Supabase e execute. Sucesso = termina sem erro
-- e o último select mostra 'RLS OK'. Qualquer falha aborta com a mensagem do caso.
begin;

-- Três usuários fictícios: paciente A, paciente B e a terapeuta
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-0000-0000-00000000000a', 'teste-a@exemplo.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-00000000000b', 'teste-b@exemplo.invalid', 'authenticated', 'authenticated'),
  ('00000000-0000-0000-0000-0000000000ad', 'teste-admin@exemplo.invalid', 'authenticated', 'authenticated');
update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000ad';

-- Dados do paciente A (inseridos como superusuário)
insert into public.anamneses (user_id, answers) values ('00000000-0000-0000-0000-00000000000a', '{"queixa":"teste"}');
insert into public.checkins (user_id, day_number, energy_rating) values ('00000000-0000-0000-0000-00000000000a', 1, 3);
insert into public.lab_exams (user_id, file_name, storage_path) values ('00000000-0000-0000-0000-00000000000a', 'x.pdf', '00000000-0000-0000-0000-00000000000a/x.pdf');
insert into public.purchases (order_id, event) values ('pedido-teste', 'compra_aprovada');

-- ===== Como paciente B =====
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);

do $$ begin
  if (select count(*) from public.profiles) <> 1 then raise exception 'FALHA: B enxerga perfis de outras pessoas'; end if;
  if exists (select 1 from public.anamneses) then raise exception 'FALHA: B lê a anamnese de A'; end if;
  if exists (select 1 from public.checkins)  then raise exception 'FALHA: B lê os check-ins de A'; end if;
  if exists (select 1 from public.lab_exams) then raise exception 'FALHA: B lê os exames de A'; end if;

  update public.checkins set energy_rating = 1 where user_id = '00000000-0000-0000-0000-00000000000a';
  if found then raise exception 'FALHA: B alterou check-in de A'; end if;

  begin
    insert into public.checkins (user_id, day_number) values ('00000000-0000-0000-0000-00000000000a', 2);
    raise exception 'FALHA: B criou check-in em nome de A';
  exception when insufficient_privilege then null; end;

  begin
    update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000b';
    raise exception 'FALHA: B se promoveu a admin';
  exception when insufficient_privilege then null; end;

  begin
    perform 1 from public.purchases;
    raise exception 'FALHA: paciente acessa purchases';
  exception when insufficient_privilege then null; end;

  -- B consegue usar o que é dele
  insert into public.checkins (user_id, day_number, energy_rating) values ('00000000-0000-0000-0000-00000000000b', 1, 4);
  update public.profiles set full_name = 'Paciente B' where id = '00000000-0000-0000-0000-00000000000b';
  if not found then raise exception 'FALHA: B não consegue editar o próprio nome'; end if;
end $$;

-- ===== Como terapeuta =====
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000ad","role":"authenticated"}', true);

do $$ begin
  if (select count(*) from public.checkins) <> 2 then raise exception 'FALHA: terapeuta não vê todos os check-ins'; end if;
  if not exists (select 1 from public.anamneses where user_id = '00000000-0000-0000-0000-00000000000a') then
    raise exception 'FALHA: terapeuta não vê a anamnese de A';
  end if;
  insert into public.prescriptions (user_id, dosha_predominant) values ('00000000-0000-0000-0000-00000000000a', 'Vata');
  update public.profiles set access_status = 'revoked' where id = '00000000-0000-0000-0000-00000000000b';
  if not found then raise exception 'FALHA: terapeuta não consegue suspender acesso'; end if;
end $$;

-- ===== Paciente B com acesso suspenso =====
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}', true);

do $$ begin
  if not exists (select 1 from public.profiles where id = '00000000-0000-0000-0000-00000000000b') then
    raise exception 'FALHA: paciente suspenso não lê o próprio perfil (precisa para a tela de suspensão)';
  end if;
  begin
    insert into public.checkins (user_id, day_number) values ('00000000-0000-0000-0000-00000000000b', 2);
    raise exception 'FALHA: paciente suspenso ainda grava check-in';
  exception when insufficient_privilege then null; end;
end $$;

-- ===== Anônimo (sem login) =====
reset role;
set local role anon;
do $$ begin
  begin
    perform 1 from public.profiles;
    raise exception 'FALHA: anônimo acessa profiles';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
select 'RLS OK' as resultado;
rollback;
