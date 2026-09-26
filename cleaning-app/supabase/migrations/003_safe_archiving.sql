alter table clients
  add column if not exists archived_at timestamptz;

alter table leads
  add column if not exists archived_at timestamptz;

create index if not exists clients_business_active_idx
  on clients(business_id, archived_at);

create index if not exists leads_business_active_idx
  on leads(business_id, archived_at);
