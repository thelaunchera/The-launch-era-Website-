"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const t = language === "en" ? {
    title: "Welcome to The Launch Era Cleaning App",
    text: "Your cleaning business, organized around the work you actually do.",
    email: "Email address",
    password: "Password",
    signin: "Sign in",
    signup: "Create account",
    buttonIn: "Sign in",
    buttonUp: "Create my account",
    forgot: "Forgot password?",
    check: "Check your email to confirm your account.",
  } : {
    title: "Bienvenido a The Launch Era Cleaning App",
    text: "Tu negocio de limpieza, organizado alrededor del trabajo que realmente haces.",
    email: "Correo electrónico",
    password: "Contraseña",
    signin: "Entrar",
    signup: "Crear cuenta",
    buttonIn: "Entrar",
    buttonUp: "Crear mi cuenta",
    forgot: "¿Olvidaste tu contraseña?",
    check: "Revisa tu correo para confirmar tu cuenta.",
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }
      router.replace(params.get("next") || "/");
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setMessage(error ? error.message : t.check);
    setBusy(false);
  }

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="brand">THE LAUNCH ERA<small>CLEANING APP</small></div>
        <span className="eyebrow">BUILT FOR CLEANING BUSINESS OWNERS</span>
        <h1>{t.title}</h1>
        <p className="subtitle">{t.text}</p>
      </section>

      <section className="auth-card">
        <div className="auth-lang">
          <button className={language==="en" ? "active" : ""} onClick={()=>setLanguage("en")}>English</button>
          <button className={language==="es" ? "active" : ""} onClick={()=>setLanguage("es")}>Español</button>
        </div>
        <div className="auth-tabs">
          <button className={mode==="signin" ? "active" : ""} onClick={()=>setMode("signin")}>{t.signin}</button>
          <button className={mode==="signup" ? "active" : ""} onClick={()=>setMode("signup")}>{t.signup}</button>
        </div>

        <form onSubmit={submit} className="form-stack">
          <label>{t.email}<input required name="email" type="email" autoComplete="email" /></label>
          <label>{t.password}<input required minLength={8} name="password" type="password" autoComplete={mode==="signin" ? "current-password" : "new-password"} /></label>
          {message && <div className="form-message">{message}</div>}
          <button className="btn primary full" disabled={busy}>{busy ? "..." : mode==="signin" ? t.buttonIn : t.buttonUp}</button>
        </form>

        <a className="text-link" href="/forgot-password">{t.forgot}</a>
      </section>
    </main>
  );
}
