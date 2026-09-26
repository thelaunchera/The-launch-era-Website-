import SectionPage from "@/components/SectionPage";
import BackendSetupNotice from "@/components/BackendSetupNotice";
import { hasSupabaseEnv } from "@/lib/env";
import { requireBusiness } from "@/lib/business";
import { updateBusinessSettings } from "./actions";

export default async function Page(){
  if(!hasSupabaseEnv){
    return <SectionPage active="Settings" eyebrow="BUSINESS RULES" title="Make the app fit the business." description="Profile, service area, availability, travel buffer, language and contact preferences live here."><BackendSetupNotice /></SectionPage>;
  }

  const business=await requireBusiness();

  return <SectionPage active="Settings" eyebrow="BUSINESS RULES" title="Make the app fit the business." description="Profile, service area, availability, travel buffer, language and contact preferences live here.">
    <div className="two-column">
      <section className="card">
        <div className="section-title"><h2>Business profile</h2><span className="badge">Owner settings</span></div>
        <form action={updateBusinessSettings} className="form-grid">
          <label className="span-2">Business name<input required name="name" defaultValue={business.name}/></label>
          <label>Account email<input disabled value={business.email}/></label>
          <label>Phone<input name="phone" type="tel" defaultValue={business.phone || ""}/></label>
          <label className="span-2">Service area<input name="service_area" defaultValue={business.service_area || ""}/></label>
          <label>Default language<select name="default_language" defaultValue={business.default_language}><option value="en">English</option><option value="es">Español</option></select></label>
          <label>Travel buffer<select name="travel_buffer" defaultValue={String(business.default_travel_buffer_minutes)}><option value="0">No default buffer</option><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label>
          <button className="btn primary span-2">Save settings</button>
        </form>
      </section>
      <aside className="card">
        <div className="section-title"><h2>Plan</h2><span className="badge">{business.subscription_status}</span></div>
        <div className="note">One plan · first 30 days free · then $5.99/month. Live billing will be connected after migration QA.</div>
        <div className="settings-list">
          <div><span>Timezone</span><strong>{business.timezone}</strong></div>
          <div><span>Default travel block</span><strong>{business.default_travel_buffer_minutes} min</strong></div>
          <div><span>Language</span><strong>{business.default_language === "es" ? "Español" : "English"}</strong></div>
        </div>
      </aside>
    </div>
  </SectionPage>;
}
