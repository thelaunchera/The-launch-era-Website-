"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage(){
  const [message,setMessage]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=new FormData(event.currentTarget);
    const email=String(form.get("email")||"").trim();
    const supabase=createClient();
    const {error}=await supabase.auth.resetPasswordForEmail(email,{
      redirectTo:`${window.location.origin}/reset-password`,
    });
    setMessage(error ? error.message : "Check your email for the password reset link.");
  }

  return <main className="center-page"><section className="auth-card narrow">
    <span className="eyebrow">ACCOUNT ACCESS</span>
    <h1>Reset your password.</h1>
    <p className="subtitle">We’ll send a secure reset link to your email.</p>
    <form onSubmit={submit} className="form-stack">
      <label>Email address<input required name="email" type="email"/></label>
      {message && <div className="form-message">{message}</div>}
      <button className="btn primary full">Send reset link</button>
    </form>
    <a className="text-link" href="/login">← Back to sign in</a>
  </section></main>;
}
