import {buildAdditionalProjects} from './additional-projects.mjs';
export function buildProjectFiles(base,locations){
const out={},origin='https://bokrodiacs.hu';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const projects=JSON.parse(base['assets/projects-data.js'].replace(/^window.BOKRODI_PROJECTS\s*=\s*/,'').replace(/;\s*$/,''));
const refs=locations.projects;
if(refs.length!==7||new Set(refs.map(x=>x.key)).size!==7)throw Error('Seven unique project locations required');
const photoAlt=new Map();
for(const r of refs){
 const p=projects[r.key];if(!p)throw Error('Unknown project '+r.key);
 p.title=r.title;p.location=r.location;p.areaPage=r.areaPage;p.description=r.description;
 for(const photo of p.photos){
  photo.sceneAlt??=photo.alt;photo.alt=r.location+' – '+photo.sceneAlt;
  photoAlt.set(photo.src,photo.alt);
 }
}
out['assets/projects-data.js']='window.BOKRODI_PROJECTS = '+JSON.stringify(projects,null,2)+';\n';
const location=r=>'<p class="project-location"><a href="'+r.areaPage+'"><span aria-hidden="true">⌖</span> '+esc(r.location)+' · helyi munkáink ↗</a></p>';
function metadata(html,title,description,image){
 return html.replace(/<title>[^<]*<\/title>/,'<title>'+esc(title)+'</title>')
 .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+esc(description)+'">')
 .replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+esc(title)+'">')
 .replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+esc(description)+'">')
 .replace(/<meta property="og:image" content="[^"]*">/,'<meta property="og:image" content="'+origin+'/'+image+'">');
}
const org={'@type':'Organization','@id':origin+'/#business',name:'Bokrodi János',url:origin+'/',telephone:'+36208044133'};
const crumbs=(file,items)=>({'@type':'BreadcrumbList','@id':origin+'/'+file+'#breadcrumb',itemListElement:items.map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:origin+'/'+url}))});
function schema(html,graph){
 html=html.replace(/<script type="application\/ld\+json" id="project-seo-data">[\s\S]*?<\/script>/g,'');
 return html.replace('</head>','<script type="application/ld+json" id="project-seo-data">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')+'</script></head>');
}
function photosAndVersions(html){
 html=html.replace(/<img\b[^>]*>/g,tag=>{
  const src=tag.match(/\ssrc="([^"]+)"/)?.[1],alt=photoAlt.get(src);
  return alt?tag.replace(/\salt="[^"]*"/,' alt="'+esc(alt)+'"'):tag;
 });
 return html.replace(/assets\/(projects(?:-data)?\.(?:js|css))\?[^" ]+/g,'assets/$1?v=20261029-gallery');
}
for(const file of ['index.html','referenciak.html']){
 let html=base[file];
 html=html.replace(/<article class="(?:feature|standard)">[\s\S]*?<\/article>/g,article=>{
  const r=refs.find(r=>article.includes('id="bj-'+r.key+'-mosaic"'));if(!r)return article;
  article=article.replace(/<p class="project-location">[\s\S]*?<\/p>/g,'');
  const isHome=file==='index.html';
  const cardTitle=isHome?r.title.replace(' '+r.locative,''):r.title;
  return article.replace(/<h3>[^<]*<\/h3>/,'<h3>'+esc(cardTitle)+'</h3>'+(isHome?'':location(r)));
 });
 if(file==='index.html'){
  html=html.replace(/(<section class="section bj-gallery" id="projektek")(?: data-show-location="false")?/, '$1 data-show-location="false"');
  html=metadata(html,'Ács és tetőfedés Fejér, Pest megyében és Budapesten | Bokrodi János','Tetőfedés és ácsmunkák Fejér és Pest megyében, Budapesten. Saját referenciafotók és projektalbumok. Egyeztessen Bokrodi Jánossal: 06 20 804 4133.','assets/bokrodi-hero-poster.webp');
  html=html.replace('Tetőfedés, ácsmunkák, kerti kiülők és fa kocsibeállók. Mondja el az elképzelését, és kérjen átlátható, személyre szabott kalkulációt.','Tetőfedés és ácsmunkák Fejér és Pest megyében, valamint Budapesten. Kerti kiülők és fa kocsibeállók készítéséről is egyeztethet Bokrodi Jánossal.');
 }else{
  html=metadata(html,'Ács- és tetőfedő referenciák – 12 projekt, 74 fotó | Bokrodi János','Saját ács- és tetőfedő munkák Érden, Budaörsön, Százhalombattán, Budapest XXII. kerületében, Adonyban, Biatorbágyon és Ráckeresztúron.',projects.chapel.photos.find(p=>p.id==='c08').full);
 }
 const list={'@type':'ItemList','@id':origin+'/'+(file==='index.html'?'':file)+'#referenciak',name:'Ács- és tetőfedő referenciák',numberOfItems:Object.keys(projects).length,itemListElement:Object.values(projects).map((p,i)=>({'@type':'ListItem',position:i+1,item:{'@type':'ImageGallery','@id':origin+'/'+p.url+'#album',url:origin+'/'+p.url,name:p.title,...(p.location?{contentLocation:{'@type':'Place',name:p.location}}:{})}}))};
 html=schema(html,[org,{'@type':file==='index.html'?'WebPage':'CollectionPage','@id':origin+'/'+(file==='index.html'?'':file)+'#webpage',url:origin+'/'+(file==='index.html'?'':file),name:file==='index.html'?'Bokrodi János – ácsmunkák és tetőfedés':'Bokrodi János referenciái',inLanguage:'hu',mainEntity:{'@id':list['@id']}},crumbs(file,file==='index.html'?[['Főoldal','']]:[['Főoldal',''],['Referenciák',file]]),list]);
 out[file]=photosAndVersions(html);
 if(file==='index.html')out[file]=out[file].replace('assets/projects.js?v=20261029-gallery','assets/projects.js?v=20261029-gallery');
}
for(const r of refs){
 const p=projects[r.key],file=p.url,hero=p.photos.find(x=>x.id===r.heroPhoto);
 let html=metadata(base[file],r.title+' | Bokrodi János',r.description,hero.full);
 html=html.replace(/<h1>[^<]*<\/h1>/,'<h1>'+esc(r.title)+'</h1>');
 html=html.replace(/<a class="breadcrumb"[^>]*>[^<]*<\/a>/,'<nav class="project-breadcrumb" aria-label="Morzsamenü"><a href="index.html">Főoldal</a><span aria-hidden="true">/</span><a href="referenciak.html">Referenciák</a><span aria-hidden="true">/</span><span aria-current="page">'+esc(r.location)+' · projekt '+String(r.number).padStart(2,'0')+'</span></nav>');
 html=html.replace(/<!-- project-context:start -->[\s\S]*?<!-- project-context:end -->/g,'');
 html=html.replace(/<p class="album-description">[\s\S]*?<\/p>/,'<p class="album-description">'+esc(r.summary)+'</p><!-- project-context:start -->'+location(r)+'<div class="project-details"><h2>A fotókon bemutatott munkák</h2><ul>'+r.details.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><a class="button primary" href="tel:+36208044133">Hasonló munkát tervez? Hívjon ↗</a></div><!-- project-context:end -->');
 html=html.replace(/<section class="cta">[\s\S]*?<\/section>/,'<section class="cta"><div><p class="eyebrow">BESZÉLJÜK ÁT A KÖVETKEZŐ MUNKÁT</p><h2>Ácsmunka vagy tetőfedés '+esc(r.locative)+'?</h2><p>Mondja el a tervezett feladatot. A felmérésről és a vállalási időpontról telefonon egyeztetünk.</p></div><a class="button light" href="tel:+36208044133">06 20 804 4133 ↗</a></section>');
 const gallery={'@type':'ImageGallery','@id':origin+'/'+file+'#album',url:origin+'/'+file,name:r.title,description:r.summary,inLanguage:'hu',creator:{'@id':org['@id']},contentLocation:{'@type':'Place',name:r.location},relatedLink:origin+'/'+r.areaPage,breadcrumb:{'@id':origin+'/'+file+'#breadcrumb'},primaryImageOfPage:{'@id':origin+'/'+file+'#image-'+hero.id},image:p.photos.map(x=>({'@id':origin+'/'+file+'#image-'+x.id}))};
 const images=p.photos.map(x=>({'@type':'ImageObject','@id':origin+'/'+file+'#image-'+x.id,contentUrl:origin+'/'+x.full,thumbnailUrl:origin+'/'+x.src,name:x.caption,description:x.alt,contentLocation:{'@type':'Place',name:r.location},isPartOf:{'@id':gallery['@id']}}));
 html=schema(html,[org,crumbs(file,[['Főoldal',''],['Referenciák','referenciak.html'],[r.title,file]]),gallery,...images]);
 out[file]=photosAndVersions(html);
}
return Object.fromEntries(Object.entries({...out,...buildAdditionalProjects({...base,...out},projects)}).map(([file,content])=>[file,content.replace(/\r\n/g,'\n')]));
}
