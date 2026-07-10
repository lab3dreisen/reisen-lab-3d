-- ============================================================================
-- REISEN LAB 3D — Schema Supabase
-- Rode este arquivo em: Supabase Dashboard > SQL Editor > New query
-- ============================================================================

-- Extensão para gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- PROFILES: dados extras do cliente, ligados a auth.users
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Usuário vê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário edita o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuário cria o próprio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Função auxiliar: verifica se o usuário logado é admin (usada nas políticas abaixo)
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;

-- Cria o perfil automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- PRODUCTS: catálogo (opcional migrar de js/products.js para cá)
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text not null,
  price numeric(10,2) not null,
  old_price numeric(10,2),
  image_url text,
  emoji text,
  badge text,
  stock integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Qualquer pessoa vê produtos ativos"
  on public.products for select
  using (active = true);

create policy "Admin vê todos os produtos (inclusive inativos)"
  on public.products for select
  using (public.is_admin());

create policy "Admin cria produtos"
  on public.products for insert
  with check (public.is_admin());

create policy "Admin edita produtos"
  on public.products for update
  using (public.is_admin());

create policy "Admin remove produtos"
  on public.products for delete
  using (public.is_admin());

-- Seed opcional com os mesmos produtos placeholder do site (edite/apague à vontade)
insert into public.products (slug, name, description, category, price, old_price, emoji, stock, active)
values
  ('miniatura-dragao-ancião', 'Miniatura RPG — Dragão Ancião', 'Impressa em resina de alta resolução, ideal para mesas de RPG e colecionadores.', 'miniaturas', 89.90, 109.90, '🐉', 18, true),
  ('kit-guerreiros-fantasia', 'Kit Miniaturas Guerreiros (6 un.)', 'Conjunto com 6 miniaturas de guerreiros em poses variadas.', 'miniaturas', 149.90, null, '⚔️', 12, true),
  ('suporte-celular-modular', 'Suporte de Celular Modular', 'Impresso em PETG de alta resistência, com ajuste de ângulo e altura.', 'acessorios', 39.90, null, '📱', 40, true),
  ('prototipo-funcional-sob-encomenda', 'Protótipo Funcional sob Encomenda', 'Modelagem 3D e impressão de protótipos funcionais sob orçamento.', 'servicos', 299.00, null, '🧩', 999, true),
  ('peca-reposicao-personalizada', 'Peça de Reposição Personalizada', 'Recriamos peças quebradas ou descontinuadas a partir de medição ou amostra.', 'pecas', 59.90, null, '🔩', 25, true),
  ('filamento-pla-premium-preto', 'Filamento PLA Premium 1kg — Preto', 'PLA premium com diâmetro controlado, ótimo acabamento superficial.', 'filamentos', 119.90, 134.90, '🧵', 60, true),
  ('filamento-petg-cinza-metalico', 'Filamento PETG Premium 1kg — Cinza Metálico', 'PETG de alta resistência mecânica e térmica.', 'filamentos', 139.90, null, '🧵', 35, true),
  ('luminaria-led-voronoi', 'Luminária LED Voronoi', 'Peça decorativa com padrão Voronoi e fita LED USB inclusa.', 'decoracao', 129.90, null, '💡', 15, true),
  ('vaso-geometrico-decorativo', 'Vaso Geométrico Decorativo', 'Vaso com geometria facetada, acabamento fosco.', 'decoracao', 69.90, null, '🏺', 22, true)
on conflict (slug) do nothing;

-- ----------------------------------------------------------------------------
-- STORAGE: bucket para as fotos de produtos enviadas pelo painel admin
-- (upload por arrastar-e-soltar em admin.html, sem precisar mexer em arquivos)
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "Qualquer um vê imagens de produtos"
  on storage.objects for select
  to public
  using (bucket_id = 'produtos');

create policy "Admin envia imagens de produtos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos' and public.is_admin());

create policy "Admin atualiza imagens de produtos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'produtos' and public.is_admin())
  with check (bucket_id = 'produtos' and public.is_admin());

create policy "Admin remove imagens de produtos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos' and public.is_admin());

-- ----------------------------------------------------------------------------
-- ORDERS: pedidos feitos pelos clientes
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  status text not null default 'aguardando_pagamento'
    check (status in ('aguardando_pagamento','pago','enviado','entregue','cancelado')),
  payment_method text not null default 'infinitepay',
  total numeric(10,2) not null,
  ip_checkout_url text,   -- URL do link de pagamento retornado pela InfinitePay
  ip_invoice_slug text,   -- identificador da transação retornado pelo webhook da InfinitePay
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Cliente vê os próprios pedidos"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Cliente cria pedido para si mesmo (ou convidado)"
  on public.orders for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Admin vê todos os pedidos"
  on public.orders for select
  using (public.is_admin());

create policy "Admin atualiza status dos pedidos"
  on public.orders for update
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- ORDER_ITEMS: itens de cada pedido
-- ----------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null,
  subtotal numeric(10,2) not null
);

alter table public.order_items enable row level security;

create policy "Cliente vê itens dos próprios pedidos"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Qualquer um pode inserir itens ao criar o pedido"
  on public.order_items for insert
  with check (true);

create policy "Admin vê todos os itens de pedido"
  on public.order_items for select
  using (public.is_admin());

-- ============================================================================
-- FIM. Depois de rodar este script:
-- 1. Vá em Authentication > Providers e confirme que "Email" está habilitado.
-- 2. Copie a "Project URL" e a "anon public key" em Settings > API.
-- 3. Cole os dois valores em js/config.js (SUPABASE_URL e SUPABASE_ANON_KEY).
-- 4. Crie sua conta normalmente pelo site (cadastro.html) — isso cria seu
--    usuário e seu perfil em profiles.
-- 5. Volte aqui no SQL Editor e rode (trocando pelo seu e-mail):
--      update public.profiles set is_admin = true
--      where id = (select id from auth.users where email = 'seu-email@exemplo.com');
--    A partir daí seu login vira admin e você acessa o painel em admin.html.
-- ============================================================================
