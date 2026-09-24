-- 0001_init · Schema inicial do PACIFICAR
-- Plano gratuito (500 MB): tipos enxutos (smallint, date), chaves compostas
-- no lugar de ids extras e nada de arquivo dentro do banco (exames vão para o Storage).
-- RLS e grants ficam na 0002_rls.sql.

-- ---------------------------------------------------------------------------
-- Utilitário: updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: 1 linha por auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  role               text not null default 'patient' check (role in ('patient', 'admin')),
  full_name          text not null default '',
  email              text,
  phone              text,
  weight             numeric(5, 1),
  height             numeric(3, 2),
  age                smallint check (age between 0 and 130),
  avatar_url         text,
  access_status      text not null default 'active' check (access_status in ('active', 'revoked')),
  journey_start_date date,
  current_day        smallint not null default 1 check (current_day between 1 and 21),
  kiwify_order_id    text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Cria o profile quando surge um usuário no Auth (convite da Kiwify ou painel).
-- O papel NUNCA vem do user_metadata (editável pelo usuário): nasce sempre 'patient'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- anamneses: 1 por paciente, respostas em JSONB (schema no front)
-- ---------------------------------------------------------------------------
create table public.anamneses (
  user_id      uuid primary key references public.profiles (id) on delete cascade,
  answers      jsonb not null default '{}'::jsonb,
  completed    boolean not null default false,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger anamneses_updated_at before update on public.anamneses
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- checkins: 1 por dia da jornada
-- ---------------------------------------------------------------------------
create table public.checkins (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles (id) on delete cascade,
  day_number           smallint not null check (day_number between 1 and 21),
  energy_rating        smallint check (energy_rating between 1 and 5),
  sleep_quality        smallint check (sleep_quality between 1 and 5),
  bloating_level       smallint check (bloating_level between 1 and 4),
  sweet_craving        smallint check (sweet_craving between 1 and 3),
  bristol_type         smallint check (bristol_type between 1 and 7),
  diet_compliance      text check (diet_compliance in ('total', 'partial', 'none')),
  water_intake         text,
  self_care_done       boolean not null default false,
  tongue_scraping_done boolean not null default false,
  warm_water_done      boolean not null default false,
  zeolite_taken        boolean not null default false,
  journal_notes        text not null default '',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique (user_id, day_number)
);
create trigger checkins_updated_at before update on public.checkins
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- lab_exams: metadados; o arquivo fica no bucket privado "exames"
-- ---------------------------------------------------------------------------
create table public.lab_exams (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  file_name          text not null,
  storage_path       text not null unique,  -- {user_id}/{arquivo} no bucket "exames"
  mime_type          text,
  size_bytes         integer check (size_bytes >= 0),
  exam_date          date,
  category           text,
  tags               text[] not null default '{}',
  therapist_reviewed boolean not null default false,
  therapist_notes    text,
  created_at         timestamptz not null default now()
);
create index lab_exams_user_id_idx on public.lab_exams (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- prescriptions: 1 vigente por paciente (a Ana edita)
-- ---------------------------------------------------------------------------
create table public.prescriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null unique references public.profiles (id) on delete cascade,
  dosha_predominant       text,
  massala_recommended     text,
  aromatherapy_oils       text[] not null default '{}',
  carrier_oil             text,
  supplements_recommended jsonb not null default '[]'::jsonb,
  therapeutic_teas        text[] not null default '{}',
  therapist_notes         text not null default '',
  created_by              uuid references public.profiles (id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create trigger prescriptions_updated_at before update on public.prescriptions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- parasite_cycles: até 5 ciclos lunares por paciente
-- ---------------------------------------------------------------------------
create table public.parasite_cycles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  cycle_number    smallint not null check (cycle_number between 1 and 5),
  moon_name       text,
  moon_date       date,
  day1_completed  boolean not null default false,
  day2_completed  boolean not null default false,
  day3_completed  boolean not null default false,
  charcoal_taken  boolean not null default false,
  h2o2_taken      boolean not null default false,
  completed       boolean not null default false,
  updated_at      timestamptz not null default now(),
  unique (user_id, cycle_number)
);
create trigger parasite_cycles_updated_at before update on public.parasite_cycles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- zeolite_days e preparo_checked: marcações simples, chave composta
-- ---------------------------------------------------------------------------
create table public.zeolite_days (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  day        smallint not null check (day between 1 and 120),
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);

create table public.preparo_checked (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  item_id    text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

-- ---------------------------------------------------------------------------
-- dosha_results: questionário opcional (T-53), separado da prescrição
-- ---------------------------------------------------------------------------
create table public.dosha_results (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  answers    jsonb not null default '{}'::jsonb,
  vata       smallint,
  pitta      smallint,
  kapha      smallint,
  result     text,
  created_at timestamptz not null default now()
);
create index dosha_results_user_id_idx on public.dosha_results (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- consents: aceite do termo (LGPD), 1 por versão
-- ---------------------------------------------------------------------------
create table public.consents (
  user_id      uuid not null references public.profiles (id) on delete cascade,
  term_version text not null,
  accepted_at  timestamptz not null default now(),
  user_agent   text,
  primary key (user_id, term_version)
);

-- ---------------------------------------------------------------------------
-- purchases: log do webhook da Kiwify (só service role)
-- Idempotência por (order_id, event): aprovação e reembolso chegam com o mesmo order_id.
-- ---------------------------------------------------------------------------
create table public.purchases (
  id           bigint generated always as identity primary key,
  order_id     text not null,
  event        text not null,
  email        text,
  user_id      uuid references public.profiles (id) on delete set null,
  payload      jsonb,
  processed_at timestamptz,
  error        text,
  created_at   timestamptz not null default now(),
  unique (order_id, event)
);
create index purchases_email_idx on public.purchases (lower(email));
create index purchases_user_id_idx on public.purchases (user_id);

-- ---------------------------------------------------------------------------
-- heartbeat: keep-alive (só service role)
-- ---------------------------------------------------------------------------
create table public.heartbeat (
  id         bigint generated always as identity primary key,
  source     text not null,
  created_at timestamptz not null default now()
);
create index heartbeat_created_at_idx on public.heartbeat (created_at);

-- ---------------------------------------------------------------------------
-- RLS ligado desde já em tudo (sem policy = ninguém acessa). Policies na 0002.
-- ---------------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.anamneses       enable row level security;
alter table public.checkins        enable row level security;
alter table public.lab_exams       enable row level security;
alter table public.prescriptions   enable row level security;
alter table public.parasite_cycles enable row level security;
alter table public.zeolite_days    enable row level security;
alter table public.preparo_checked enable row level security;
alter table public.dosha_results   enable row level security;
alter table public.consents        enable row level security;
alter table public.purchases       enable row level security;
alter table public.heartbeat       enable row level security;
