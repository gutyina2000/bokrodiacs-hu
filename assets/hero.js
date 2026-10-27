
(() => {
  const video = document.getElementById('hero-video');
  const toggle = document.getElementById('hero-motion');
  if (!video || !toggle) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  let userPaused = false;
  const allowed = () => !reducedMotion.matches && !connection?.saveData;
  const updateButton = () => {
    toggle.setAttribute('aria-pressed', String(video.paused));
    toggle.querySelector('[data-motion-icon]').textContent = video.paused ? '▶' : 'Ⅱ';
    toggle.querySelector('[data-motion-label]').textContent = video.paused ? 'Animáció indítása' : 'Animáció szüneteltetése';
  };
  const sync = () => {
    if (!allowed()) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.classList.remove('is-ready');
      toggle.hidden = true;
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    toggle.hidden = false;
    if (document.hidden || userPaused) video.pause();
    else video.play().catch(updateButton);
  };
  video.addEventListener('playing', () => { video.classList.add('is-ready'); updateButton(); });
  video.addEventListener('pause', updateButton);
  video.addEventListener('error', () => { video.classList.remove('is-ready'); toggle.hidden = true; });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    if (userPaused) video.pause();
    else video.play().catch(updateButton);
  });
  reducedMotion.addEventListener('change', sync);
  connection?.addEventListener?.('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
