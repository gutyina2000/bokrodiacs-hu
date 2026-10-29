// Render new project rows on the homepage and ordinary albums in the gallery.
// Project records live beside the existing records in assets/projects-data.js.
export function buildAdditionalProjects(base, projects) {
  const additions = Object.entries(projects).filter(([, p]) => p.galleryAddition);
  if (!additions.length) return {};
  const out = {}, origin = 'https://bokrodiacs.hu/';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const img = (p, sizes = '(max-width:760px) 85vw, 400px') => `<img src="${p.src}" srcset="${p.srcset}" sizes="${sizes}" alt="${esc(p.alt)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async">`;
  const lightbox = base['referenciak.html'].match(/<dialog class="bj-lightbox"[\s\S]*?<\/dialog>/)[0];
  const shot = (key, p, photo) => `<a class="shot" href="${p.url}#foto-${photo.id}" data-project="${key}" data-photo="${photo.id}" aria-label="${esc(photo.caption)} – nagyítás">${img(photo)}</a>`;
  function card([key, p]) {
    const single = p.photos.length === 1;
    return `<article class="standard"><div class="standard-mosaic${single ? ' single-shot' : ''}" id="bj-${key}-mosaic">${p.photos.slice(0, 4).map(photo => shot(key, p, photo)).join('')}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)} · ${p.photos.length} kép</p><a class="button" href="${p.url}">Projektalbum →</a></article>`;
  }
  function carousel([key, p]) {
    return `<article class="work-carousel project-carousel" data-work-carousel aria-labelledby="${key}-title">
      <div class="work-carousel__heading"><div><p class="eyebrow">${esc(p.kicker)} · ${p.photos.length} saját munkafotó</p><h3 id="${key}-title">${esc(p.title)}</h3><p class="work-carousel__intro">${esc(p.description)}</p></div>
      <div class="work-carousel__controls" data-work-controls hidden><button class="work-carousel__control" type="button" data-work-move="-1" aria-label="Előző fotó a képsorban">←</button><button class="work-carousel__control" type="button" data-work-pause>Ⅱ Megállítás</button><button class="work-carousel__control" type="button" data-work-move="1" aria-label="Következő fotó a képsorban">→</button></div></div>
      <div class="work-carousel__viewport" role="region" aria-label="${esc(p.title)} – vízszintes képsor"><ul class="work-carousel__track">${p.photos.map(photo => `<li class="work-carousel__card"${photo.height > photo.width ? ' data-portrait' : ''}><a class="work-carousel__link" href="${photo.full}" data-full-width="${photo.width}" data-full-height="${photo.height}" aria-label="${esc(photo.caption)} – nagyítás"><span class="work-carousel__photo">${img(photo, '(max-width:760px) 270px, 320px')}</span><span class="work-carousel__caption">${esc(photo.caption)}</span></a></li>`).join('')}</ul></div>
      <div class="project-carousel__footer"><span>Kattintson a képre a nagyításhoz.</span><a class="button" href="${p.url}">Teljes projektalbum →</a></div><span class="work-carousel__sr" data-work-status aria-live="polite" aria-atomic="true"></span>
      <dialog class="work-carousel__dialog" aria-labelledby="${key}-caption"><div class="work-carousel__viewer-top"><span>${esc(p.title)}</span><button class="close-dialog" type="button" aria-label="Fotónézegető bezárása">Bezárás ×</button></div><div class="work-carousel__frame"><img alt=""></div><div class="work-carousel__viewer-bottom"><button class="work-carousel__control" type="button" data-work-step="-1" aria-label="Előző kép">←</button><p aria-live="polite"><span id="${key}-caption" data-work-caption></span><span class="work-carousel__count" data-work-count></span></p><button class="work-carousel__control" type="button" data-work-step="1" aria-label="Következő kép">→</button></div></dialog>
    </article>`;
  }
  const count = Object.values(projects).reduce((n, p) => n + p.photos.length, 0);
  for (const file of ['index.html', 'referenciak.html']) {
    let html = base[file].replace(/<!-- additional-projects:start -->[\s\S]*?<!-- additional-projects:end -->\s*/g, '');
    const content = file === 'index.html'
      ? additions.filter(([, p]) => p.photos.length > 1).map(carousel).join('') + `<div class="standard-deck additional-single-projects">${additions.filter(([, p]) => p.photos.length === 1).map(card).join('')}</div>`
      : `<div class="standard-deck additional-projects">${additions.map(card).join('')}</div>`;
    html = html.replace(/<p class="intro">[^<]*<\/p>/, `<p class="intro">${Object.keys(projects).length} projekt · ${count} különböző fotó.</p>`);
    html = html.replace('<article class="feature">', `<!-- additional-projects:start --><div id="uj-projektek"><p class="section-label">Újonnan hozzáadott munkáink</p>${content}</div><p class="section-label">További projektjeink</p><!-- additional-projects:end -->\n<article class="feature">`);
    out[file] = html;
  }
  const template = base['projekt-lemezfedes-fa-eloteto.html'];
  for (const [key, p] of additions) {
    const url = origin + p.url;
    const phases = [...new Set(p.photos.map(photo => photo.phase))];
    const filters = phases.length > 1 ? `<div class="filters" hidden aria-label="Munkafázis szűrése">${['Összes', ...phases].map((phase, i) => `<button class="button" type="button" data-phase="${esc(phase)}" aria-pressed="${i === 0}">${esc(phase)}</button>`).join('')}</div>` : '';
    const gallery = `<section class="section bj-gallery" data-album="${key}" data-show-location="false"><nav class="project-breadcrumb" aria-label="Morzsamenü"><a href="index.html">Főoldal</a><span aria-hidden="true">/</span><a href="referenciak.html">Referenciák</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav><p class="eyebrow">${esc(p.kicker)} · Saját munkafotók</p><h1>${esc(p.title)}</h1><p class="album-description">${esc(p.description)}</p>${filters}<p class="album-meta" id="bj-filter-count" aria-live="polite">${p.photos.length} saját munkafotó</p><div class="grid">${p.photos.map((photo, i) => `<a class="tile" id="foto-${photo.id}" href="${photo.full}" data-photo="${photo.id}" data-project="${key}" data-phase-name="${esc(photo.phase)}" data-portrait="${photo.height > photo.width}"><span class="thumb">${img(photo, '(max-width:760px) 46vw, 30vw')}</span><span class="caption"><span class="num">${String(i + 1).padStart(2, '0')}</span>${esc(photo.caption)}</span></a>`).join('')}</div>${lightbox}</section>`;
    const cta = '<section class="cta"><div><p class="eyebrow">BESZÉLJÜK ÁT A KÖVETKEZŐ MUNKÁT</p><h2>Hasonló munkát tervez?</h2><p>A részletekről és a vállalási időpontról telefonon egyeztetünk.</p></div><a class="button light" href="tel:+36208044133">06 20 804 4133 ↗</a></section>';
    const graph = [
      {'@type':'BreadcrumbList',itemListElement:[['Főoldal',origin],['Referenciák',origin+'referenciak.html'],[p.title,url]].map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))},
      {'@type':'ImageGallery','@id':url+'#album',url,name:p.title,description:p.description,inLanguage:'hu',image:p.photos.map(photo=>({'@id':url+'#image-'+photo.id}))},
      ...p.photos.map(photo=>({'@type':'ImageObject','@id':url+'#image-'+photo.id,contentUrl:origin+photo.full,thumbnailUrl:origin+photo.src,name:photo.caption,description:photo.alt,isPartOf:{'@id':url+'#album'}}))
    ];
    out[p.url] = template.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, '<main id="main">'+gallery+cta+'</main>')
      .replace(/<title>[^<]*<\/title>/, '<title>'+esc(p.title)+' | Bokrodi János</title>')
      .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/, '$1'+esc(p.description))
      .replace(/(<meta property="og:description" content=")[^"]*/, '$1'+esc(p.description))
      .replace(/(<meta property="og:title" content=")[^"]*/, '$1'+esc(p.title)+' | Bokrodi János')
      .replace(/(<meta property="og:image" content=")[^"]*/, '$1'+origin+p.photos[0].full)
      .replaceAll('https://bokrodiacs.hu/projekt-lemezfedes-fa-eloteto.html',url)
      .replace(/<script type="application\/ld\+json" id="project-seo-data">[\s\S]*?<\/script>/, '<script type="application/ld+json" id="project-seo-data">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')+'</script>');
  }
  return out;
}
