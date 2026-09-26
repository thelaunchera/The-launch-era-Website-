import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";

export default function SectionPage({
  active,
  eyebrow,
  title,
  description,
  children,
}:{
  active:string;
  eyebrow:string;
  title:string;
  description:string;
  children?:ReactNode;
}) {
  return (
    <AppShell active={active}>
      <div className="topbar">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="subtitle">{description}</p>
        </div>
        <div className="actions"><button className="btn">Español</button><button className="btn primary">+ New</button></div>
      </div>
      {children ?? <div className="card"><div className="note">This module is part of the migration build. We are connecting working data and actions one section at a time.</div></div>}
    </AppShell>
  );
}
