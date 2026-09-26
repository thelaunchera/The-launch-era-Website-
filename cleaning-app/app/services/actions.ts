"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { nullableText, nonNegativeNumber, requiredText } from "@/lib/form";

const pricingTypes = ["flat","hourly","sqft","quote"] as const;

function servicePayload(formData: FormData) {
  const pricing = String(formData.get("pricing_type") || "flat");
  const duration = Math.max(15, Math.round(nonNegativeNumber(formData, "duration_minutes", 120)));

  return {
    name: requiredText(formData, "name", "Service name"),
    description: nullableText(formData, "description"),
    pricing_type: pricingTypes.includes(pricing as typeof pricingTypes[number]) ? pricing : "flat",
    base_price: nullableText(formData, "base_price") ? nonNegativeNumber(formData, "base_price", 0) : null,
    default_duration_minutes: duration,
    active: true,
  };
}

export async function createService(formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const { error } = await supabase.from("services").insert({
    business_id: business.id,
    ...servicePayload(formData),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/services");
}

export async function updateService(id: string, formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const { error } = await supabase.from("services")
    .update(servicePayload(formData))
    .eq("id", id)
    .eq("business_id", business.id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
  redirect("/services");
}

export async function deactivateService(id: string) {
  const business = await requireBusiness();
  const supabase = await createClient();
  const { error } = await supabase.from("services")
    .update({ active: false })
    .eq("id", id)
    .eq("business_id", business.id);
  if (error) throw new Error(error.message);
  revalidatePath("/services");
}
