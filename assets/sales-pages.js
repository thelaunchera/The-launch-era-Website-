(() => {
  const lang = document.documentElement.lang;
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested && ['en', 'es'].includes(requested) && requested !== lang) {
    const target = document.querySelector(`link[rel="alternate"][hreflang="${requested}"]`);
    if (target) { const url = new URL(target.href); url.hash = location.hash; location.replace(url.href); return; }
  }
  try { localStorage.setItem('tle_app_lang', lang); } catch {}

  const switchGallery = (button) => {
    document.querySelectorAll('[data-gallery-tab]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    document.querySelectorAll('[data-gallery-panel]').forEach(panel => {
      panel.hidden = panel.dataset.galleryPanel !== button.dataset.galleryTab;
    });
  };
  document.querySelectorAll('[data-gallery-tab]').forEach(button => {
    button.addEventListener('click', () => switchGallery(button));
  });

  const body = document.body;
  const isBooking = body.classList.contains('booking');
  const isApp = body.classList.contains('app');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ((isBooking || isApp) && !reduceMotion) {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && !heroVisual.querySelector('.hero-motion')) {
      const copy = lang === 'es'
        ? (isBooking
          ? [
              ['Servicio elegido','El cliente ya sabe qué reservar'],
              ['Horario seleccionado','Disponibilidad clara antes de enviar'],
              ['Solicitud recibida','Los detalles llegan organizados']
            ]
          : [
              ['Nueva reserva','La solicitud entra mientras trabajas'],
              ['Trabajo programado','El calendario mantiene el próximo paso'],
              ['Factura lista','Los registros siguen conectados']
            ])
        : (isBooking
          ? [
              ['Service selected','The client knows what to book'],
              ['Time selected','Availability is clear before sending'],
              ['Request received','The details arrive organized']
            ]
          : [
              ['New booking','The request arrives while you work'],
              ['Job scheduled','The calendar keeps the next step visible'],
              ['Invoice ready','The records stay connected']
            ]);
      const stack = document.createElement('div');
      stack.className = 'hero-motion';
      stack.setAttribute('aria-hidden','true');
      copy.forEach(([title,subtitle]) => {
        const card = document.createElement('div');
        card.className = 'motion-card';
        card.innerHTML = `<span>${title}<small>${subtitle}</small></span>`;
        stack.appendChild(card);
      });
      heroVisual.appendChild(stack);
    }

    const revealTargets = [
      ...document.querySelectorAll('.section-head,.split,.connection,.offer-card,.product-gallery,.demo-frame,.faq,.benefit-strip')
    ];
    document.querySelectorAll('.steps').forEach(group => {
      group.querySelectorAll('.step').forEach((step,index) => {
        step.style.setProperty('--motion-delay', `${Math.min(index,5) * 85}ms`);
        revealTargets.push(step);
      });
    });
    revealTargets.forEach(el => el.classList.add('motion-reveal'));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {threshold:.12,rootMargin:'0px 0px -7% 0px'});
      revealTargets.forEach(el => observer.observe(el));
    } else {
      revealTargets.forEach(el => el.classList.add('is-visible'));
    }
  }
})();