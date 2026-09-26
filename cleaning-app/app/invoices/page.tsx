import SectionPage from "@/components/SectionPage";

export default function Page(){
  return (
    <SectionPage active="Invoices" eyebrow="MONEY TO COLLECT" title="Keep payment status clear." description="Track Cash on Spot, Zelle and Stripe-ready payments without turning the app into accounting software.">
      <div className="card"><div className="note">This section is wired into the app foundation. CRUD and business rules will be connected next.</div></div>
    </SectionPage>
  );
}
