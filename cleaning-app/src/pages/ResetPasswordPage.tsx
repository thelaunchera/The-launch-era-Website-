import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      setBusy(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <main className="center-page">
      <section className="auth-card narrow">
        <span className="eyebrow">ACCOUNT ACCESS</span>
        <h1>Choose a new password.</h1>
        <form onSubmit={submit} className="form-stack">
          <label>New password<input required minLength={8} name="password" type="password" /></label>
          <label>Confirm password<input required minLength={8} name="confirm" type="password" /></label>
          {message && <div className="form-message">{message}</div>}
          <button className="btn primary full" disabled={busy}>{busy ? "Saving…" : "Update password"}</button>
        </form>
      </section>
    </main>
  );
}
