import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Reports" eyebrow="OWNER NUMBERS" title="See what the week actually did." description="Jobs, revenue, mileage and work hours — the operational numbers owners need most.">
      <div className="grid"><article className="card metric"><span className="eyebrow">Jobs</span><b>12</b><span className="meta">This week</span></article><article className="card metric"><span className="eyebrow">Revenue</span><b>$1,940</b><span className="meta">Scheduled + paid</span></article><article className="card metric"><span className="eyebrow">Miles</span><b>86.2</b><span className="meta">Business driving</span></article><article className="card metric"><span className="eyebrow">Hours</span><b>31.5</b><span className="meta">Tracked work time</span></article></div>
    </SectionPage>
  );
}
