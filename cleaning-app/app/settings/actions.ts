"use server";

import { revalidatePath } from "next/cache";
import { requireBusiness } from "@/lib/business";
import { createClient } from "@/lib/supabase/server";
import { nullableText, requiredText } from "@/lib/form";

export async function updateBusinessSettings(formData: FormData) {
  const business = await requireBusiness();
  const supabase = await createClient();

  const language = String(formData.get("default_language") || "en") === "es" ? "es" : "en";
  const travel = Math.max(0, Number(formData.get("travel_buffer") || 30));

  const { error } = await supabase.from("businesses").update({
    name: requiredText(formData, "name", "Business name"),
    phone: nullableText(formData, "phone"),
    service_area: nullableText(formData, "service_area"),
    default_language: language,
    default_travel_buffer_minutes: travel,
  }).eq("id", business.id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/");
}
