(() => {
'use strict';
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const directory = document.querySelector('[data-area-directory]');
if(directory){
 const search=directory.querySelector('#area-search');
 const items=[...directory.querySelectorAll('[data-area-item]')];
 const groups=[...directory.querySelectorAll('[data-district-group]')];
 const filter=()=>{
  const query=norm(search.value);let count=0;
  items.forEach(item=>{item.hidden=!norm(item.dataset.areaSearch).includes(query);if(!item.hidden)count++;});
  groups.forEach(group=>group.hidden=![...group.querySelectorAll('[data-area-item]')].some(x=>!x.hidden));
  directory.querySelector('[data-area-count]').textContent=count+' / '+items.length+' település';
  directory.querySelector('[data-area-empty]').hidden=count>0;
 };
 search.addEventListener('input',filter);
 directory.querySelector('[data-clear-area]').addEventListener('click',()=>{search.value='';filter();search.focus();});
 filter();
}
const list=document.querySelector('#town-list');
if(list){
 const search=document.querySelector('#town-search');
 const items=[...list.querySelectorAll('[data-town]')];
 const names={fejer:'Fejér vármegye',pest:'Pest vármegye',budapest:'Budapest'};
 let region='';
 const filter=()=>{
  const query=norm(search.value);let count=0;
  items.forEach(a=>{a.hidden=!!((region&&a.dataset.townRegion!==region)||!norm(a.dataset.town).includes(query));if(!a.hidden)count++;});
  document.querySelector('#town-empty').hidden=count>0;
  document.querySelector('#town-count').textContent=count+' helyszín';
 };
 const choose=id=>{
  region=id;
  document.querySelectorAll('[data-region]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.region===id)));
  document.querySelector('#area-title').textContent=names[id]||'Hol valósulna meg az elképzelése?';
  document.querySelector('#area-description').textContent=id==='budapest'?'Budapesti munkánál a kerületet és a pontos helyszínt is egyeztetjük.':'Nyissa meg a település saját oldalát. A kiszállás és a vállalási időpont egyeztetéshez kötött.';
  const link=document.querySelector('#area-quote');
  link.href=id==='budapest'?'acs-budapest-22-kerulet.html':id?'acs-'+id+'-megye.html':'teruletek.html';
  link.textContent=id==='budapest'?'Budapest XXII. kerületi referencia ↗':id?names[id]+' összes települése ↗':'Összes megye és település ↗';
  list.scrollTop=0;filter();
 };
 document.querySelectorAll('[data-region]').forEach(b=>{
  b.addEventListener('click',()=>choose(b.dataset.region));
  if(b.tagName.toLowerCase()==='path')b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose(b.dataset.region);}});
 });
 search.addEventListener('input',filter);
 document.querySelector('#map-reset').addEventListener('click',()=>{search.value='';choose('');});
 filter();
}
})();
