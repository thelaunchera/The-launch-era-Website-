import { notFound } from "next/navigation";
import SectionPage from "@/components/SectionPage";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { updateClient } from "../actions";

export default async function ClientEditPage({params}:{params:Promise<{id:string}>}){
  const { id } = await params;
  const business = await requireBusiness();
  const supabase = await createClient();
  const { data: client } = await supabase.from("clients")
    .select("*")
    .eq("id", id)
    .eq("business_id", business.id)
    .is("archived_at", null)
    .maybeSingle();

  if (!client) notFound();

  return (
    <SectionPage active="Clients" eyebrow="EDIT CLIENT" title={client.name} description="Update contact, address and service notes without losing the client history.">
      <section className="card">
        <form action={updateClient.bind(null,id)} className="form-grid">
          <label>Client name<input required name="name" defaultValue={client.name} /></label>
          <label>Email<input required name="email" type="email" defaultValue={client.email} /></label>
          <label>Phone<input name="phone" type="tel" defaultValue={client.phone || ""} /></label>
          <label>Preferred contact
            <select name="preferred_contact" defaultValue={client.preferred_contact}>
              <option value="email">Email</option><option value="text">Text</option><option value="whatsapp">WhatsApp</option>
            </select>
          </label>
          <label className="span-2">Street address<input name="address_line1" defaultValue={client.address_line1 || ""} /></label>
          <label>Address line 2<input name="address_line2" defaultValue={client.address_line2 || ""} /></label>
          <label>City<input name="city" defaultValue={client.city || ""} /></label>
          <label>State<input name="state" maxLength={2} defaultValue={client.state || ""} /></label>
          <label>ZIP<input name="postal_code" defaultValue={client.postal_code || ""} /></label>
          <label className="span-2">Notes<textarea name="notes" rows={4} defaultValue={client.notes || ""} /></label>
          <div className="span-2 actions"><a className="btn" href="/clients">Cancel</a><button className="btn primary">Save changes</button></div>
        </form>
      </section>
    </SectionPage>
  );
}
