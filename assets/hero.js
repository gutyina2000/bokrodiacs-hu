(() => {
  const video = document.getElementById('hero-video');
  if (!video) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const allowed = () => !reducedMotion.matches && !connection?.saveData;
  const sync = () => {
    if (!allowed()) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.classList.remove('is-ready');
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    if (document.hidden) video.pause();
    else video.play().catch(() => video.classList.remove('is-ready'));
  };
  video.addEventListener('playing', () => video.classList.add('is-ready'));
  video.addEventListener('error', () => video.classList.remove('is-ready'));
  reducedMotion.addEventListener('change', sync);
  connection?.addEventListener?.('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
