import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { appBaseUrl, supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session) return <Navigate to="/" replace />;

  const t = language === "en" ? {
    title: "Your cleaning business, organized.",
    text: "Jobs, clients, quotes, routes and the daily details that usually live everywhere else.",
    signin: "Sign in",
    signup: "Create account",
    email: "Email address",
    password: "Password",
    forgot: "Forgot password?",
    confirm: "Check your email to confirm your account, then come back here.",
  } : {
    title: "Tu negocio de limpieza, organizado.",
    text: "Trabajos, clientes, cotizaciones, rutas y los detalles del día a día en un solo lugar.",
    signin: "Entrar",
    signup: "Crear cuenta",
    email: "Correo electrónico",
    password: "Contraseña",
    forgot: "¿Olvidaste tu contraseña?",
    confirm: "Revisa tu correo para confirmar tu cuenta y luego regresa aquí.",
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }
      navigate("/", { replace: true });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: appBaseUrl,
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (data.session) {
      navigate("/", { replace: true });
    } else {
      setMessage(t.confirm);
    }
    setBusy(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand">THE LAUNCH ERA<small>CLEANING APP</small></div>
        <span className="eyebrow">BUILT FOR CLEANING BUSINESS OWNERS</span>
        <h1>{t.title}</h1>
        <p className="subtitle">{t.text}</p>
        <div className="auth-feature-row">
          <span>Route</span><span>Mileage</span><span>Quotes</span><span>Jobs</span>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-lang">
          <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button>
          <button className={language === "es" ? "active" : ""} onClick={() => setLanguage("es")}>Español</button>
        </div>
        <div className="auth-tabs">
          <button className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>{t.signin}</button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>{t.signup}</button>
        </div>

        <form onSubmit={submit} className="form-stack">
          <label>{t.email}<input required name="email" type="email" autoComplete="email" /></label>
          <label>{t.password}<input required minLength={8} name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} /></label>
          {message && <div className="form-message">{message}</div>}
          <button className="btn primary full" disabled={busy}>{busy ? "Working…" : mode === "signin" ? t.signin : t.signup}</button>
        </form>

        <button className="link-button" onClick={() => navigate("/forgot-password")}>{t.forgot}</button>
      </section>
    </main>
  );
}
