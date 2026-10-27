(() => {
  'use strict';
  const section = document.querySelector('[data-trust-stats]');
  if (!section) return;
  const cards = [...section.querySelectorAll('[data-trust-card]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const frames = new Map();
  const completed = new Set();
  const video = section.querySelector('video');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let mediaVisible = false;

  function finish(card) {
    cancelAnimationFrame(frames.get(card));
    frames.delete(card);
    const number = card.querySelector('[data-count-to]');
    number.textContent = number.dataset.countTo;
    card.classList.remove('is-counting');
    completed.add(card);
  }

  function start(card) {
    if (completed.has(card) || frames.has(card)) return;
    if (motion.matches) { finish(card); return; }
    const number = card.querySelector('[data-count-to]');
    const target = Number(number.dataset.countTo);
    const duration = 2200;
    let started;
    card.classList.add('is-counting');
    function tick(now) {
      if (started === undefined) started = now;
      const progress = Math.min((now - started) / duration, 1);
      number.textContent = String(Math.floor(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frames.set(card, requestAnimationFrame(tick));
      else finish(card);
    }
    frames.set(card, requestAnimationFrame(tick));
  }

  function syncVideo() {
    if (!video) return;
    if (!mediaVisible || document.hidden || motion.matches || saveData) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    const play = video.play();
    if (play) play.catch(() => {});
  }

  if ('IntersectionObserver' in window && !motion.matches) {
    cards.forEach(card => { card.querySelector('[data-count-to]').textContent = '0'; });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          start(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .3 });
    cards.forEach(card => observer.observe(card));
  } else cards.forEach(finish);

  if ('IntersectionObserver' in window) {
    const mediaObserver = new IntersectionObserver(entries => {
      mediaVisible = entries[0].isIntersecting;
      syncVideo();
    }, { threshold: 0 });
    mediaObserver.observe(section);
  }
  document.addEventListener('visibilitychange', syncVideo);
  motion.addEventListener('change', () => {
    if (motion.matches) cards.forEach(finish);
    syncVideo();
  });
})();
