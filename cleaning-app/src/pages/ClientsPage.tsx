import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type Client = Tables<"clients">;

export default function ClientsPage() {
  const { business } = useBusiness();
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Client | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    if (!business) return;
    const { data, error } = await supabase.from("clients").select("*").eq("business_id", business.id).is("archived_at", null).order("name");
    if (error) return setMessage(error.message);
    setClients(data || []);
  }

  useEffect(() => { void load(); }, [business?.id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business) return;
    setMessage("");

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
      address_line1: String(form.get("address_line1") || "").trim() || null,
      city: String(form.get("city") || "").trim() || null,
      state: String(form.get("state") || "").trim() || null,
      postal_code: String(form.get("postal_code") || "").trim() || null,
      notes: String(form.get("notes") || "").trim() || null,
    };

    const result = editing
      ? await supabase.from("clients").update(payload).eq("id", editing.id).eq("business_id", business.id)
      : await supabase.from("clients").insert(payload);

    if (result.error) return setMessage(result.error.message);
    setEditing(null);
    event.currentTarget.reset();
    await load();
  }

  async function archive(id: string) {
    if (!business) return;
    const { error } = await supabase.from("clients").update({ archived_at: new Date().toISOString() }).eq("id", id).eq("business_id", business.id);
    if (error) return setMessage(error.message);
    if (editing?.id === id) setEditing(null);
    await load();
  }

  return (
    <AppShell>
      <PageHeader eyebrow="CLIENT HISTORY" title="Know who you clean for." description="Contact details, addresses, preferences and service notes in one record." />
      {message && <div className="form-message">{message}</div>}

      <div className="two-column">
        <section className="card">
          <div className="section-title"><h2>{editing ? "Edit client" : "Add client"}</h2><span className="badge">Owner only</span></div>
          <form key={editing?.id || "new"} onSubmit={submit} className="form-grid compact">
            <label>Client name<input required name="name" defaultValue={editing?.name || ""} /></label>
            <label>Email<input required name="email" type="email" defaultValue={editing?.email || ""} /></label>
            <label>Phone<input name="phone" type="tel" defaultValue={editing?.phone || ""} /></label>
            <label>Preferred contact
              <select name="preferred_contact" defaultValue={editing?.preferred_contact || "email"}>
                <option value="email">Email</option><option value="text">Text</option><option value="whatsapp">WhatsApp</option>
              </select>
            </label>
            <label className="span-2">Street address<input name="address_line1" defaultValue={editing?.address_line1 || ""} /></label>
            <label>City<input name="city" defaultValue={editing?.city || ""} /></label>
            <label>State<input name="state" maxLength={2} defaultValue={editing?.state || ""} /></label>
            <label>ZIP<input name="postal_code" defaultValue={editing?.postal_code || ""} /></label>
            <label className="span-2">Notes<textarea name="notes" rows={3} defaultValue={editing?.notes || ""} /></label>
            <div className="span-2 actions">
              {editing && <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>}
              <button className="btn primary">{editing ? "Save changes" : "Add client"}</button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="section-title"><h2>Clients</h2><span className="badge">{clients.length} active</span></div>
          {!clients.length ? <div className="empty">No clients yet.</div> :
            <div className="records">
              {clients.map((client) => (
                <article className="record" key={client.id}>
                  <div>
                    <strong>{client.name}</strong>
                    <span>{client.email}{client.phone ? ` · ${client.phone}` : ""}</span>
                    <small>{[client.address_line1, client.city, client.state].filter(Boolean).join(", ") || "No address yet"}</small>
                  </div>
                  <div className="record-actions">
                    <button className="mini-btn" onClick={() => setEditing(client)}>Edit</button>
                    <button className="mini-btn danger" onClick={() => void archive(client.id)}>Archive</button>
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
