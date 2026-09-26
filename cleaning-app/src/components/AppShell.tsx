import { NavLink, useNavigate } from "react-router-dom";
import { useState, type ReactNode } from "react";
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

const mobilePrimary = items.slice(0, 4);
const mobileMore = items.slice(4);

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { business } = useBusiness();
  const [moreOpen, setMoreOpen] = useState(false);

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

      {moreOpen && (
        <div className="mobile-more-backdrop" onClick={() => setMoreOpen(false)}>
          <div className="mobile-more-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-more-head">
              <div>
                <span className="eyebrow">WORKSPACE</span>
                <h2>More</h2>
              </div>
              <button className="mini-btn" onClick={() => setMoreOpen(false)}>Close</button>
            </div>

            <nav className="mobile-more-grid">
              {mobileMore.map(([label, href]) => (
                <NavLink
                  to={href}
                  key={label}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <button className="btn full mobile-signout" onClick={signOut}>Sign out</button>
          </div>
        </div>
      )}

      <nav className="mobile-nav">
        {mobilePrimary.map(([label, href]) => (
          <NavLink end={href === "/"} to={href} key={label}>{label}</NavLink>
        ))}
        <button className={moreOpen ? "active" : ""} onClick={() => setMoreOpen(true)}>More</button>
      </nav>
    </div>
  );
}
