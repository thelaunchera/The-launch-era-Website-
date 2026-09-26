import { redirect } from "next/navigation";
import BackendSetupNotice from "@/components/BackendSetupNotice";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { createBusiness } from "./actions";

export default async function OnboardingPage() {
  if (!hasSupabaseEnv) {
    return <main className="center-page"><BackendSetupNotice /></main>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (existing) redirect("/");

  return (
    <main className="center-page">
      <section className="auth-card onboarding-card">
        <span className="eyebrow">FIRST SETUP</span>
        <h1>Tell us about your cleaning business.</h1>
        <p className="subtitle">Start with the basics. You can change these settings later.</p>
        <form action={createBusiness} className="form-grid">
          <label className="span-2">Business name<input required name="name" /></label>
          <label>Phone<input name="phone" type="tel" /></label>
          <label>Service area<input name="service_area" placeholder="Palm Beach County, FL" /></label>
          <label>Default language
            <select name="default_language" defaultValue="en">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
          <label>Default travel buffer
            <select name="travel_buffer" defaultValue="30">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </label>
          <div className="span-2 note">
            Your account starts with the planned 30-day trial. Billing is not connected in this migration build yet.
          </div>
          <button className="btn primary span-2">Open my workspace</button>
        </form>
      </section>
    </main>
  );
}
