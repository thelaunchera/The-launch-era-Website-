import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Team" eyebrow="ASSIGNMENT + HOURS" title="Know who is going where." description="Assign cleaners to jobs and track work time without adding payroll complexity.">
      <div className="card"><div className="note">This section is wired into the app foundation. CRUD and business rules will be connected next.</div></div>
    </SectionPage>
  );
}
