-- ============================================================
-- Esquema completo de En Joy Sorpresa — fuente única de verdad.
-- Seguro de correr completo en cualquier momento (todo es
-- idempotente: if not exists / create or replace / drop-then-create),
-- incluyendo contra la base de datos real ya poblada. Si se recrea
-- la base desde cero, este archivo por sí solo deja todo en el
-- estado correcto (tablas, RLS, GRANTs, función de rate-limit).
-- ============================================================

-- Tabla de clientes
create table if not exists clientes (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  whatsapp text not null unique,
  ciudad text not null,
  email text,
  estado_lead text not null default 'interesado'
    check (estado_lead in ('interesado', 'en_negociacion', 'compro', 'no_compro', 'inactivo')),
  acepta_promociones boolean not null default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Tabla de pedidos
create table if not exists pedidos (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references clientes(id) on delete cascade not null,
  producto_interes text not null,
  descripcion text not null,
  fecha_evento date,
  ciudad text not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'en_proceso', 'entregado', 'cancelado')),
  notas text,
  origen text not null default 'web'
    check (origen in ('web', 'whatsapp', 'presencial', 'otro')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Tabla de productos (catálogo, gestionado desde el panel admin)
create table if not exists productos (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  precio numeric not null default 0,
  categoria text not null,
  imagen_url text,
  imagenes jsonb default '[]'::jsonb,
  disponible boolean not null default true,
  created_at timestamptz default now() not null
);

-- Tabla de banners promocionales (gestionados desde el panel admin)
create table if not exists banners (
  id uuid default gen_random_uuid() primary key,
  titulo text not null,
  subtitulo text,
  imagen_url text,
  boton_texto text,
  boton_url text,
  color_fondo text,
  orden integer not null default 0,
  activo boolean not null default true,
  created_at timestamptz default now() not null
);

-- Rate limiting del login de admin
create table if not exists login_attempts (
  id uuid default gen_random_uuid() primary key,
  ip text not null,
  created_at timestamptz default now() not null
);

create index if not exists login_attempts_ip_created_at_idx
  on login_attempts (ip, created_at);

-- Función para actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clientes_updated_at on clientes;
create trigger clientes_updated_at
  before update on clientes
  for each row execute function update_updated_at();

drop trigger if exists pedidos_updated_at on pedidos;
create trigger pedidos_updated_at
  before update on pedidos
  for each row execute function update_updated_at();

-- Función para marcar clientes inactivos (más de 30 días sin actualizar)
create or replace function marcar_inactivos()
returns void as $$
begin
  update clientes
  set estado_lead = 'inactivo'
  where estado_lead = 'interesado'
    and updated_at < now() - interval '30 days';
end;
$$ language plpgsql;

-- Rate limiting atómico: check-and-insert protegido por un advisory lock
-- por IP, para que peticiones concurrentes desde la misma IP no puedan
-- pasarse del límite (el count-luego-insert por separado no es atómico).
-- Limpieza de filas viejas solo ~5% de las veces, no en cada llamada.
create or replace function record_login_attempt(
  p_ip text,
  p_max_attempts int,
  p_window_minutes int
)
returns boolean
language plpgsql
as $$
declare
  v_count int;
begin
  perform pg_advisory_xact_lock(hashtext(p_ip));

  if random() < 0.05 then
    delete from login_attempts where created_at < now() - interval '1 day';
  end if;

  select count(*) into v_count
  from login_attempts
  where ip = p_ip and created_at > now() - (p_window_minutes || ' minutes')::interval;

  if v_count >= p_max_attempts then
    return false;
  end if;

  insert into login_attempts (ip) values (p_ip);
  return true;
end;
$$;

-- RLS (Row Level Security) — sin acceso anónimo en ninguna tabla. Toda
-- la app lee y escribe exclusivamente desde código server-side con la
-- service_role key (que bypassea RLS), protegido por la cookie de
-- sesión de admin en proxy.ts. El único acceso público real es el
-- POST a /api/pedidos (formulario de la landing), que también pasa
-- por el servidor con service_role, nunca directo desde el navegador.
alter table clientes enable row level security;
alter table pedidos enable row level security;
alter table productos enable row level security;
alter table banners enable row level security;
alter table login_attempts enable row level security;

-- GRANTs para service_role — Supabase NO los otorga automáticamente
-- para estas tablas; sin esto, el rol recibe "permission denied"
-- aunque bypasee RLS.
grant usage on schema public to service_role;
grant all on public.clientes       to service_role;
grant all on public.pedidos        to service_role;
grant all on public.productos      to service_role;
grant all on public.banners        to service_role;
grant all on public.login_attempts to service_role;
grant execute on function record_login_attempt(text, int, int) to service_role;

-- Storage: las fotos de producto/banner deben seguir siendo visibles
-- públicamente (son fotos de catálogo, no datos sensibles), pero solo
-- el servidor (service_role, vía /api/productos/upload y
-- /api/banners/upload) puede escribir en el bucket.
drop policy if exists "Public read productos bucket" on storage.objects;
create policy "Public read productos bucket"
  on storage.objects for select
  using (bucket_id = 'productos');
