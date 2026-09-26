import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Quotes" eyebrow="REQUEST → APPROVAL" title="Quote first. Book after acceptance." description="Quote requests stay here until accepted. Acceptance creates the client, job and draft invoice.">
      <div className="card"><div className="note">This section is wired into the app foundation. CRUD and business rules will be connected next.</div></div>
    </SectionPage>
  );
}
