import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = "https://bowacxhmjvrqixtwaikv.supabase.co";
const supabasePublishableKey = "sb_publishable_0TueitFYiRF3rAEMLMT8-w_FvbvY0rB";

export const appBaseUrl =
  "https://thelaunchera.github.io/The-launch-era-Website-/cleaning-app/";

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  }
);

export async function finishAuthRedirect() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (!code) return;

  const recovery = url.searchParams.get("recovery") === "1";
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;

  url.searchParams.delete("code");
  url.searchParams.delete("recovery");
  window.history.replaceState({}, "", url.pathname + url.search + window.location.hash);

  if (recovery) {
    window.location.hash = "#/reset-password";
  }
}
