export default function BackendSetupNotice() {
  return (
    <div className="card setup-card">
      <span className="eyebrow">BACKEND CONNECTION</span>
      <h2>App foundation is ready. Database connection is next.</h2>
      <p className="subtitle">
        GitHub now contains the working auth and CRUD logic. Add the Supabase URL and anon key to the deployment environment, then run the included database migration.
      </p>
      <div className="note">
        The current Sites app remains untouched. Do not import production customers until tenant isolation and migration QA pass.
      </div>
    </div>
  );
}
