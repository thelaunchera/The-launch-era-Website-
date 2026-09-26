"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { nullableText, requiredText } from "@/lib/form";

function contact(formData: FormData) {
  const preferred = String(formData.get("preferred_contact") || "email");
  const phone = nullableText(formData, "phone");

  if ((preferred === "text" || preferred === "whatsapp") && !phone) {
    throw new Error("A phone number is required for Text or WhatsApp.");
  }

  return {
    preferred_contact: ["email","text","whatsapp"].includes(preferred) ? preferred : "email",
    phone,
  };
}

export async function createClient(formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createSupabaseClient();
  const contactFields = contact(formData);

  const { error } = await supabase.from("clients").insert({
    business_id: business.id,
    name: requiredText(formData, "name", "Client name"),
    email: requiredText(formData, "email", "Email"),
    ...contactFields,
    address_line1: nullableText(formData, "address_line1"),
    address_line2: nullableText(formData, "address_line2"),
    city: nullableText(formData, "city"),
    state: nullableText(formData, "state"),
    postal_code: nullableText(formData, "postal_code"),
    notes: nullableText(formData, "notes"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}

export async function updateClient(id: string, formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createSupabaseClient();
  const contactFields = contact(formData);

  const { error } = await supabase.from("clients").update({
    name: requiredText(formData, "name", "Client name"),
    email: requiredText(formData, "email", "Email"),
    ...contactFields,
    address_line1: nullableText(formData, "address_line1"),
    address_line2: nullableText(formData, "address_line2"),
    city: nullableText(formData, "city"),
    state: nullableText(formData, "state"),
    postal_code: nullableText(formData, "postal_code"),
    notes: nullableText(formData, "notes"),
  }).eq("id", id).eq("business_id", business.id);

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
  redirect("/clients");
}

export async function archiveClient(id: string) {
  const business = await requireBusiness();
  const supabase = await createSupabaseClient();

  const { error } = await supabase.from("clients")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", id)
    .eq("business_id", business.id);

  if (error) throw new Error(error.message);
  revalidatePath("/clients");
}
