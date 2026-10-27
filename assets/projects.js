(() => {
 'use strict';
 const root = document.querySelector('.bj-gallery');
 const projects = window.BOKRODI_PROJECTS;
 if (!root || !projects) return;
 const dialog = root.querySelector('.bj-lightbox');
 const image = root.querySelector('#bj-large-photo');
 const caption = root.querySelector('#bj-photo-caption');
 const counter = root.querySelector('#bj-photo-count');
 const albumLink = root.querySelector('#bj-album-link');
 let active, selected, phase = 'Összes';
 const items = () => projects[active].photos.filter(p => !root.dataset.album || phase === 'Összes' || p.phase === phase);
 function showPhoto(id) {
  const p = projects[active].photos.find(p => p.id === id);
  if (!p) return;
  selected = id;
  image.src = p.full;
  image.srcset = p.srcset;
  image.sizes = '(max-width:1080px) 95vw, 1040px';
  image.alt = p.alt;
  image.width = p.width;
  image.height = p.height;
  image.decoding = 'async';
  caption.textContent = root.dataset.showLocation === 'false' ? p.caption : projects[active].location + ' · ' + p.caption;
  counter.textContent = `${items().findIndex(x => x.id === id) + 1} / ${items().length} · ${p.phase}`;
  albumLink.href = projects[active].url;
  albumLink.hidden = !!root.dataset.album;
 }
 function openPhoto(key, id) {
  active = key;
  showPhoto(id);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
 }
 function step(by) {
  const photos = items();
  const index = photos.findIndex(p => p.id === selected);
  showPhoto(photos[(index + by + photos.length) % photos.length].id);
 }
 root.addEventListener('click', event => {
  const target = event.target.closest('[data-photo],[data-compare],[data-phase],[data-step]');
  if (!target || !root.contains(target)) return;
  if (target.dataset.photo) {
   if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button) return;
   event.preventDefault();
   openPhoto(target.dataset.project, target.dataset.photo);
  } else if (target.dataset.compare) {
   const done = target.dataset.compare === 'done';
   const p = projects.chapel.photos.find(p => p.id === (done ? 'c08' : 'c01'));
   const main = root.querySelector('#bj-chapel-mosaic .shot');
   main.dataset.photo = p.id;
   main.href = projects.chapel.url + '#foto-' + p.id;
   main.setAttribute('aria-label', projects.chapel.location + ' · ' + p.caption + ' – nagyítás');
   const img = main.querySelector('img');
   img.src = p.src; img.srcset = p.srcset; img.alt = p.alt; img.width = p.width; img.height = p.height;
   main.querySelector('.stamp').textContent = done ? 'Elkészült' : 'Munka közben';
   root.querySelectorAll('[data-compare]').forEach(b => b.setAttribute('aria-pressed', String(b === target)));
  } else if (target.dataset.phase) {
   phase = target.dataset.phase;
   root.querySelectorAll('[data-phase]').forEach(b => b.setAttribute('aria-pressed', String(b === target)));
   let count = 0;
   root.querySelectorAll('.tile').forEach(tile => {
    tile.hidden = phase !== 'Összes' && tile.dataset.phaseName !== phase;
    if (!tile.hidden) count++;
   });
   root.querySelector('#bj-filter-count').textContent = `${count} kép · ${phase === 'Összes' ? 'a teljes projektalbum' : phase}`;
  } else if (target.dataset.step) step(Number(target.dataset.step));
 });
 dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
   event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);
  }
 });
 dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  image.removeAttribute('src'); image.removeAttribute('srcset');
 });
 root.querySelector('.filters')?.removeAttribute('hidden');
 // Direct album links remain usable without JavaScript; hash links also open the photograph.
 const deepLink = location.hash.slice(1);
 if (root.dataset.album && deepLink.startsWith('foto-')) {
  const p = projects[root.dataset.album].photos.find(p => 'foto-' + p.id === deepLink);
  if (p) openPhoto(root.dataset.album, p.id);
 }
})();
