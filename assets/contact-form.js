(() => {
  const ENDPOINT = "https://bowacxhmjvrqixtwaikv.supabase.co/functions/v1/tle-contact";
  const dialog = document.getElementById("contact-dialog");

  function openDialog() {
    if (!dialog) return;
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
    document.documentElement.classList.add("contact-modal-open");
  }
  function closeDialog() {
    if (!dialog) return;
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove("contact-modal-open");
    if (location.hash === "#contact") history.replaceState(null, "", location.pathname + location.search);
  }
  document.querySelectorAll("[data-contact-open], a[href='#contact']").forEach((el) => {
    el.addEventListener("click", (event) => {
      if (!dialog) return;
      event.preventDefault();
      if (location.hash !== "#contact") history.replaceState(null, "", location.pathname + location.search + "#contact");
      openDialog();
    });
  });
  document.querySelectorAll("[data-contact-close]").forEach((el) => el.addEventListener("click", closeDialog));
  if (dialog) {
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener("cancel", (event) => { event.preventDefault(); closeDialog(); });
  }
  if (location.hash === "#contact") requestAnimationFrame(openDialog);

  function initQuiz(form) {
    const steps=[...form.querySelectorAll("[data-quiz-step]")];
    if (!steps.length) return;
    const bar=form.querySelector("[data-quiz-bar]");
    const label=form.querySelector("[data-quiz-step-label]");
    const thankYou=form.querySelector("[data-quiz-thankyou]");
    let current=0;
    let autoTimer=null;
    const lang=form.dataset.lang==="es"?"es":"en";

    function show(index, smooth=true) {
      current=Math.max(0,Math.min(index,steps.length-1));
      steps.forEach((step,i)=>{
        step.hidden=i!==current;
        step.classList.toggle("is-active",i===current);
      });
      if(bar) bar.style.width=((current+1)/steps.length*100)+"%";
      if(label) label.textContent=lang==="es"
        ? `Pregunta ${current+1} de ${steps.length}`
        : `Question ${current+1} of ${steps.length}`;
      form.querySelectorAll("[data-quiz-map-step]").forEach((item,i)=>{
        item.classList.toggle("is-current",i===current);
        item.classList.toggle("is-done",i<current);
      });
      if(smooth) form.scrollIntoView({behavior:"smooth",block:"center"});
    }

    form.querySelectorAll("[data-quiz-auto] input[type='radio']").forEach((radio)=>{
      radio.addEventListener("change",()=>{
        if(autoTimer) clearTimeout(autoTimer);
        autoTimer=setTimeout(()=>show(current+1),260);
      });
    });

    form.querySelectorAll("[data-quiz-multi]").forEach((group)=>{
      const boxes=[...group.querySelectorAll('input[type="checkbox"]')];
      const max=Number(group.dataset.max||3);
      const step=group.closest("[data-quiz-step]");
      const countEl=step?.querySelector("[data-quiz-multi-count]");
      const nextBtn=step?.querySelector("[data-quiz-multi-next]");

      function updateMulti(){
        const selected=boxes.filter(box=>box.checked);
        boxes.forEach(box=>{ box.disabled=!box.checked && selected.length>=max; });
        if(countEl) countEl.textContent=lang==="es"
          ? `${selected.length} de ${max} marcadas`
          : `${selected.length} of ${max} selected`;
        if(nextBtn) nextBtn.disabled=selected.length===0;
      }

      boxes.forEach(box=>box.addEventListener("change",updateMulti));
      if(nextBtn) nextBtn.addEventListener("click",()=>{
        const selected=boxes.filter(box=>box.checked);
        if(!selected.length) return;
        show(current+1);
      });
      updateMulti();
    });

    form.querySelectorAll("[data-quiz-back]").forEach((btn)=>btn.addEventListener("click",()=>{
      if(autoTimer) clearTimeout(autoTimer);
      show(current-1);
    }));

    form.querySelectorAll("[data-quiz-reveal-contact] input[type='radio']").forEach((radio)=>{
      radio.addEventListener("change",()=>{
        const details=form.querySelector("[data-quiz-contact-details]");
        const checkout=form.querySelector("[data-quiz-ready-checkout]");
        const ready=/Ready to get my Booking Page|Quiero mi Página de Reservas/i.test(String(radio.value||""));

        if(checkout){
          checkout.hidden=!ready;
          checkout.classList.toggle("is-visible",ready);
        }
        if(details){
          details.hidden=ready;
          details.classList.toggle("is-visible",!ready);
        }

        const target=ready?checkout:details;
        if(target) setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"nearest"}),80);
      });
    });

    form._showQuizThankYou=(name,emailSent)=>{
      form.querySelectorAll("[data-quiz-step],[data-quiz-progress]").forEach(el=>el.hidden=true);
      if(!thankYou) return;
      const firstName=String(name||"").trim().split(/\s+/)[0];
      const nameEl=thankYou.querySelector("[data-thankyou-name]");
      if(nameEl && firstName) nameEl.textContent=firstName;
      const emailNote=thankYou.querySelector("[data-thankyou-email]");
      if(emailNote && !emailSent) emailNote.hidden=true;
      thankYou.hidden=false;
      thankYou.scrollIntoView({behavior:"smooth",block:"center"});
    };

    show(0,false);
  }

  function resolveSource(form,lang) {
    if(form.dataset.source) return form.dataset.source;
    const requested=String(new URLSearchParams(location.search).get("source")||"").toLowerCase();
    const path=(()=>{try{return new URL(document.referrer).pathname.toLowerCase();}catch{return "";}})();
    const suffix=lang==="es"?"_es":"";
    if(requested==="app" || path.includes("/cleaning-app/") && document.referrer.includes("app.thelaunchera.com")) return "app_contact"+suffix;
    if(requested==="booking-page" || path.includes("/booking-page/")) return "booking_page_contact"+suffix;
    if(requested==="cleaning-app" || path.includes("/cleaning-app/")) return "cleaning_app_landing_contact"+suffix;
    if(requested==="audit" || path.includes("/audit/")) return "audit_contact";
    if(requested==="content" || path.includes("/content/")) return "content_contact";
    if(requested==="automation" || path.includes("/automation/")) return "automation_contact";
    if(requested==="virtual-assistant" || path.includes("/virtual-assistant/")) return "virtual_assistant_contact";
    return form.closest("#contact-dialog")
      ? (lang==="es"?"contact_modal_es":"contact_modal")
      : (lang==="es"?"main_website_es":"main_website");
  }

  function init(form) {
    initQuiz(form);
    const status=form.querySelector("[data-form-status]");
    const submit=form.querySelector('button[type="submit"]');
    let started=Date.now();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const lang=form.dataset.lang==="es"?"es":"en";
      const fd=new FormData(form);
      const service=String(fd.get("service_interest")||"").trim();
      const help=[...fd.getAll("help_needed").map(String).filter(Boolean)];
      const goal=String(fd.get("desired_outcome")||"").trim();
      const nextAction=String(fd.get("next_action")||"").trim();
      if(goal) help.push("Goal: "+goal);
      if(nextAction) help.push("Next: "+nextAction);
      if(service) help.push(service);

      const source=resolveSource(form,lang);

      const payload={
        name:fd.get("name"),
        business_name:fd.get("business_name"),
        email:fd.get("email"),
        phone:fd.get("phone"),
        cleaning_type:"",
        help_needed:[...new Set(help)],
        booking_method:fd.get("booking_method")||"",
        message:fd.get("message"),
        preferred_contact:fd.get("preferred_contact"),
        website:fd.get("website"),
        language:lang,
        source,
        started_at:started
      };

      if(status){
        status.textContent=lang==="es"?"Enviando…":"Sending…";
        status.className="contact-form-status is-working";
      }
      if(submit) submit.disabled=true;

      try{
        const response=await fetch(ENDPOINT,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(payload)
        });
        const data=await response.json().catch(()=>({}));
        if(!response.ok) throw new Error(data.error||(lang==="es"?"No se pudo enviar.":"Could not send."));

        const submittedName=String(fd.get("name")||"");
        form.reset();
        started=Date.now();

        if(form.classList.contains("tle-lead-quiz") && typeof form._showQuizThankYou==="function"){
          form._showQuizThankYou(submittedName,Boolean(data.email_sent));
          if(status){status.textContent="";status.className="contact-form-status";}
        }else if(status){
          status.textContent=lang==="es"?"Gracias. Recibimos tu mensaje.":"Thanks. We received your message.";
          status.className="contact-form-status is-success";
        }
      }catch(error){
        if(status){
          status.textContent=error?.message||(lang==="es"?"Inténtalo de nuevo.":"Please try again.");
          status.className="contact-form-status is-error";
        }
      }finally{
        if(submit) submit.disabled=false;
      }
    });
  }

  document.querySelectorAll(".tle-contact-form").forEach(init);
})();