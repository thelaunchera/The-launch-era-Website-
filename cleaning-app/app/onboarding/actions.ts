"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function createBusiness(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = textValue(formData, "name");
  const phone = textValue(formData, "phone") || null;
  const serviceArea = textValue(formData, "service_area") || null;
  const language = textValue(formData, "default_language") === "es" ? "es" : "en";
  const travelBuffer = Math.max(0, Number(formData.get("travel_buffer") || 30));

  if (!name) throw new Error("Business name is required.");

  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (existing) redirect("/");

  const started = new Date();
  const ends = new Date(started);
  ends.setDate(ends.getDate() + 30);

  const { error } = await supabase.from("businesses").insert({
    owner_user_id: user.id,
    name,
    email: user.email || "",
    phone,
    service_area: serviceArea,
    default_language: language,
    default_travel_buffer_minutes: travelBuffer,
    trial_started_at: started.toISOString(),
    trial_ends_at: ends.toISOString(),
    subscription_status: "trial",
  });

  if (error) throw new Error(error.message);
  redirect("/");
}
