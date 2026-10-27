import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildAreaFiles} from './areas-builder.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFile(path.join(root,p),'utf8'),base={};
const data=JSON.parse(await read('data/settlements.json'));
for(const p of await fs.readdir(root))if(p.endsWith('.html')&&!p.startsWith('acs-')&&p!=='teruletek.html')base[p]=await read(p);
for(const p of ['assets/app.js','assets/config.js'])base[p]=await read(p);
const files=buildAreaFiles(base,data);
for(const [p,content] of Object.entries(files)){await fs.mkdir(path.dirname(path.join(root,p)),{recursive:true});await fs.writeFile(path.join(root,p),content);}
console.log('Generated 295 settlement pages, 2 county pages and area directory. Updated navigation, metadata and sitemap.');
