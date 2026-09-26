import AppShell from "../components/AppShell";
import PageHeader from "../components/PageHeader";

const copy = {
  calendar: {
    eyebrow: "JOBS + AVAILABILITY",
    title: "See the workday before it starts.",
    description: "Real availability will account for job duration and travel time between stops.",
    note: "Next build: jobs, recurring visits, route order, mileage and time tracking.",
  },
  quotes: {
    eyebrow: "REQUEST → APPROVAL",
    title: "Quote first. Book after acceptance.",
    description: "Quote requests stay here until accepted.",
    note: "Acceptance will create/update the Client, add the Job to Calendar and prepare the Invoice.",
  },
  invoices: {
    eyebrow: "MONEY TO COLLECT",
    title: "Keep payment status clear.",
    description: "Track Cash on Spot, Zelle and Stripe-ready payments without turning the app into accounting software.",
    note: "Billing and payment actions will be connected after quote + job workflow QA.",
  },
  team: {
    eyebrow: "ASSIGNMENT + HOURS",
    title: "Know who is going where.",
    description: "Assign cleaners to jobs and track work time without payroll complexity.",
    note: "Team assignment and clock-in/out are already represented in the database schema.",
  },
  reports: {
    eyebrow: "OWNER NUMBERS",
    title: "See what the week actually did.",
    description: "Jobs, revenue, mileage and work hours — the operational numbers owners need most.",
    note: "Reports will read from jobs, invoices, mileage logs and time entries.",
  },
} as const;

export default function PlaceholderPage({ kind }: { kind: keyof typeof copy }) {
  const page = copy[kind];
  return (
    <AppShell>
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="card">
        <div className="note">{page.note}</div>
      </section>
    </AppShell>
  );
}
