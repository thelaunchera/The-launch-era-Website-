(() => {
  const lang = document.documentElement.lang;
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested && ['en', 'es'].includes(requested) && requested !== lang) {
    const target = document.querySelector(`link[rel="alternate"][hreflang="${requested}"]`);
    if (target) {
      const url = new URL(target.href);
      url.hash = location.hash;
      location.replace(url.href);
      return;
    }
  }

  try { localStorage.setItem('tle_app_lang', lang); } catch {}

  const switchGallery = (button) => {
    document.querySelectorAll('[data-gallery-tab]').forEach(tab => {
      tab.setAttribute('aria-pressed', String(tab === button));
    });
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

  if (!reduceMotion && (isBooking || isApp)) {
    const selector = isBooking
      ? '.section-head,.split,.connection,.offer-card,.faq,.benefit-strip,#included .step,#support .step'
      : '.section-head,.split,.connection,.offer-card,.product-gallery,.faq,.benefit-strip,#how .step';

    const targets = [...document.querySelectorAll(selector)];
    const revealClass = isBooking ? 'booking-reveal' : 'app-reveal';
    targets.forEach(el => el.classList.add(revealClass));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });

      targets.forEach(el => observer.observe(el));
    } else {
      targets.forEach(el => el.classList.add('is-visible'));
    }
  }
})();