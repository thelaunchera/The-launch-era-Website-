import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type Business = {
  id: string;
  owner_user_id: string;
  name: string;
  email: string;
  phone: string | null;
  timezone: string;
  default_language: "en" | "es";
  service_area: string | null;
  default_travel_buffer_minutes: number;
  subscription_status: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
};

export async function getCurrentBusiness(): Promise<Business | null> {
  if (!hasSupabaseEnv) return null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Business | null;
}

export async function requireBusiness(): Promise<Business> {
  const business = await getCurrentBusiness();
  if (!business) redirect("/onboarding");
  return business;
}
