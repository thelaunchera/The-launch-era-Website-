import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import type { Tables } from "../lib/database.types";

export type Business = Tables<"businesses">;

type BusinessContextValue = {
  business: Business | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const BusinessContext = createContext<BusinessContextValue>({
  business: null,
  loading: true,
  refresh: async () => {},
});

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setBusiness(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("owner_user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    setBusiness(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  const value = useMemo(() => ({ business, loading, refresh }), [business, loading, refresh]);
  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  return useContext(BusinessContext);
}
