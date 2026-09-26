import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Calendar" eyebrow="JOBS + AVAILABILITY" title="See the workday before it starts." description="Real availability will account for job duration and travel time between stops.">
      <div className="grid"><article className="card route"><div className="section-title"><h2>Availability engine</h2><span className="badge">Travel-aware</span></div><div className="note">A slot is only bookable when the job duration + travel buffer fit without overlapping another job.</div></article><aside className="card sidecard"><div className="section-title"><h2>Recurring</h2></div><div className="quick"><button>Weekly</button><button>Every 2 weeks</button><button>Monthly</button></div></aside></div>
    </SectionPage>
  );
}
