(() => {
  'use strict';
  const root = document.querySelector('[data-work-carousel]');
  if (!root) return;
  const viewport = root.querySelector('.work-carousel__viewport');
  const cards = [...root.querySelectorAll('.work-carousel__card')];
  const links = cards.map(card => card.querySelector('a'));
  const pauseButton = root.querySelector('[data-work-pause]');
  const dialog = root.querySelector('.work-carousel__dialog');
  const large = dialog.querySelector('img');
  const caption = dialog.querySelector('[data-work-caption]');
  const count = dialog.querySelector('[data-work-count]');
  const status = root.querySelector('[data-work-status]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapable = matchMedia('(hover: hover)');
  let offset = 0, width = 0, cardWidth = 0, step = 0, total = 0;
  let frame = 0, lastTime = 0, selected = 0, returnLink = null;
  let userPaused = false, hovered = false, focused = false, visible = false;
  let pointerStart = null, suppressClickUntil = 0;
  const mod = (value, size) => ((value % size) + size) % size;

  // One set of links travels around a circular track. The wrap occurs fully
  // outside the viewport, so every visible card remains clickable and unique.
  function draw() {
    if (!total) return;
    const middle = width / 2;
    cards.forEach((card, i) => {
      const x = mod(i * step - offset + step, total) - step;
      const curve = Math.max(-1.3, Math.min(1.3, (x + cardWidth / 2 - middle) / Math.max(middle, 1)));
      const scale = reduced.matches ? 1 : 1 - Math.abs(curve) * .065;
      const y = reduced.matches ? 0 : 13 * curve * curve;
      const angle = reduced.matches ? 0 : -curve * 16;
      card.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotateY(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    });
    viewport.scrollLeft = 0;
  }
  function measure() {
    const oldStep = step;
    const nextWidth = viewport.clientWidth;
    const nextCardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(root).getPropertyValue('--card-gap'));
    // Ignore a transient hidden or unstyled layout rather than poisoning the
    // circular position with NaN during a stylesheet/viewport change.
    if (!nextWidth || !nextCardWidth || !Number.isFinite(gap)) return;
    width = nextWidth;
    cardWidth = nextCardWidth;
    step = cardWidth + gap;
    total = cards.length * step;
    if (!Number.isFinite(offset)) offset = 0;
    if (oldStep > 0 && Number.isFinite(oldStep)) offset = offset / oldStep * step;
    offset = mod(offset, total);
    draw();
    sync();
  }
  const canMove = () => total > 0 && visible && !document.hidden && !userPaused && !hovered && !focused && !dialog.open && !reduced.matches;
  function tick(time) {
    frame = 0;
    if (!canMove()) { lastTime = 0; return; }
    if (lastTime) offset = mod(offset + Math.min(time - lastTime, 50) * .03, total);
    lastTime = time;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastTime = 0;
    pauseButton.hidden = reduced.matches;
    pauseButton.textContent = userPaused ? '▶ Lejátszás' : 'Ⅱ Megállítás';
    pauseButton.setAttribute('aria-label', userPaused ? 'Képsor lejátszása' : 'Képsor megállítása');
    if (canMove()) frame = requestAnimationFrame(tick);
  }
  function center(index) {
    offset = mod(index * step - (width - cardWidth) / 2, total);
    draw();
  }
  function move(direction) {
    if (!total || !Number.isFinite(direction)) return;
    userPaused = true;
    const centered = Math.round((offset + (width - cardWidth) / 2) / step);
    const index = mod(centered + direction, cards.length);
    center(index);
    status.textContent = `${index + 1} / ${cards.length} · ${links[index].querySelector('.work-carousel__caption').textContent}`;
    sync();
  }
  function show(index) {
    selected = mod(index, links.length);
    const link = links[selected];
    large.src = link.href;
    large.alt = link.querySelector('img').alt;
    large.width = Number(link.dataset.fullWidth);
    large.height = Number(link.dataset.fullHeight);
    caption.textContent = link.querySelector('.work-carousel__caption').textContent;
    count.textContent = `${selected + 1} / ${links.length}`;
  }

  root.classList.add('is-ready');
  root.querySelector('[data-work-controls]').hidden = false;
  measure();
  new ResizeObserver(measure).observe(viewport);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, {rootMargin: '50px'}).observe(viewport);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => { draw(); sync(); });
  pauseButton.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  root.querySelectorAll('[data-work-move]').forEach(button => button.addEventListener('click', () => move(Number(button.dataset.workMove))));
  viewport.addEventListener('pointerenter', () => { if (hoverCapable.matches) { hovered = true; sync(); } });
  viewport.addEventListener('pointerleave', () => { hovered = false; sync(); });
  viewport.addEventListener('focusin', event => {
    focused = true;
    const index = links.indexOf(event.target.closest('a'));
    if (index >= 0) {
      const x = mod(index * step - offset + step, total) - step;
      if (x < 8 || x + cardWidth > width - 8) center(index);
    }
    sync();
  });
  viewport.addEventListener('focusout', () => queueMicrotask(() => { focused = viewport.contains(document.activeElement); sync(); }));
  viewport.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const index = links.indexOf(event.target.closest('a'));
    if (index >= 0) {
      const next = mod(index + (event.key === 'ArrowLeft' ? -1 : 1), links.length);
      center(next); links[next].focus({preventScroll:true});
    }
  });
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') pointerStart = {x:event.clientX,y:event.clientY};
  });
  viewport.addEventListener('pointerup', event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      move(dx < 0 ? 1 : -1);
      // A completed swipe must not also open the link beneath the finger.
      suppressClickUntil = performance.now() + 450;
    }
  });
  viewport.addEventListener('pointercancel', () => { pointerStart = null; });
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) { event.preventDefault(); return; }
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button) return;
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    returnLink = link;
    show(index);
    dialog.showModal();
    document.body.classList.add('modal-open');
    sync();
  }));
  dialog.querySelectorAll('[data-work-step]').forEach(button => button.addEventListener('click', () => show(selected + Number(button.dataset.workStep))));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); show(selected + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('close', () => {
    large.removeAttribute('src');
    if (returnLink) returnLink.focus({preventScroll:true});
    sync();
  });
  sync();
})();
