import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Leads" eyebrow="INQUIRIES → NEXT STEP" title="Keep every inquiry moving." description="New, contacted, qualified, quoted, booked or lost — without hunting through DMs.">
      <div className="grid"><article className="card metric"><span className="eyebrow">New</span><b>2</b><span className="meta">Need reply</span></article><article className="card metric"><span className="eyebrow">Qualified</span><b>1</b><span className="meta">Ready for quote</span></article><article className="card route"><div className="section-title"><h2>Lead pipeline</h2><span className="badge">Simple statuses</span></div><div className="note">New → Contacted → Qualified → Quoted → Booked. Lost stays visible for reporting instead of disappearing.</div></article></div>
    </SectionPage>
  );
}
