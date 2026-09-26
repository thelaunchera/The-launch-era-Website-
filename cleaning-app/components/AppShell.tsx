import type { ReactNode } from "react";

const items = [
  ["Today","/"],["Leads","/leads"],["Clients","/clients"],["Calendar","/calendar"],
  ["Quotes","/quotes"],["Invoices","/invoices"],["Services","/services"],["Team","/team"],
  ["Reports","/reports"],["Settings","/settings"]
] as const;

export default function AppShell({active, children}:{active:string;children:ReactNode}) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">THE LAUNCH ERA<small>CLEANING APP</small></div>
        <nav className="nav">
          {items.map(([label,href])=>(
            <a className={active===label ? "active" : ""} href={href} key={label}>{label}</a>
          ))}
        </nav>
      </aside>
      <main className="main">{children}</main>
      <nav className="mobile-nav">
        {items.slice(0,5).map(([label,href])=><a href={href} key={label}>{label}</a>)}
      </nav>
    </div>
  );
}
