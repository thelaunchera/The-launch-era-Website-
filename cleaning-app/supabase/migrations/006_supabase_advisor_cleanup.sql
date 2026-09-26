-- Supabase advisor cleanup: secure helper function, optimize RLS auth checks,
-- and add covering indexes for foreign-key columns used by the app.

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

-- Optimize owner policy.
drop policy if exists "owners_manage_business" on public.businesses;
create policy "owners_manage_business" on public.businesses
for all
using (owner_user_id = (select auth.uid()))
with check (owner_user_id = (select auth.uid()));

-- Optimize direct business_id tenant policies.
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
    execute format('drop policy if exists %I on public.%I', 'owner tenant isolation', tbl);
    execute format(
      'create policy %I on public.%I for all using (exists (select 1 from public.businesses b where b.id = %I.business_id and b.owner_user_id = (select auth.uid()))) with check (exists (select 1 from public.businesses b where b.id = %I.business_id and b.owner_user_id = (select auth.uid())))',
      'owner tenant isolation', tbl, tbl, tbl
    );
  end loop;
end $$;

drop policy if exists "quote item tenant isolation" on public.quote_items;
create policy "quote item tenant isolation" on public.quote_items
for all
using (
  exists (
    select 1
    from public.quotes q
    join public.businesses b on b.id = q.business_id
    where q.id = quote_items.quote_id
      and b.owner_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.quotes q
    join public.businesses b on b.id = q.business_id
    where q.id = quote_items.quote_id
      and b.owner_user_id = (select auth.uid())
  )
);

drop policy if exists "job assignment tenant isolation" on public.job_assignments;
create policy "job assignment tenant isolation" on public.job_assignments
for all
using (
  exists (
    select 1
    from public.jobs j
    join public.businesses b on b.id = j.business_id
    where j.id = job_assignments.job_id
      and b.owner_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.jobs j
    join public.businesses b on b.id = j.business_id
    where j.id = job_assignments.job_id
      and b.owner_user_id = (select auth.uid())
  )
);

drop policy if exists "invoice item tenant isolation" on public.invoice_items;
create policy "invoice item tenant isolation" on public.invoice_items
for all
using (
  exists (
    select 1
    from public.invoices i
    join public.businesses b on b.id = i.business_id
    where i.id = invoice_items.invoice_id
      and b.owner_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.invoices i
    join public.businesses b on b.id = i.business_id
    where i.id = invoice_items.invoice_id
      and b.owner_user_id = (select auth.uid())
  )
);

-- Foreign-key indexes. Some business_id paths already have composite indexes;
-- these cover the remaining relationship lookups and cascade/restrict checks.
create index if not exists team_members_business_id_idx on public.team_members(business_id);
create index if not exists services_business_id_idx on public.services(business_id);
create index if not exists service_addons_business_id_idx on public.service_addons(business_id);
create index if not exists service_addons_service_id_idx on public.service_addons(service_id);

create index if not exists quotes_lead_id_idx on public.quotes(lead_id);
create index if not exists quotes_client_id_idx on public.quotes(client_id);

create index if not exists quote_items_quote_id_idx on public.quote_items(quote_id);
create index if not exists quote_items_service_id_idx on public.quote_items(service_id);
create index if not exists quote_items_addon_id_idx on public.quote_items(addon_id);

create index if not exists recurrence_rules_business_id_idx on public.recurrence_rules(business_id);

create index if not exists jobs_client_id_idx on public.jobs(client_id);
create index if not exists jobs_quote_id_idx on public.jobs(quote_id);
create index if not exists jobs_service_id_idx on public.jobs(service_id);
create index if not exists jobs_recurrence_rule_id_idx on public.jobs(recurrence_rule_id);

create index if not exists job_assignments_team_member_id_idx on public.job_assignments(team_member_id);

create index if not exists job_time_entries_business_id_idx on public.job_time_entries(business_id);
create index if not exists job_time_entries_job_id_idx on public.job_time_entries(job_id);
create index if not exists job_time_entries_team_member_id_idx on public.job_time_entries(team_member_id);

create index if not exists mileage_logs_job_id_idx on public.mileage_logs(job_id);

create index if not exists invoices_client_id_idx on public.invoices(client_id);
create index if not exists invoices_job_id_idx on public.invoices(job_id);
create index if not exists invoices_quote_id_idx on public.invoices(quote_id);

create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);

create index if not exists payments_business_id_idx on public.payments(business_id);
create index if not exists payments_invoice_id_idx on public.payments(invoice_id);

create index if not exists availability_rules_business_id_idx on public.availability_rules(business_id);
