'use strict';
(() => {
  const form = document.getElementById('hero-quote-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = document.getElementById('hero-quote-result');
    result.textContent = 'Az online ajánlatkérés jelenleg nem elérhető. A visszahívási kérést nem küldtük el.';
    result.hidden = false;
    result.focus();
  });
})();
