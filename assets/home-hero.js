(() => {
  const hero = document.querySelector('.hero-photo');
  const layer = document.querySelector('.hero-photo-layer');
  if (!hero || !layer) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 620px)');
  let pending = false;
  const render = () => {
    pending = false;
    document.documentElement.classList.toggle('is-scrolled', window.scrollY > 40);
    const rect = hero.getBoundingClientRect();
    const travel = Math.min(Math.max(-rect.top, 0), rect.height);
    layer.style.transform = reduce.matches ? '' : `translate3d(0,${Math.min(travel * (mobile.matches ? 0.035 : 0.075), mobile.matches ? 24 : 40)}px,0)`;
  };
  const schedule = () => {
    if (!pending) { pending = true; window.requestAnimationFrame(render); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reduce.addEventListener('change', schedule);
  render();
})();
