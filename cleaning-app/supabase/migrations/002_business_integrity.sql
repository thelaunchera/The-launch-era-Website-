-- One owner account = one cleaning business in the initial product model.
create unique index if not exists businesses_owner_user_unique
  on businesses(owner_user_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'businesses','team_members','clients','leads','services','service_addons',
    'quotes','jobs','invoices'
  ]
  loop
    execute format('drop trigger if exists %I_set_updated_at on %I', tbl, tbl);
    execute format(
      'create trigger %I_set_updated_at before update on %I for each row execute function set_updated_at()',
      tbl, tbl
    );
  end loop;
end $$;
