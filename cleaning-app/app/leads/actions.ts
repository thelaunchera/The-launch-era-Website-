"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { nullableText, requiredText } from "@/lib/form";

const statuses = ["new","contacted","qualified","quoted","booked","lost"] as const;

function leadPayload(formData: FormData) {
  const preferred = String(formData.get("preferred_contact") || "email");
  const phone = nullableText(formData, "phone");
  if ((preferred === "text" || preferred === "whatsapp") && !phone) {
    throw new Error("A phone number is required for Text or WhatsApp.");
  }

  const status = String(formData.get("status") || "new");

  return {
    name: requiredText(formData, "name", "Lead name"),
    email: requiredText(formData, "email", "Email"),
    phone,
    preferred_contact: ["email","text","whatsapp"].includes(preferred) ? preferred : "email",
    source: nullableText(formData, "source"),
    status: statuses.includes(status as typeof statuses[number]) ? status : "new",
    service_interest: nullableText(formData, "service_interest"),
    address: nullableText(formData, "address"),
    notes: nullableText(formData, "notes"),
  };
}

export async function createLead(formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    business_id: business.id,
    ...leadPayload(formData),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/leads");
}

export async function updateLead(id: string, formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const { error } = await supabase.from("leads")
    .update(leadPayload(formData))
    .eq("id", id)
    .eq("business_id", business.id);
  if (error) throw new Error(error.message);
  revalidatePath("/leads");
  redirect("/leads");
}

export async function setLeadStatus(id: string, formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const status = String(formData.get("status") || "new");
  if (!statuses.includes(status as typeof statuses[number])) throw new Error("Invalid status.");

  const { error } = await supabase.from("leads")
    .update({ status })
    .eq("id", id)
    .eq("business_id", business.id);
  if (error) throw new Error(error.message);
  revalidatePath("/leads");
}

export async function archiveLead(id: string) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const { error } = await supabase.from("leads")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id)
    .eq("business_id", business.id);
  if (error) throw new Error(error.message);
  revalidatePath("/leads");
}
