# The Launch Era Cleaning App

Private rebuild/migration project for residential cleaning business owners.

## Product goal

Keep the daily business workflow simple:

**Lead → Quote → Booking → Client → Job → Invoice**

The app is being rebuilt in parallel with the existing Sites version. The current live app must remain untouched until migration QA is complete.

## Owner-first features

- Today dashboard
- Today's Route
- Mileage tracking
- Travel-time blocking
- Leads
- Clients
- Quotes
- Calendar / Jobs
- Invoices
- Services + Add-ons
- Team assignments
- Time tracking
- Recurring jobs
- Reports
- English / Spanish

## Not in the first build

- Live GPS tracking
- Full bookkeeping/accounting
- Payroll/HR
- Heavy inventory
- Enterprise CRM complexity

## Planned stack

- Source control: GitHub
- App: Next.js + TypeScript
- Database/Auth: Supabase/Postgres
- Email: Resend
- Billing: Stripe later
- Hosting: to be chosen after the migration build is stable

## Billing model to preserve

One plan. First 30 days free without a card, then $5.99/month.

## Migration rule

Never switch production traffic until existing users/data, login, booking, quotes, invoices, email flows, billing state, and tenant isolation have passed QA.
