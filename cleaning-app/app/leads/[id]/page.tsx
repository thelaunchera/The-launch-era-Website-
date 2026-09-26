import { notFound } from "next/navigation";
import SectionPage from "@/components/SectionPage";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { updateLead } from "../actions";

export default async function LeadEditPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const business=await requireBusiness();
  const supabase=await createClient();
  const {data:lead}=await supabase.from("leads").select("*").eq("id",id).eq("business_id",business.id).is("archived_at",null).maybeSingle();
  if(!lead) notFound();

  return <SectionPage active="Leads" eyebrow="EDIT LEAD" title={lead.name} description="Keep the inquiry details and next step accurate.">
    <section className="card">
      <form action={updateLead.bind(null,id)} className="form-grid">
        <label>Name<input required name="name" defaultValue={lead.name}/></label>
        <label>Email<input required name="email" type="email" defaultValue={lead.email}/></label>
        <label>Phone<input name="phone" type="tel" defaultValue={lead.phone || ""}/></label>
        <label>Preferred contact<select name="preferred_contact" defaultValue={lead.preferred_contact}><option value="email">Email</option><option value="text">Text</option><option value="whatsapp">WhatsApp</option></select></label>
        <label>Status<select name="status" defaultValue={lead.status}><option value="new">New</option><option value="contacted">Contacted</option><option value="qualified">Qualified</option><option value="quoted">Quoted</option><option value="booked">Booked</option><option value="lost">Lost</option></select></label>
        <label>Lead source<input name="source" defaultValue={lead.source || ""}/></label>
        <label>Service interest<input name="service_interest" defaultValue={lead.service_interest || ""}/></label>
        <label className="span-2">Address<input name="address" defaultValue={lead.address || ""}/></label>
        <label className="span-2">Notes<textarea name="notes" rows={4} defaultValue={lead.notes || ""}/></label>
        <div className="span-2 actions"><a className="btn" href="/leads">Cancel</a><button className="btn primary">Save changes</button></div>
      </form>
    </section>
  </SectionPage>;
}
