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
      if (dialog) {
        event.preventDefault();
        if (location.hash !== "#contact") history.replaceState(null, "", location.pathname + location.search + "#contact");
        openDialog();
      }
    });
  });

  document.querySelectorAll("[data-contact-close]").forEach((el) => el.addEventListener("click", closeDialog));

  if (dialog) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
  }

  if (location.hash === "#contact") {
    requestAnimationFrame(openDialog);
  }

  function init(form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    let started = Date.now();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const lang = form.dataset.lang === "es" ? "es" : "en";
      const fd = new FormData(form);
      const service = String(fd.get("service_interest") || "").trim();
      const payload = {
        name: fd.get("name"),
        business_name: fd.get("business_name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        cleaning_type: "",
        help_needed: service ? [service] : [],
        booking_method: "",
        message: fd.get("message"),
        preferred_contact: fd.get("preferred_contact"),
        website: fd.get("website"),
        language: lang,
        started_at: started
      };

      if (status) {
        status.textContent = lang === "es" ? "Enviando…" : "Sending…";
        status.className = "contact-form-status is-working";
      }
      if (submit) submit.disabled = true;

      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || (lang === "es" ? "No se pudo enviar." : "Could not send."));

        form.reset();
        started = Date.now();
        if (status) {
          status.textContent = lang === "es"
            ? "Gracias. Recibimos tu mensaje."
            : "Thanks. We received your message.";
          status.className = "contact-form-status is-success";
        }
      } catch (error) {
        if (status) {
          status.textContent = error?.message || (lang === "es" ? "Inténtalo de nuevo." : "Please try again.");
          status.className = "contact-form-status is-error";
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  }

  document.querySelectorAll(".tle-contact-form").forEach(init);
})();