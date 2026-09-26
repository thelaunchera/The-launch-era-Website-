import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../context/BusinessContext";
import { supabase } from "../lib/supabase";
import LoadingScreen from "../components/LoadingScreen";

export default function OnboardingPage() {
  const { user } = useAuth();
  const { business, loading, refresh } = useBusiness();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingScreen />;
  if (business) return <Navigate to="/" replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setBusy(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const started = new Date();
    const ends = new Date(started);
    ends.setDate(ends.getDate() + 30);

    const { error } = await supabase.from("businesses").insert({
      owner_user_id: user.id,
      name: String(form.get("name") || "").trim(),
      email: user.email || "",
      phone: String(form.get("phone") || "").trim() || null,
      service_area: String(form.get("service_area") || "").trim() || null,
      default_language: form.get("default_language") === "es" ? "es" : "en",
      default_travel_buffer_minutes: Number(form.get("travel_buffer") || 30),
      trial_started_at: started.toISOString(),
      trial_ends_at: ends.toISOString(),
      subscription_status: "trial",
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    await refresh();
    navigate("/", { replace: true });
  }

  return (
    <main className="center-page">
      <section className="auth-card onboarding-card">
        <span className="eyebrow">FIRST SETUP</span>
        <h1>Tell us about your cleaning business.</h1>
        <p className="subtitle">Start with the basics. You can change these settings later.</p>

        <form onSubmit={submit} className="form-grid">
          <label className="span-2">Business name<input required name="name" /></label>
          <label>Phone<input name="phone" type="tel" /></label>
          <label>Service area<input name="service_area" placeholder="Palm Beach County, FL" /></label>
          <label>Default language
            <select name="default_language" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
          <label>Travel buffer
            <select name="travel_buffer" defaultValue="30">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
          <div className="span-2 note">30-day trial · no card required. Billing will be activated only after migration QA.</div>
          {message && <div className="span-2 form-message">{message}</div>}
          <button className="btn primary span-2" disabled={busy}>{busy ? "Creating workspace…" : "Open my workspace"}</button>
        </form>
      </section>
    </main>
  );
}
