import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";

type TodayJob = {
  id: string;
  starts_at: string;
  duration_minutes: number;
  route_order: number | null;
  status: string;
  service_address: string;
  client_name: string | null;
  travel_buffer_before_minutes: number;
  travel_buffer_after_minutes: number;
};

type DashboardData = {
  jobs: TodayJob[];
  newLeads: number;
  openQuotes: number;
  unpaidInvoices: { total: number; status: string }[];
  mileage: number;
  workMinutes: number;
};

const empty: DashboardData = {
  jobs: [],
  newLeads: 0,
  openQuotes: 0,
  unpaidInvoices: [],
  mileage: 0,
  workMinutes: 0,
};

export default function TodayPage() {
  const { business } = useBusiness();
  const [data, setData] = useState<DashboardData>(empty);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!business) return;

    async function load() {
      setLoading(true);
      setMessage("");

      const [jobs, leads, quotes, invoices, mileage, work] = await Promise.all([
        supabase.rpc("get_today_jobs", { p_business_id: business!.id }),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("business_id", business!.id).eq("status", "new").is("archived_at", null),
        supabase.from("quotes").select("id", { count: "exact", head: true }).eq("business_id", business!.id).in("status", ["requested", "draft", "sent"]),
        supabase.from("invoices").select("total,status").eq("business_id", business!.id).in("status", ["sent", "partial"]),
        supabase.rpc("get_today_mileage_total", { p_business_id: business!.id }),
        supabase.rpc("get_today_work_minutes", { p_business_id: business!.id }),
      ]);

      const firstError = jobs.error || leads.error || quotes.error || invoices.error || mileage.error || work.error;
      if (firstError) {
        setMessage(firstError.message);
        setLoading(false);
        return;
      }

      setData({
        jobs: (jobs.data || []) as TodayJob[],
        newLeads: leads.count || 0,
        openQuotes: quotes.count || 0,
        unpaidInvoices: (invoices.data || []).map((row) => ({ total: Number(row.total || 0), status: row.status })),
        mileage: Number(mileage.data || 0),
        workMinutes: Number(work.data || 0),
      });
      setLoading(false);
    }

    void load();
  }, [business]);

  const scheduledMinutes = useMemo(
    () => data.jobs.reduce((sum, job) => sum + (job.duration_minutes || 0), 0),
    [data.jobs]
  );
  const unpaidTotal = useMemo(
    () => data.unpaidInvoices.reduce((sum, row) => sum + row.total, 0),
    [data.unpaidInvoices]
  );

  function formatTime(value: string) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: business?.timezone || "America/New_York",
    }).format(new Date(value));
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow={business ? `TODAY · ${business.name}` : "TODAY"}
        title="Today, without the chaos."
        description="Jobs, route, leads and money that need your attention — in one place."
      />

      {message && <div className="form-message">{message}</div>}

      <section className="grid">
        <article className="card metric"><span className="eyebrow">Jobs today</span><b>{loading ? "—" : data.jobs.length}</b><span className="meta">{Math.round((scheduledMinutes / 60) * 10) / 10} scheduled hours</span></article>
        <article className="card metric"><span className="eyebrow">New leads</span><b>{loading ? "—" : data.newLeads}</b><span className="meta">Need a reply</span></article>
        <article className="card metric"><span className="eyebrow">Open quotes</span><b>{loading ? "—" : data.openQuotes}</b><span className="meta">Requested, draft or sent</span></article>
        <article className="card metric"><span className="eyebrow">Unpaid</span><b>{loading ? "—" : `$${unpaidTotal.toFixed(0)}`}</b><span className="meta">{data.unpaidInvoices.length} invoices</span></article>

        <article className="card route">
          <div className="section-title"><h2>Today&apos;s Route</h2><span className="badge">{data.mileage.toFixed(1)} mi logged</span></div>
          {!loading && !data.jobs.length && <div className="empty">No jobs scheduled today.</div>}
          {data.jobs.map((job, index) => (
            <div className="stop" key={job.id}>
              <div className="order">{job.route_order || index + 1}</div>
              <div>
                <strong>{formatTime(job.starts_at)} · {job.client_name || "Client"}</strong>
                <div className="meta">{job.service_address} · {Math.round((job.duration_minutes / 60) * 10) / 10}h · {job.travel_buffer_before_minutes || business?.default_travel_buffer_minutes || 0} min travel buffer</div>
              </div>
              <span className="status">{job.status.replaceAll("_", " ")}</span>
            </div>
          ))}
        </article>

        <aside className="card sidecard">
          <div className="section-title"><h2>Quick actions</h2></div>
          <div className="quick">
            <a href="#/leads">+ Add lead</a>
            <a href="#/quotes">+ Create quote</a>
            <a href="#/calendar">+ Book job</a>
            <a href="#/calendar">Start mileage</a>
            <a href="#/calendar">Clock into job</a>
          </div>
        </aside>

        <article className="card route">
          <div className="section-title"><h2>Workflow rule</h2><span className="badge">Protected</span></div>
          <div className="note">A quote request stays in <strong>Quotes</strong> until the customer accepts it. Acceptance will create or update the client, add the job to the calendar and prepare the invoice.</div>
        </article>

        <aside className="card sidecard">
          <div className="section-title"><h2>Daily totals</h2></div>
          <div className="quick">
            <span>Driving · {data.mileage.toFixed(1)} mi</span>
            <span>Tracked work · {Math.round((data.workMinutes / 60) * 10) / 10}h</span>
            <span>Scheduled work · {Math.round((scheduledMinutes / 60) * 10) / 10}h</span>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
