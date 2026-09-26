import { useEffect, useState, type FormEvent } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type Service = Tables<"services">;

export default function ServicesPage() {
  const { business } = useBusiness();
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    if (!business) return;
    const { data, error } = await supabase.from("services").select("*").eq("business_id", business.id).eq("active", true).order("name");
    if (error) return setMessage(error.message);
    setServices(data || []);
  }

  useEffect(() => { void load(); }, [business?.id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business) return;

    const form = new FormData(event.currentTarget);
    const rawPrice = String(form.get("base_price") || "").trim();
    const payload = {
      business_id: business.id,
      name: String(form.get("name") || "").trim(),
      description: String(form.get("description") || "").trim() || null,
      pricing_type: String(form.get("pricing_type") || "flat"),
      base_price: rawPrice ? Number(rawPrice) : null,
      default_duration_minutes: Math.max(15, Number(form.get("duration_minutes") || 120)),
      active: true,
    };

    const result = editing
      ? await supabase.from("services").update(payload).eq("id", editing.id).eq("business_id", business.id)
      : await supabase.from("services").insert(payload);

    if (result.error) return setMessage(result.error.message);
    setEditing(null);
    event.currentTarget.reset();
    await load();
  }

  async function deactivate(id: string) {
    if (!business) return;
    const { error } = await supabase.from("services").update({ active: false }).eq("id", id).eq("business_id", business.id);
    if (error) return setMessage(error.message);
    await load();
  }

  return (
    <AppShell>
      <PageHeader eyebrow="SERVICES + ADD-ONS" title="Set the work once." description="Pricing and expected duration feed quotes, booking and scheduling." />
      {message && <div className="form-message">{message}</div>}

      <div className="two-column">
        <section className="card">
          <div className="section-title"><h2>{editing ? "Edit service" : "Add service"}</h2><span className="badge">Booking + quotes</span></div>
          <form key={editing?.id || "new"} onSubmit={submit} className="form-grid compact">
            <label className="span-2">Service name<input required name="name" defaultValue={editing?.name || ""} placeholder="Standard Cleaning" /></label>
            <label>Pricing type
              <select name="pricing_type" defaultValue={editing?.pricing_type || "flat"}>
                <option value="flat">Flat price</option>
                <option value="hourly">Hourly</option>
                <option value="sqft">Per sq ft</option>
                <option value="quote">Quote required</option>
              </select>
            </label>
            <label>Base price<input name="base_price" type="number" min="0" step="0.01" defaultValue={editing?.base_price ?? ""} /></label>
            <label>Expected duration<input required name="duration_minutes" type="number" min="15" step="15" defaultValue={editing?.default_duration_minutes || 120} /></label>
            <label className="span-2">Description<textarea name="description" rows={3} defaultValue={editing?.description || ""} /></label>
            <div className="span-2 actions">
              {editing && <button type="button" className="btn" onClick={() => setEditing(null)}>Cancel</button>}
              <button className="btn primary">{editing ? "Save changes" : "Add service"}</button>
            </div>
          </form>
        </section>

        <section className="card">
          <div className="section-title"><h2>Services</h2><span className="badge">{services.length} active</span></div>
          {!services.length ? <div className="empty">No services yet.</div> :
            <div className="records">
              {services.map((service) => (
                <article className="record" key={service.id}>
                  <div>
                    <strong>{service.name}</strong>
                    <span>{service.pricing_type === "quote" ? "Quote required" : service.base_price !== null ? `$${Number(service.base_price).toFixed(2)} · ${service.pricing_type}` : service.pricing_type}</span>
                    <small>{service.default_duration_minutes} min expected duration</small>
                  </div>
                  <div className="record-actions">
                    <button className="mini-btn" onClick={() => setEditing(service)}>Edit</button>
                    <button className="mini-btn danger" onClick={() => void deactivate(service.id)}>Deactivate</button>
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
