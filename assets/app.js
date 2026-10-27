'use strict';
document.documentElement.classList.add('js-enabled');
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const config=window.BOKRODI_CONFIG||{};
const menu=$('.menu-toggle'), nav=$('#main-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menü bezárása':'Menü megnyitása');nav.classList.toggle('open',open);menu.textContent=open?'×':'☰';});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){menu.click();menu.focus();}});
nav?.addEventListener('click',e=>{if(e.target.closest('a')&&nav.classList.contains('open'))menu.click();});
window.matchMedia('(min-width:761px)').addEventListener('change',()=>{if(nav?.classList.contains('open'))menu.click();});
$$('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));$('.close-dialog',dialog)?.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
function openDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
$$('[data-dialog]').forEach(b=>b.addEventListener('click',()=>openDialog(document.getElementById(b.dataset.dialog))));
const galleryData={
 'home-gallery-roof':{title:'Látszó gerendás tetőtér — látványterv',copy:'Természetes fa tetőtér hangulatképe. Ez AI-illusztráció, nem Bokrodi János referenciája.'},
 'home-gallery-terrace':{title:'Fedett terasz — látványterv',copy:'Modern fa teraszfedés hangulatképe. A végleges oldalon itt a saját munka helyszíne, műszaki tartalma és története jelenhet meg.'},
 'reference-roof':{title:'Kontyolt tetőszerkezet — látványterv',copy:'Új fa tetőszerkezet képi bemutatója. Ez AI-illusztráció, nem Bokrodi János elvégzett munkája.'},
 'reference-pergola':{title:'Kerti pavilon — látványterv',copy:'Fedett kerti faszerkezet hangulatképe. A saját munkafotók ugyanezzel a nagyítható megjelenéssel kerülhetnek fel.'}
};
$$('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{const key=b.dataset.gallery;const data=galleryData[key];$('#gallery-image').src=`assets/${key}.webp`;$('#gallery-image').alt=data.title+' – AI-illusztráció';$('#gallery-title').textContent=data.title;$('#gallery-copy').textContent=data.copy;openDialog($('#gallery-dialog'));}));
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('[data-category]').forEach(card=>card.hidden=b.dataset.filter!=='all'&&b.dataset.filter!==card.dataset.category);}));
const reviewTabs=$$('[data-review]');
function chooseReview(b){reviewTabs.forEach(x=>{x.setAttribute('aria-selected',String(x===b));x.tabIndex=x===b?0:-1;});$('#review-content').setAttribute('aria-labelledby',b.id);const google=b.dataset.review==='google';$('#review-description').textContent=google?'Itt jelennek majd meg Bokrodi János Google Cégprofiljához tartozó, ellenőrzött ügyfélértékelések.':'Itt kapnak helyet Bokrodi János Facebook-oldalának ajánlásai és az oldalra vezető hivatkozás. A profil csatlakoztatása még hátravan.';const url=google?config.googleProfileUrl:config.facebookPageUrl;const link=$('#review-link');link.hidden=!(typeof url==='string'&&/^https:\/\//.test(url));if(!link.hidden)link.href=url;}
reviewTabs.forEach(b=>{b.addEventListener('click',()=>chooseReview(b));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();let next=e.key==='Home'?reviewTabs[0]:e.key==='End'?reviewTabs.at(-1):reviewTabs[(reviewTabs.indexOf(b)+1)%reviewTabs.length];chooseReview(next);next.focus();}});});
if(reviewTabs.length)chooseReview(reviewTabs[0]);
const names={fejer:'Fejér vármegye',pest:'Pest vármegye',budapest:'Budapest'};
// Area search and map controls: assets/areas.js.
const legacyAnchors={tetoszerkezet:'acsmunkak',felujitas:'acsmunkak',pergola:'kerti-kiulok',egyedi:'acsmunkak'};
const legacyTarget=legacyAnchors[location.hash.slice(1)];
if(legacyTarget&&document.getElementById(legacyTarget)){history.replaceState(null,'','#'+legacyTarget);document.getElementById(legacyTarget).scrollIntoView();}
const form=$('#quote-form');
if(form){const params=new URLSearchParams(location.search);const serviceNames={"tetofedes": "Tetőfedés", "acsmunkak": "Minden ácsmunka", "kerti-kiulok": "Kerti kiülők készítése", "kocsibeallok": "Kocsibeálló készítése", "tetoszerkezet": "Minden ácsmunka", "felujitas": "Minden ácsmunka", "pergola": "Kerti kiülők készítése", "egyedi": "Minden ácsmunka"};const requestedService=serviceNames[params.get('szolgaltatas')];if(requestedService){const option=[...form.elements.service.options].find(x=>x.text.trim()===requestedService);if(option)form.elements.service.value=option.value;}if(names[params.get('terulet')])form.elements.region.value=params.get('terulet');if(params.get('telepules'))form.elements.town.value=params.get('telepules').slice(0,100);form.addEventListener('submit',e=>{e.preventDefault();const result=$('#form-result');result.textContent='Az online ajánlatkérés jelenleg nem elérhető. Az üzenetet nem küldtük el.';result.hidden=false;result.focus();});}
