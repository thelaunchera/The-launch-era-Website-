import SectionPage from "@/components/SectionPage";
import BackendSetupNotice from "@/components/BackendSetupNotice";
import { hasSupabaseEnv } from "@/lib/env";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { archiveLead, createLead, setLeadStatus } from "./actions";

const statuses=["new","contacted","qualified","quoted","booked","lost"];

export default async function Page(){
  if (!hasSupabaseEnv) {
    return <SectionPage active="Leads" eyebrow="INQUIRIES → NEXT STEP" title="Keep every inquiry moving." description="New, contacted, qualified, quoted, booked or lost — without hunting through DMs."><BackendSetupNotice /></SectionPage>;
  }

  const business=await requireBusiness();
  const supabase=await createClient();
  const {data:leads,error}=await supabase.from("leads").select("*")
    .eq("business_id",business.id).is("archived_at",null).order("created_at",{ascending:false});
  if(error) throw new Error(error.message);

  const newCount=leads?.filter((x)=>x.status==="new").length || 0;
  const qualified=leads?.filter((x)=>x.status==="qualified").length || 0;

  return <SectionPage active="Leads" eyebrow="INQUIRIES → NEXT STEP" title="Keep every inquiry moving." description="New, contacted, qualified, quoted, booked or lost — without hunting through DMs.">
    <div className="grid">
      <article className="card metric"><span className="eyebrow">New</span><b>{newCount}</b><span className="meta">Need reply</span></article>
      <article className="card metric"><span className="eyebrow">Qualified</span><b>{qualified}</b><span className="meta">Ready for quote</span></article>
    </div>
    <div className="two-column section-gap">
      <section className="card">
        <div className="section-title"><h2>Add lead</h2><span className="badge">Fast capture</span></div>
        <form action={createLead} className="form-grid compact">
          <label>Name<input required name="name"/></label>
          <label>Email<input required name="email" type="email"/></label>
          <label>Phone<input name="phone" type="tel"/></label>
          <label>Preferred contact<select name="preferred_contact" defaultValue="email"><option value="email">Email</option><option value="text">Text</option><option value="whatsapp">WhatsApp</option></select></label>
          <label>Lead source<input name="source" placeholder="Instagram, Google, referral..." /></label>
          <label>Service interest<input name="service_interest" placeholder="Recurring, deep clean..." /></label>
          <label className="span-2">Address<input name="address"/></label>
          <label className="span-2">Notes<textarea name="notes" rows={3}/></label>
          <button className="btn primary span-2">Add lead</button>
        </form>
      </section>
      <section className="card">
        <div className="section-title"><h2>Pipeline</h2><span className="badge">{leads?.length || 0} active</span></div>
        {!leads?.length ? <div className="empty">No leads yet.</div> :
          <div className="records">
            {leads.map((lead)=>(
              <article className="record vertical" key={lead.id}>
                <div className="record-main">
                  <strong>{lead.name}</strong>
                  <span>{lead.service_interest || "Service not chosen"} · {lead.source || "Source unknown"}</span>
                  <small>{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</small>
                </div>
                <div className="record-actions wrap">
                  <form action={setLeadStatus.bind(null,lead.id)}>
                    <select name="status" defaultValue={lead.status}>{statuses.map((s)=><option value={s} key={s}>{s}</option>)}</select>
                    <button className="mini-btn">Save status</button>
                  </form>
                  <a className="mini-btn" href={`/leads/${lead.id}`}>Edit</a>
                  <form action={archiveLead.bind(null,lead.id)}><button className="mini-btn danger">Archive</button></form>
                </div>
              </article>
            ))}
          </div>
        }
      </section>
    </div>
  </SectionPage>;
}
