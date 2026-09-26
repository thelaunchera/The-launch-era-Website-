import { notFound } from "next/navigation";
import SectionPage from "@/components/SectionPage";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { updateService } from "../actions";

export default async function ServiceEditPage({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const business=await requireBusiness();
  const supabase=await createClient();
  const {data:service}=await supabase.from("services").select("*").eq("id",id).eq("business_id",business.id).eq("active",true).maybeSingle();
  if(!service) notFound();

  return <SectionPage active="Services" eyebrow="EDIT SERVICE" title={service.name} description="Pricing and duration feed the quote and booking workflow.">
    <section className="card">
      <form action={updateService.bind(null,id)} className="form-grid">
        <label className="span-2">Service name<input required name="name" defaultValue={service.name}/></label>
        <label>Pricing type<select name="pricing_type" defaultValue={service.pricing_type}><option value="flat">Flat price</option><option value="hourly">Hourly</option><option value="sqft">Per sq ft</option><option value="quote">Quote required</option></select></label>
        <label>Base price<input name="base_price" type="number" min="0" step="0.01" defaultValue={service.base_price ?? ""}/></label>
        <label>Expected duration<input required name="duration_minutes" type="number" min="15" step="15" defaultValue={service.default_duration_minutes}/></label>
        <label className="span-2">Description<textarea name="description" rows={4} defaultValue={service.description || ""}/></label>
        <div className="span-2 actions"><a className="btn" href="/services">Cancel</a><button className="btn primary">Save changes</button></div>
      </form>
    </section>
  </SectionPage>;
}
