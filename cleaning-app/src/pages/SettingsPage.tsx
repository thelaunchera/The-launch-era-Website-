import { useState, type FormEvent } from "react";
import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";

export default function SettingsPage() {
  const { business, refresh } = useBusiness();
  const [message, setMessage] = useState("");

  if (!business) return null;
  const currentBusiness = business;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const { error } = await supabase.from("businesses").update({
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim() || null,
      service_area: String(form.get("service_area") || "").trim() || null,
      default_language: form.get("default_language") === "es" ? "es" : "en",
      default_travel_buffer_minutes: Number(form.get("travel_buffer") || 30),
    }).eq("id", currentBusiness.id);

    if (error) return setMessage(error.message);
    await refresh();
    setMessage("Settings saved.");
  }

  return (
    <AppShell>
      <PageHeader eyebrow="BUSINESS RULES" title="Make the app fit the business." description="Profile, service area, language and travel buffer live here." />
      {message && <div className="form-message">{message}</div>}

      <div className="two-column">
        <section className="card">
          <div className="section-title"><h2>Business profile</h2><span className="badge">Owner settings</span></div>
          <form onSubmit={submit} className="form-grid">
            <label className="span-2">Business name<input required name="name" defaultValue={currentBusiness.name} /></label>
            <label>Account email<input disabled value={currentBusiness.email} /></label>
            <label>Phone<input name="phone" type="tel" defaultValue={currentBusiness.phone || ""} /></label>
            <label className="span-2">Service area<input name="service_area" defaultValue={currentBusiness.service_area || ""} /></label>
            <label>Default language
              <select name="default_language" defaultValue={currentBusiness.default_language}>
                <option value="en">English</option><option value="es">Español</option>
              </select>
            </label>
            <label>Travel buffer
              <select name="travel_buffer" defaultValue={String(currentBusiness.default_travel_buffer_minutes)}>
                <option value="0">No default buffer</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </label>
            <button className="btn primary span-2">Save settings</button>
          </form>
        </section>

        <aside className="card">
          <div className="section-title"><h2>Plan</h2><span className="badge">{currentBusiness.subscription_status}</span></div>
          <div className="note">One plan · first 30 days free · then $5.99/month. Live billing stays off until migration QA is complete.</div>
          <div className="settings-list">
            <div><span>Timezone</span><strong>{currentBusiness.timezone}</strong></div>
            <div><span>Travel buffer</span><strong>{currentBusiness.default_travel_buffer_minutes} min</strong></div>
            <div><span>Language</span><strong>{currentBusiness.default_language === "es" ? "Español" : "English"}</strong></div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
