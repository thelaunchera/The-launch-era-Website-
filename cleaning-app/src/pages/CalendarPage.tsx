import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type Job = Tables<"jobs">;
type Client = Tables<"clients">;
type Service = Tables<"services">;

export default function CalendarPage() {
  const { business } = useBusiness();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [message, setMessage] = useState("");

  async function load() {
    if (!business) return;
    const [j, c, s] = await Promise.all([
      supabase.from("jobs").select("*").eq("business_id", business.id).order("starts_at"),
      supabase.from("clients").select("*").eq("business_id", business.id).is("archived_at", null),
      supabase.from("services").select("*").eq("business_id", business.id),
    ]);
    if (j.error) return setMessage(j.error.message);
    if (c.error) return setMessage(c.error.message);
    if (s.error) return setMessage(s.error.message);
    setJobs(j.data || []);
    setClients(c.data || []);
    setServices(s.data || []);
  }

  useEffect(() => { void load(); }, [business?.id]);

  const clientMap = useMemo(() => Object.fromEntries(clients.map((c) => [c.id, c])), [clients]);
  const serviceMap = useMemo(() => Object.fromEntries(services.map((s) => [s.id, s])), [services]);

  async function setStatus(job: Job, status: string) {
    if (!business) return;
    const { error } = await supabase.from("jobs").update({ status }).eq("id", job.id).eq("business_id", business.id);
    if (error) return setMessage(error.message);
    await load();
  }

  function formatDateTime(value: string) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: business?.timezone || "America/New_York",
    }).format(new Date(value));
  }

  return (
    <AppShell>
      <PageHeader eyebrow="CALENDAR + ROUTE" title="See the workday before it starts." description="Accepted quotes become scheduled jobs here, with travel buffers included." />
      {message && <div className="form-message">{message}</div>}

      <section className="card">
        <div className="section-title"><h2>Upcoming jobs</h2><span className="badge">{jobs.filter((j) => j.status !== "canceled").length} jobs</span></div>
        {!jobs.length ? <div className="empty">No jobs scheduled yet. Accept a quote and it will appear here.</div> :
          <div className="records">
            {jobs.map((job) => {
              const client = job.client_id ? clientMap[job.client_id] : null;
              const service = job.service_id ? serviceMap[job.service_id] : null;
              return (
                <article className="record vertical" key={job.id}>
                  <div className="record-main">
                    <strong>{formatDateTime(job.starts_at)} · {client?.name || "Client"}</strong>
                    <span>{service?.name || "Cleaning job"} · {job.duration_minutes} min</span>
                    <small>{job.service_address} · buffer {job.travel_buffer_before_minutes}/{job.travel_buffer_after_minutes} min</small>
                  </div>
                  <div className="record-actions wrap">
                    <select value={job.status} onChange={(e) => void setStatus(job, e.target.value)}>
                      <option value="scheduled">Scheduled</option>
                      <option value="on_the_way">On the way</option>
                      <option value="in_progress">In progress</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                      <option value="no_show">No show</option>
                    </select>
                  </div>
                </article>
              );
            })}
          </div>
        }
      </section>
    </AppShell>
  );
}
