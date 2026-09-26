import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { appBaseUrl, supabase } from "../lib/supabase";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: appBaseUrl,
    });

    setMessage(error ? error.message : "Check your email for the password reset link.");
    setBusy(false);
  }

  return (
    <main className="center-page">
      <section className="auth-card narrow">
        <span className="eyebrow">ACCOUNT ACCESS</span>
        <h1>Reset your password.</h1>
        <p className="subtitle">We’ll send a secure link to your email.</p>
        <form onSubmit={submit} className="form-stack">
          <label>Email address<input required name="email" type="email" /></label>
          {message && <div className="form-message">{message}</div>}
          <button className="btn primary full" disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
        </form>
        <button className="link-button" onClick={() => navigate("/login")}>← Back to sign in</button>
      </section>
    </main>
  );
}
