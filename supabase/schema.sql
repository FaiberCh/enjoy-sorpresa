-- Tabla de clientes
create table clientes (
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
create table pedidos (
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

-- Función para actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clientes_updated_at
  before update on clientes
  for each row execute function update_updated_at();

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

-- RLS (Row Level Security) - solo lectura pública, escritura desde servidor
alter table clientes enable row level security;
alter table pedidos enable row level security;

create policy "Insertar clientes desde API" on clientes
  for insert with check (true);

create policy "Leer clientes desde API" on clientes
  for select using (true);

create policy "Actualizar clientes desde API" on clientes
  for update using (true);

create policy "Insertar pedidos desde API" on pedidos
  for insert with check (true);

create policy "Leer pedidos desde API" on pedidos
  for select using (true);

create policy "Actualizar pedidos desde API" on pedidos
  for update using (true);
