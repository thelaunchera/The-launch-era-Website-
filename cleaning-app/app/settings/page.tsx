import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Settings" eyebrow="BUSINESS RULES" title="Make the app fit the business." description="Profile, service area, availability, travel buffer, language and contact preferences live here.">
      <div className="card"><div className="note">This section is wired into the app foundation. CRUD and business rules will be connected next.</div></div>
    </SectionPage>
  );
}
