'use strict';
(() => {
  const form = document.getElementById('hero-quote-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const result = document.getElementById('hero-quote-result');
    result.textContent = 'Az űrlap előnézete elkészült. Ez bemutató: visszahívási kérést nem küldtünk el, és az adatokat nem tároltuk.';
    result.hidden = false;
    result.focus();
  });
})();
