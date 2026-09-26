import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Clients" eyebrow="CLIENT HISTORY" title="Know who you clean for." description="Contact details, addresses, preferences, service notes and job history in one record.">
      <div className="card"><div className="note">This section is wired into the app foundation. CRUD and business rules will be connected next.</div></div>
    </SectionPage>
  );
}
