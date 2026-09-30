(() => {
  const lang = document.documentElement.lang;
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested && ['en', 'es'].includes(requested) && requested !== lang) {
    const target = document.querySelector(`link[rel="alternate"][hreflang="${requested}"]`);
    if (target) { const url = new URL(target.href); url.hash = location.hash; location.replace(url.href); return; }
  }
  try { localStorage.setItem('tle_app_lang', lang); } catch {}
  document.querySelectorAll('[data-gallery-tab]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-tab]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
      document.querySelectorAll('[data-gallery-panel]').forEach(panel => { panel.hidden = panel.dataset.galleryPanel !== button.dataset.galleryTab; });
    });
  });
})();
