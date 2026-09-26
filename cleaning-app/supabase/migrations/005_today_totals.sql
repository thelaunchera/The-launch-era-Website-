create or replace function public.get_today_mileage_total(p_business_id uuid)
returns numeric
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(
    coalesce(
      m.miles,
      case
        when m.start_odometer is not null and m.end_odometer is not null
        then m.end_odometer - m.start_odometer
        else 0
      end
    )
  ), 0)
  from mileage_logs m
  join businesses b on b.id = m.business_id
  where m.business_id = p_business_id
    and m.log_date = (now() at time zone b.timezone)::date;
$$;

create or replace function public.get_today_work_minutes(p_business_id uuid)
returns integer
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(
    coalesce(
      e.minutes_worked,
      case
        when e.clocked_out_at is not null
        then greatest(0, floor(extract(epoch from (e.clocked_out_at - e.clocked_in_at))/60)::integer)
        else 0
      end
    )
  ), 0)::integer
  from job_time_entries e
  join businesses b on b.id = e.business_id
  where e.business_id = p_business_id
    and (e.clocked_in_at at time zone b.timezone)::date = (now() at time zone b.timezone)::date;
$$;
