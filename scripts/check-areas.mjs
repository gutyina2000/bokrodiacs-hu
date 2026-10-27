import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {buildAreaFiles} from './areas-builder.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFile(path.join(root,p),'utf8');
const data=JSON.parse(await read('data/settlements.json'));
const names=await fs.readdir(root),pages=names.filter(p=>p.endsWith('.html'));
const html=Object.fromEntries(await Promise.all(pages.map(async p=>[p,await read(p)])));
const errors=[],titles=new Set(),descriptions=new Set();
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"');
for(const [p,s] of Object.entries(html)){
 if((s.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(p+': h1');
 const ids=[...s.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)errors.push(p+': duplicate ids');
 const canon=[...s.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
 if(canon.length!==1||canon[0][1]!=='https://bokrodiacs.hu/'+(p==='index.html'?'':p))errors.push(p+': canonical');
 if(/noindex|nofollow|noarchive/.test(s))errors.push(p+': blocked');
 for(const m of s.matchAll(/(?:href|src)="([^"]+)"/g)){
  const url=decode(m[1]);if(/^(?:https?:|tel:|mailto:|data:|\/\/)/.test(url))continue;
  const [resource,fragment]=url.split('#'),target=decodeURIComponent(resource.split('?')[0])||p;
  try{await fs.access(path.join(root,target));}catch{errors.push(p+': missing '+target);continue;}
  if(fragment&&target.endsWith('.html')&&html[target]&&!html[target].includes('id="'+fragment+'"'))errors.push(p+': missing anchor '+url);
 }
 for(const m of s.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)){
  try{const graph=JSON.parse(m[1])['@graph'];assert(graph.some(x=>x['@type']==='BreadcrumbList'));}catch(e){errors.push(p+': schema '+e.message);}
 }
 if(p.startsWith('acs-')){
  const title=s.match(/<title>([^<]+)<\/title>/)[1],desc=s.match(/<meta name="description" content="([^"]+)"/)[1];
  if(titles.has(title)||descriptions.has(desc))errors.push(p+': duplicate SEO metadata');
  titles.add(title);descriptions.add(desc);
  if(!s.includes('tel:+36208044133'))errors.push(p+': phone');
 }
}
assert.equal(data.towns.length,295);
assert.equal(data.towns.filter(t=>t.county==='fejer').length,108);
assert.equal(data.towns.filter(t=>t.county==='pest').length,187);
assert.equal(pages.filter(p=>p.startsWith('acs-')&&!p.includes('-megye.')&&p!=='acs-budapest-22-kerulet.html').length,295);
for(const t of data.towns){
 const file='acs-'+t.slug+'.html';
 assert(html[file]?.includes(t.name),'Missing '+t.name);
 assert(html['acs-'+t.county+'-megye.html'].includes('href="'+file+'"'),'Missing county link '+t.name);
 assert(html['index.html'].includes('href="'+file+'"'),'Missing home link '+t.name);
 const service=JSON.parse(html[file].match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'].find(x=>x['@type']==='Service');
 assert.equal(service.areaServed.name,t.name);
 assert.equal(service.provider['@id'],'https://bokrodiacs.hu/#business');
}
const sitemap=await read('sitemap.xml'),locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locs.length,pages.length);assert.equal(new Set(locs).size,locs.length);
for(const p of pages)assert(locs.includes('https://bokrodiacs.hu/'+(p==='index.html'?'':p)));
assert(!(await read('robots.txt')).includes('Disallow: /'));
assert(html['acs-gardony.html'].includes('Agárd'));
assert(!html['acs-agard.html']);
const base={};
for(const p of pages.filter(p=>!p.startsWith('acs-')&&p!=='teruletek.html'))base[p]=html[p];
for(const p of ['assets/app.js','assets/config.js','assets/projects-data.js','data/project-locations.json'])base[p]=await read(p);
const rebuilt=buildAreaFiles(base,data);
for(const [p,s] of Object.entries(rebuilt))if(await read(p)!==s)errors.push('Not deterministic/idempotent: '+p);
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exit(1);}
console.log(JSON.stringify({pages:pages.length,settlements:295,counties:2,directory:1,sitemap:locs.length,links:'all local targets and fragments valid',metadata:'unique titles/descriptions, matching canonicals',schema:'valid',generation:'idempotent'},null,2));
