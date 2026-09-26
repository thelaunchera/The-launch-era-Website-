import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type Lead = Tables<"leads">;
const statuses = ["new", "contacted", "qualified", "quoted", "booked", "lost"];

export default function LeadsPage() {
  const { business } = useBusiness();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    if (!business) return;
    const { data, error } = await supabase.from("leads").select("*").eq("business_id", business.id).is("archived_at", null).order("created_at", { ascending: false });
    if (error) return setMessage(error.message);
    setLeads(data || []);
  }

  useEffect(() => { void load(); }, [business?.id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business) return;
    const form = new FormData(event.currentTarget);
    const preferred = String(form.get("preferred_contact") || "email");
    const phone = String(form.get("phone") || "").trim() || null;

    if ((preferred === "text" || preferred === "whatsapp") && !phone) {
      setMessage("A phone number is required for Text or WhatsApp.");
      return;
    }

    const payload = {
      business_id: business.id,
      name: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone,
      preferred_contact: preferred,
      source: String(form.get("source") || "").trim() || null,
      service_interest: String(form.get("service_interest") || "").trim() || null,
      address: String(form.get("address") || "").trim() || null,
      notes: String(form.get("notes") || "").trim() || null,
      status: editing?.status || "new",
    };

    const result = editing
      ? await supabase.from("leads").update(payload).eq("id", editing.id).eq("business_id", business.id)
      : await supabase.from("leads").insert(payload);

    if (result.error) return setMessage(result.error.message);
    setEditing(null);
    event.currentTarget.reset();
    await load();
  }

  async function setStatus(id: string, status: string) {
    if (!business) return;
    const { error } = await supabase.from("leads").update({ status }).eq("id", id).eq("business_id", business.id);
    if (error) return setMessage(error.message);
    await load();
  }

  async function archive(id: string) {
    if (!business) return;
    const { error } = await supabase.from("leads").update({ archived_at: new Date().toISOString() }).eq("id", id).eq("business_id", business.id);
    if (error) return setMessage(error.message);
    await load();
  }

  const newCount = leads.filter((lead) => lead.status === "new").length;
  const qualified = leads.filter((lead) => lead.status === "qualified").length;

  return (
    <AppShell>
      <PageHeader eyebrow="INQUIRIES → NEXT STEP" title="Keep every inquiry moving." description="New, contacted, qualified, quoted, booked or lost — without hunting through DMs." />
      {message && <div className="form-message">{message}</div>}

      <div className="grid metric-row">
        <article className="card metric"><span className="eyebrow">New</span><b>{newCount}</b><span className="meta">Need reply</span></article>
        <article className="card metric"><span className="eyebrow">Qualified</span><b>{qualified}</b><span className="meta">Ready for quote</span></article>
      </div>

      <div className="two-column section-gap">
        <section className="card">
          <div className="section-title"><h2>{editing ? "Edit lead" : "Add lead"}</h2><span className="badge">Fast capture</span></div>
          <form key={editing?.id || "new"} onSubmit={submit} className="form-grid compact">
            <label>Name<input required name="name" defaultValue={editing?.name || ""} /></label>
            <label>Email<input required name="email" type="email" defaultValue={editing?.email || ""} /></label>
            <label>Phone<input name="phone" type="tel" defaultValue={editing?.phone || ""} /></label>
            <label>Preferred contact<select name="preferred_contact" defaultValue={editing?.preferred_contact || "email"}><option value="email">Email</option><option value="text">Text</option><option value="whatsapp">WhatsApp</option></select></label>
            <label>Lead source<input name="source" defaultValue={editing?.source || ""} placeholder="Instagram, Google, referral..." /></label>
            <label>Service interest<input name="service_interest" defaultValue={editing?.service_interest || ""} /></label>
            <label className="span-2">Address<input name="address" defaultValue={editing?.address || ""} /></label>
            <label className="span-2">Notes<textarea name="notes" rows={3} defaultValue={editing?.notes || ""} /></label>
            <div className="span-2 actions">
              {editing && <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>}
              <button className="btn primary">{editing ? "Save changes" : "Add lead"}</button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="section-title"><h2>Pipeline</h2><span className="badge">{leads.length} active</span></div>
          {!leads.length ? <div className="empty">No leads yet.</div> :
            <div className="records">
              {leads.map((lead) => (
                <article className="record vertical" key={lead.id}>
                  <div className="record-main">
                    <strong>{lead.name}</strong>
                    <span>{lead.service_interest || "Service not chosen"} · {lead.source || "Source unknown"}</span>
                    <small>{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</small>
                  </div>
                  <div className="record-actions wrap">
                    <select value={lead.status} onChange={(event) => void setStatus(lead.id, event.target.value)}>
                      {statuses.map((status) => <option value={status} key={status}>{status}</option>)}
                    </select>
                    <button className="mini-btn" onClick={() => setEditing(lead)}>Edit</button>
                    <button className="mini-btn danger" onClick={() => void archive(lead.id)}>Archive</button>
                  </div>
                </article>
              ))}
            </div>
          }
        </section>
      </div>
    </AppShell>
  );
}
