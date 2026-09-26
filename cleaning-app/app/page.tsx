import AppShell from "@/components/AppShell";
import BackendSetupNotice from "@/components/BackendSetupNotice";
import { hasSupabaseEnv } from "@/lib/env";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";

function formatTime(value:string, timeZone:string){
  return new Intl.DateTimeFormat("en-US",{
    hour:"numeric",
    minute:"2-digit",
    timeZone,
  }).format(new Date(value));
}

export default async function Home() {
  if(!hasSupabaseEnv){
    return <AppShell active="Today">
      <div className="topbar">
        <div>
          <div className="eyebrow">DAILY OPERATIONS</div>
          <h1>Today, without the chaos.</h1>
          <p className="subtitle">Jobs, route, leads and money that need your attention — in one place.</p>
        </div>
      </div>
      <BackendSetupNotice />
    </AppShell>;
  }

  const business=await requireBusiness();
  const supabase=await createClient();

  const [
    todayJobsResult,
    newLeadsResult,
    quotesResult,
    unpaidInvoicesResult,
    mileageResult,
    workMinutesResult,
  ]=await Promise.all([
    supabase.rpc("get_today_jobs",{p_business_id:business.id}),
    supabase.from("leads").select("id",{count:"exact",head:true}).eq("business_id",business.id).eq("status","new").is("archived_at",null),
    supabase.from("quotes").select("id",{count:"exact",head:true}).eq("business_id",business.id).in("status",["requested","draft","sent"]),
    supabase.from("invoices").select("total,status").eq("business_id",business.id).in("status",["sent","partial"]),
    supabase.rpc("get_today_mileage_total",{p_business_id:business.id}),
    supabase.rpc("get_today_work_minutes",{p_business_id:business.id}),
  ]);

  if(todayJobsResult.error) throw new Error(todayJobsResult.error.message);
  if(newLeadsResult.error) throw new Error(newLeadsResult.error.message);
  if(quotesResult.error) throw new Error(quotesResult.error.message);
  if(unpaidInvoicesResult.error) throw new Error(unpaidInvoicesResult.error.message);
  if(mileageResult.error) throw new Error(mileageResult.error.message);
  if(workMinutesResult.error) throw new Error(workMinutesResult.error.message);

  const jobs=todayJobsResult.data || [];
  const scheduledMinutes=jobs.reduce((sum,job)=>sum+(job.duration_minutes || 0),0);
  const unpaidTotal=(unpaidInvoicesResult.data || []).reduce((sum,row)=>sum+Number(row.total || 0),0);
  const miles=Number(mileageResult.data || 0);
  const workMinutes=Number(workMinutesResult.data || 0);

  return (
    <AppShell active="Today">
      <div className="topbar">
        <div>
          <div className="eyebrow">TODAY · {business.name}</div>
          <h1>Today, without the chaos.</h1>
          <p className="subtitle">Jobs, route, leads and money that need your attention — in one place.</p>
        </div>
        <div className="actions">
          <a className="btn" href="/settings">{business.default_language === "es" ? "Español" : "English"}</a>
          <a className="btn primary" href="/leads">+ New lead</a>
        </div>
      </div>

      <section className="grid">
        <article className="card metric"><span className="eyebrow">Jobs today</span><b>{jobs.length}</b><span className="meta">{Math.round((scheduledMinutes/60)*10)/10} scheduled hours</span></article>
        <article className="card metric"><span className="eyebrow">New leads</span><b>{newLeadsResult.count || 0}</b><span className="meta">Need a reply</span></article>
        <article className="card metric"><span className="eyebrow">Open quotes</span><b>{quotesResult.count || 0}</b><span className="meta">Requested, draft or sent</span></article>
        <article className="card metric"><span className="eyebrow">Unpaid</span><b>${unpaidTotal.toFixed(0)}</b><span className="meta">{unpaidInvoicesResult.data?.length || 0} invoices</span></article>

        <article className="card route">
          <div className="section-title"><h2>Today&apos;s Route</h2><span className="badge">{miles.toFixed(1)} mi logged</span></div>
          {!jobs.length ? <div className="empty">No jobs scheduled today.</div> :
            jobs.map((job,index)=>(
              <div className="stop" key={job.id}>
                <div className="order">{job.route_order || index+1}</div>
                <div>
                  <strong>{formatTime(job.starts_at,business.timezone)} · {job.client_name || "Client"}</strong>
                  <div className="meta">{job.service_address} · {Math.round(job.duration_minutes/60*10)/10}h job · {job.travel_buffer_before_minutes || business.default_travel_buffer_minutes} min travel buffer</div>
                </div>
                <span className="status">{job.status.replaceAll("_"," ")}</span>
              </div>
            ))
          }
        </article>

        <aside className="card sidecard">
          <div className="section-title"><h2>Quick actions</h2></div>
          <div className="quick">
            <a href="/leads">+ Add lead</a>
            <a href="/quotes">+ Create quote</a>
            <a href="/calendar">+ Book job</a>
            <a href="/calendar">Start mileage</a>
            <a href="/calendar">Clock into job</a>
          </div>
        </aside>

        <article className="card route">
          <div className="section-title"><h2>Workflow rule</h2><span className="badge">Protected</span></div>
          <div className="note">
            A quote request stays in <strong>Quotes</strong> until the customer accepts it. Acceptance creates or updates the client, adds the job to the calendar and prepares the invoice.
          </div>
        </article>

        <aside className="card sidecard">
          <div className="section-title"><h2>Daily totals</h2></div>
          <div className="quick">
            <span>Driving · {miles.toFixed(1)} mi</span>
            <span>Tracked work · {Math.round((workMinutes/60)*10)/10}h</span>
            <span>Scheduled work · {Math.round((scheduledMinutes/60)*10)/10}h</span>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
