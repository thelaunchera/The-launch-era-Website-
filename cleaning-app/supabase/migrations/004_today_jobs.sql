create or replace function public.get_today_jobs(p_business_id uuid)
returns table (
  id uuid,
  starts_at timestamptz,
  duration_minutes integer,
  route_order integer,
  status text,
  service_address text,
  client_name text,
  travel_buffer_before_minutes integer,
  travel_buffer_after_minutes integer
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    j.id,
    j.starts_at,
    j.duration_minutes,
    j.route_order,
    j.status,
    j.service_address,
    c.name as client_name,
    j.travel_buffer_before_minutes,
    j.travel_buffer_after_minutes
  from jobs j
  join businesses b on b.id = j.business_id
  left join clients c on c.id = j.client_id
  where j.business_id = p_business_id
    and (j.starts_at at time zone b.timezone)::date = (now() at time zone b.timezone)::date
    and j.status <> 'canceled'
  order by coalesce(j.route_order, 9999), j.starts_at;
$$;
