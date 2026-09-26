import SectionPage from "@/components/SectionPage";
import BackendSetupNotice from "@/components/BackendSetupNotice";
import { hasSupabaseEnv } from "@/lib/env";
import { requireBusiness } from "@/lib/business";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { archiveClient, createClient } from "./actions";

type ClientRow = {
  id:string; name:string; email:string; phone:string|null; preferred_contact:string;
  address_line1:string|null; city:string|null; state:string|null;
};

export default async function Page(){
  if (!hasSupabaseEnv) {
    return <SectionPage active="Clients" eyebrow="CLIENT HISTORY" title="Know who you clean for." description="Contact details, addresses, preferences, service notes and job history in one record."><BackendSetupNotice /></SectionPage>;
  }

  const business = await requireBusiness();
  const supabase = await createSupabaseClient();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .eq("business_id", business.id)
    .is("archived_at", null)
    .order("name");

  if (error) throw new Error(error.message);
  const clientRows=(clients || []) as ClientRow[];

  return (
    <SectionPage active="Clients" eyebrow="CLIENT HISTORY" title="Know who you clean for." description="Contact details, addresses, preferences, service notes and job history in one record.">
      <div className="two-column">
        <section className="card">
          <div className="section-title"><h2>Add client</h2><span className="badge">Owner only</span></div>
          <form action={createClient} className="form-grid compact">
            <label>Client name<input required name="name" /></label>
            <label>Email<input required name="email" type="email" /></label>
            <label>Phone<input name="phone" type="tel" /></label>
            <label>Preferred contact
              <select name="preferred_contact" defaultValue="email">
                <option value="email">Email</option>
                <option value="text">Text</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>
            <label className="span-2">Street address<input name="address_line1" /></label>
            <label>City<input name="city" /></label>
            <label>State<input name="state" maxLength={2} placeholder="FL" /></label>
            <label>ZIP<input name="postal_code" /></label>
            <label className="span-2">Notes<textarea name="notes" rows={3} /></label>
            <button className="btn primary span-2">Add client</button>
          </form>
        </section>

        <section className="card">
          <div className="section-title"><h2>Clients</h2><span className="badge">{clientRows.length} active</span></div>
          {!clientRows.length ? <div className="empty">No clients yet. Add the first one when you are ready.</div> :
            <div className="records">
              {clientRows.map((client:ClientRow)=>(
                <article className="record" key={client.id}>
                  <div>
                    <strong>{client.name}</strong>
                    <span>{client.email}{client.phone ? ` · ${client.phone}` : ""}</span>
                    <small>{[client.address_line1,client.city,client.state].filter(Boolean).join(", ") || "No address yet"}</small>
                  </div>
                  <div className="record-actions">
                    <a className="mini-btn" href={`/clients/${client.id}`}>Edit</a>
                    <form action={archiveClient.bind(null, client.id)}><button className="mini-btn danger">Archive</button></form>
                  </div>
                </article>
              ))}
            </div>
          }
        </section>
      </div>
    </SectionPage>
  );
}
