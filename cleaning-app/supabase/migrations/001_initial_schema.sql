-- The Launch Era Cleaning App
-- Initial migration-friendly schema for Supabase/Postgres.
-- No production data. No secrets.

create extension if not exists pgcrypto;

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  timezone text not null default 'America/New_York',
  default_language text not null default 'en' check (default_language in ('en','es')),
  service_area text,
  default_travel_buffer_minutes integer not null default 30 check (default_travel_buffer_minutes >= 0),
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  subscription_status text not null default 'trial' check (subscription_status in ('trial','active','past_due','canceled','expired')),
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text not null default 'cleaner',
  active boolean not null default true,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  preferred_contact text not null default 'email' check (preferred_contact in ('email','text','whatsapp')),
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  notes text,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint phone_required_for_mobile_contact check (
    preferred_contact = 'email' or nullif(trim(phone),'') is not null
  )
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  preferred_contact text not null default 'email' check (preferred_contact in ('email','text','whatsapp')),
  source text,
  status text not null default 'new' check (status in ('new','contacted','qualified','quoted','booked','lost')),
  service_interest text,
  address text,
  notes text,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_phone_required_for_mobile_contact check (
    preferred_contact = 'email' or nullif(trim(phone),'') is not null
  )
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  description text,
  pricing_type text not null default 'flat' check (pricing_type in ('flat','hourly','sqft','quote')),
  base_price numeric(10,2),
  default_duration_minutes integer not null default 120 check (default_duration_minutes > 0),
  active boolean not null default true,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists service_addons (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  extra_duration_minutes integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  status text not null default 'requested' check (status in ('requested','draft','sent','accepted','declined','expired')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_address text,
  preferred_date date,
  preferred_time time,
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  notes text,
  accepted_at timestamptz,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  service_id uuid references services(id) on delete set null,
  addon_id uuid references service_addons(id) on delete set null,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null default 0,
  line_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists recurrence_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  frequency text not null check (frequency in ('weekly','biweekly','monthly')),
  interval_count integer not null default 1 check (interval_count > 0),
  starts_on date not null,
  ends_on date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  client_id uuid references clients(id) on delete restrict,
  quote_id uuid references quotes(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  recurrence_rule_id uuid references recurrence_rules(id) on delete set null,
  status text not null default 'scheduled' check (status in ('scheduled','on_the_way','in_progress','completed','canceled','no_show')),
  service_address text not null,
  starts_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes > 0),
  travel_buffer_before_minutes integer not null default 0 check (travel_buffer_before_minutes >= 0),
  travel_buffer_after_minutes integer not null default 0 check (travel_buffer_after_minutes >= 0),
  route_order integer,
  notes text,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists job_assignments (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  team_member_id uuid not null references team_members(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(job_id, team_member_id)
);

create table if not exists job_time_entries (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid not null references jobs(id) on delete cascade,
  team_member_id uuid references team_members(id) on delete set null,
  clocked_in_at timestamptz not null,
  clocked_out_at timestamptz,
  minutes_worked integer,
  created_at timestamptz not null default now()
);

create table if not exists mileage_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  job_id uuid references jobs(id) on delete set null,
  log_date date not null default current_date,
  start_odometer numeric(10,1),
  end_odometer numeric(10,1),
  miles numeric(10,1),
  notes text,
  created_at timestamptz not null default now(),
  constraint valid_odometer check (
    end_odometer is null or start_odometer is null or end_odometer >= start_odometer
  )
);

create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  client_id uuid references clients(id) on delete restrict,
  job_id uuid references jobs(id) on delete set null,
  quote_id uuid references quotes(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','sent','partial','paid','void')),
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  due_at timestamptz,
  external_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references invoices(id) on delete cascade,
  description text not null,
  quantity numeric(10,2) not null default 1,
  unit_price numeric(10,2) not null default 0,
  line_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  method text not null check (method in ('cash','zelle','stripe')),
  amount numeric(10,2) not null check (amount >= 0),
  status text not null default 'recorded' check (status in ('recorded','pending','confirmed','failed','refunded')),
  external_ref text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists availability_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint availability_window_valid check (end_time > start_time)
);

create index if not exists jobs_business_starts_idx on jobs(business_id, starts_at);
create index if not exists leads_business_status_idx on leads(business_id, status);
create index if not exists quotes_business_status_idx on quotes(business_id, status);
create index if not exists invoices_business_status_idx on invoices(business_id, status);
create index if not exists mileage_business_date_idx on mileage_logs(business_id, log_date);

-- RLS: owner accounts can only access rows belonging to their own business.
alter table businesses enable row level security;
create policy "owners_manage_business" on businesses
for all using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'team_members','clients','leads','services','service_addons','quotes',
    'recurrence_rules','jobs','job_time_entries','mileage_logs','invoices',
    'payments','availability_rules'
  ]
  loop
    execute format('alter table %I enable row level security', tbl);
    execute format(
      'create policy %L on %I for all using (exists (select 1 from businesses b where b.id = %I.business_id and b.owner_user_id = auth.uid())) with check (exists (select 1 from businesses b where b.id = %I.business_id and b.owner_user_id = auth.uid()))',
      'owner tenant isolation', tbl, tbl, tbl
    );
  end loop;
end $$;

-- Child tables inherit access through their parent records.
alter table quote_items enable row level security;
create policy "quote item tenant isolation" on quote_items
for all using (
  exists (
    select 1 from quotes q join businesses b on b.id=q.business_id
    where q.id=quote_items.quote_id and b.owner_user_id=auth.uid()
  )
)
with check (
  exists (
    select 1 from quotes q join businesses b on b.id=q.business_id
    where q.id=quote_items.quote_id and b.owner_user_id=auth.uid()
  )
);

alter table job_assignments enable row level security;
create policy "job assignment tenant isolation" on job_assignments
for all using (
  exists (
    select 1 from jobs j join businesses b on b.id=j.business_id
    where j.id=job_assignments.job_id and b.owner_user_id=auth.uid()
  )
)
with check (
  exists (
    select 1 from jobs j join businesses b on b.id=j.business_id
    where j.id=job_assignments.job_id and b.owner_user_id=auth.uid()
  )
);

alter table invoice_items enable row level security;
create policy "invoice item tenant isolation" on invoice_items
for all using (
  exists (
    select 1 from invoices i join businesses b on b.id=i.business_id
    where i.id=invoice_items.invoice_id and b.owner_user_id=auth.uid()
  )
)
with check (
  exists (
    select 1 from invoices i join businesses b on b.id=i.business_id
    where i.id=invoice_items.invoice_id and b.owner_user_id=auth.uid()
  )
);
