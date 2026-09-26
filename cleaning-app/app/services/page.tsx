import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Services" eyebrow="SERVICES + ADD-ONS" title="Set the work once." description="Define pricing type, duration and add-ons so quotes and bookings use the same service information.">
      <div className="card"><div className="note">This section is wired into the app foundation. CRUD and business rules will be connected next.</div></div>
    </SectionPage>
  );
}
