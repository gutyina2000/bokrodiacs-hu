import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {buildProjectFiles} from './project-builder.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFile(path.join(root,p),'utf8');
const expected={house:'Érd',chapel:'Budaörs',renovation:'Százhalombatta',eaves:'Budapest XXII. kerület',porch:'Adony',biatorbagy:'Biatorbágy',timber:'Ráckeresztúr'};
const data=JSON.parse(await read('data/project-locations.json')),base={};
for(const p of await fs.readdir(root))if(p.endsWith('.html')&&!p.startsWith('acs-')&&p!=='teruletek.html')base[p]=await read(p);
base['assets/projects-data.js']=await read('assets/projects-data.js');
const projects=JSON.parse(base['assets/projects-data.js'].replace(/^window.BOKRODI_PROJECTS\s*=\s*/,'').replace(/;\s*$/,''));
assert.deepEqual(data.projects.map(r=>[r.key,r.location]),Object.entries(expected));
let photoCount=0;
for(const [key,location] of Object.entries(expected)){
 const p=projects[key],r=data.projects.find(r=>r.key===key),html=base[p.url],area=await read(r.areaPage);
 assert.equal(p.location,location);
 assert(html.includes('<h1>'+r.title+'</h1>'));
 assert(html.includes('href="'+r.areaPage+'"'),'Album to area: '+key);
 assert(area.includes('href="'+p.url+'"'),'Area to album: '+key);
 assert(area.includes(r.summary),'Local project summary: '+key);
 assert(!area.includes('helyszíne nincs megjelölve'));
 for(const page of ['index.html','referenciak.html']){
  const article=base[page].match(/<article class="(?:feature|standard)">[\s\S]*?<\/article>/g).find(a=>a.includes('id="bj-'+key+'-mosaic"'));
  if(page==='index.html'){
   assert(!article.includes('class="project-location"'),'No home location label: '+key);
   assert.equal(article.match(/<h3>([^<]+)<\/h3>/)[1],r.title.replace(' '+r.locative,''));
   assert(article.includes('href="'+p.url+'"'),'Home album link: '+key);
  }else assert(article.includes('href="'+r.areaPage+'"')&&article.includes(r.title),'Reference mapping: '+key);
 }
 const graph=JSON.parse(html.match(/id="project-seo-data">([\s\S]*?)<\/script>/)[1])['@graph'];
 const gallery=graph.find(n=>n['@type']==='ImageGallery');
 assert.equal(gallery.contentLocation.name,location);
 assert.equal(gallery.relatedLink,'https://bokrodiacs.hu/'+r.areaPage);
 const images=graph.filter(n=>n['@type']==='ImageObject');assert.equal(images.length,p.photos.length);
 for(const photo of p.photos){
  assert(photo.alt.startsWith(location+' – '));assert(html.includes(photo.alt));
  assert(images.some(i=>i.contentUrl.endsWith(photo.full)&&i.contentLocation.name===location));
  for(const src of [photo.src,photo.full,...photo.srcset.split(',').map(x=>x.trim().split(' ')[0])])await fs.access(path.join(root,src));
  photoCount++;
 }
}
assert.equal(photoCount,55);
for(const file of (await fs.readdir(root)).filter(p=>p.endsWith('.html'))){
 const html=await read(file);
 for(const m of html.matchAll(/<meta property="og:image" content="https:\/\/bokrodiacs.hu\/([^"]+)"/g))await fs.access(path.join(root,m[1]));
 assert(!html.includes('projekt helyszíne nincs megjelölve'),file+': outdated location disclaimer');
}
for(const [file,content] of Object.entries(buildProjectFiles(base,data)))assert.equal(content,await read(file),'Idempotence: '+file);
console.log(JSON.stringify({projects:7,photos:photoCount,confirmedLocations:'all match',links:'bidirectional',socialImages:'all exist',schema:'55 correctly located images',generation:'idempotent'},null,2));
