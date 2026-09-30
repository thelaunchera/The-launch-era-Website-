(() => {
  const ENDPOINT = "https://bowacxhmjvrqixtwaikv.supabase.co/functions/v1/tle-contact";

  function init(form) {
    const status = form.querySelector("[data-form-status]");
    const submit = form.querySelector('button[type="submit"]');
    const started = Date.now();

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const lang = form.dataset.lang === "es" ? "es" : "en";
      const fd = new FormData(form);
      const payload = {
        name: fd.get("name"),
        business_name: fd.get("business_name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        cleaning_type: fd.get("cleaning_type"),
        help_needed: fd.getAll("help_needed"),
        booking_method: fd.get("booking_method"),
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
        if (status) {
          status.textContent = lang === "es"
            ? "Gracias. Recibimos tu mensaje y ya está en nuestro sistema."
            : "Thanks. We received your message and it is now in our system.";
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