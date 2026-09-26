import { NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useBusiness } from "../context/BusinessContext";

const items = [
  ["Today", "/"],
  ["Leads", "/leads"],
  ["Clients", "/clients"],
  ["Calendar", "/calendar"],
  ["Quotes", "/quotes"],
  ["Invoices", "/invoices"],
  ["Services", "/services"],
  ["Team", "/team"],
  ["Reports", "/reports"],
  ["Settings", "/settings"],
] as const;

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { business } = useBusiness();

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">THE LAUNCH ERA<small>CLEANING APP</small></div>
        {business && <div className="business-chip">{business.name}</div>}
        <nav className="nav">
          {items.map(([label, href]) => (
            <NavLink
              end={href === "/"}
              to={href}
              key={label}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button className="text-button sidebar-bottom" onClick={signOut}>Sign out</button>
      </aside>

      <main className="main">{children}</main>

      <nav className="mobile-nav">
        {items.slice(0, 4).map(([label, href]) => (
          <NavLink end={href === "/"} to={href} key={label}>{label}</NavLink>
        ))}
        <NavLink to="/settings">More</NavLink>
      </nav>
    </div>
  );
}
