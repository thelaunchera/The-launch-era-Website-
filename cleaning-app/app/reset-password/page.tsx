"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage(){
  const router=useRouter();
  const [message,setMessage]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=new FormData(event.currentTarget);
    const password=String(form.get("password")||"");
    const supabase=createClient();
    const {error}=await supabase.auth.updateUser({password});
    if(error){setMessage(error.message);return;}
    router.replace("/");
    router.refresh();
  }

  return <main className="center-page"><section className="auth-card narrow">
    <span className="eyebrow">ACCOUNT ACCESS</span>
    <h1>Choose a new password.</h1>
    <form onSubmit={submit} className="form-stack">
      <label>New password<input required minLength={8} name="password" type="password"/></label>
      {message && <div className="form-message">{message}</div>}
      <button className="btn primary full">Update password</button>
    </form>
  </section></main>;
}
