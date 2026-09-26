"use server";

import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  if (hasSupabaseEnv) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
