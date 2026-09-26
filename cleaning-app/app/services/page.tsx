import SectionPage from "@/components/SectionPage";
import BackendSetupNotice from "@/components/BackendSetupNotice";
import { hasSupabaseEnv } from "@/lib/env";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { createService, deactivateService } from "./actions";

export default async function Page(){
  if(!hasSupabaseEnv){
    return <SectionPage active="Services" eyebrow="SERVICES + ADD-ONS" title="Set the work once." description="Define pricing type, duration and add-ons so quotes and bookings use the same service information."><BackendSetupNotice /></SectionPage>;
  }

  const business=await requireBusiness();
  const supabase=await createClient();
  const {data:services,error}=await supabase.from("services").select("*").eq("business_id",business.id).eq("active",true).order("name");
  if(error) throw new Error(error.message);

  return <SectionPage active="Services" eyebrow="SERVICES + ADD-ONS" title="Set the work once." description="Define pricing type, duration and add-ons so quotes and bookings use the same service information.">
    <div className="two-column">
      <section className="card">
        <div className="section-title"><h2>Add service</h2><span className="badge">Used by booking + quotes</span></div>
        <form action={createService} className="form-grid compact">
          <label className="span-2">Service name<input required name="name" placeholder="Standard Cleaning"/></label>
          <label>Pricing type<select name="pricing_type" defaultValue="flat"><option value="flat">Flat price</option><option value="hourly">Hourly</option><option value="sqft">Per sq ft</option><option value="quote">Quote required</option></select></label>
          <label>Base price<input name="base_price" type="number" min="0" step="0.01"/></label>
          <label>Expected duration<input required name="duration_minutes" type="number" min="15" step="15" defaultValue="120"/></label>
          <label className="span-2">Description<textarea name="description" rows={3}/></label>
          <button className="btn primary span-2">Add service</button>
        </form>
      </section>
      <section className="card">
        <div className="section-title"><h2>Services</h2><span className="badge">{services?.length || 0} active</span></div>
        {!services?.length ? <div className="empty">No services yet. Add your first cleaning service.</div> :
          <div className="records">
            {services.map((service)=>(
              <article className="record" key={service.id}>
                <div>
                  <strong>{service.name}</strong>
                  <span>{service.pricing_type === "quote" ? "Quote required" : service.base_price !== null ? `$${Number(service.base_price).toFixed(2)} · ${service.pricing_type}` : service.pricing_type}</span>
                  <small>{service.default_duration_minutes} min expected duration</small>
                </div>
                <div className="record-actions">
                  <a className="mini-btn" href={`/services/${service.id}`}>Edit</a>
                  <form action={deactivateService.bind(null,service.id)}><button className="mini-btn danger">Deactivate</button></form>
                </div>
              </article>
            ))}
          </div>
        }
      </section>
    </div>
  </SectionPage>;
}
