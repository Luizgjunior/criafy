-- Tabela de perfis de usuário
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nome text,
  creditos integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: criar perfil automaticamente ao registrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tabela de gerações de imagens
create table if not exists public.geracoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt text not null,
  image_url text not null,
  modelo text default 'flux-schnell',
  created_at timestamptz default now()
);

-- Tabela de transações de créditos
create table if not exists public.transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tipo text not null check (tipo in ('compra', 'uso', 'bonus')),
  creditos integer not null,
  plano text,
  referencia text,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.geracoes enable row level security;
alter table public.transacoes enable row level security;

-- Políticas: usuário vê apenas os próprios dados
create policy "profiles: select own" on public.profiles for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles for update using (auth.uid() = id);

create policy "geracoes: select own" on public.geracoes for select using (auth.uid() = user_id);
create policy "geracoes: insert own" on public.geracoes for insert with check (auth.uid() = user_id);

create policy "transacoes: select own" on public.transacoes for select using (auth.uid() = user_id);

-- Índices
create index if not exists geracoes_user_id_idx on public.geracoes(user_id, created_at desc);
create index if not exists transacoes_user_id_idx on public.transacoes(user_id, created_at desc);
