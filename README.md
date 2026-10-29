# Bokrodi János ács weboldala

A bokrodiacs.hu közzétett statikus weboldala, négy szolgáltatáskörrel, Fejér megye 108 és Pest megye 187 településével, budapesti egyeztetési lehetőséggel és saját munkafotós projektalbumokkal. Az online üzenetküldés még nincs bekötve; a küldésgombok le vannak tiltva, az űrlapok nem továbbítanak vagy tárolnak adatot. A SEO-változatban a keresők feltérképezése és indexelése engedélyezett, a hívható telefonszám a kapcsolati oldalon és a területi oldalakon is elérhető. Az online űrlapok továbbra sem küldenek üzenetet.

Publikálás: GitHub Pages, main ág, gyökérmappa.

## Projektgaléria — 2026. október 27.

A főoldalon közvetlenül a hero után hét projekt 55 saját munkafotója látható. A kápolnafelújítás kiemelt mozaikot kapott; minden projektnek külön, közvetlenül megnyitható albuma van. A Referenciák oldal ugyanezeket a projekteket mutatja be.

A `assets/projects-data.js` tartalmazza a képleírásokat, munkafázisokat és képhivatkozásokat; a `assets/projects.css` és `assets/projects.js` a galéria megjelenését és működését kezeli. A `assets/projektek/` 157 WebP méretváltozatot tartalmaz, az eredeti fotók arányainak megtartásával. A kisebb képek késleltetve töltődnek; a nagy nézet külön képfájlt használ.

Ellenőrzés: minden helyi hivatkozás és képfájl érvényes, albumonkénti képszámok egyeznek. Böngészőben ellenőrizve: hero utáni elhelyezés, nagyítás, lapozás, Escape, munkafázisszűrés, 390 és 320 képpontos mobilnézet, JavaScript nélküli album. A hero és a fejléc változatlan.

## Garanciajelvény és hívásgomb — 2026. október 27.

A felhasználó által jóváhagyott Higgsfield-kép minden oldalon rögzítve látható a jobb alsó sarokban, közvetlenül alatta a `tel:+36208044133` híváshivatkozással. A kijelzett szám: 06 20 804 4133. Mobilon kisebb méretű, és JavaScript nélkül is működik.

A megjelenést az `assets/guarantee-call.css`, a jelvényt az `assets/brand/garanciat-vallalunk.webp` tartalmazza (480 × 473 px, átlátszó háttér). Forrás: Higgsfield képgenerálás, `89897970-b9ba-4242-a8fe-fb92c70b157e`.

## Fejér és Pest megye teljes településjegyzéke — 2026. október 27.

- `teruletek.html`: területi áttekintő, két megyei belépési ponttal.
- `acs-fejer-megye.html`: 108 település, 8 járás; `acs-pest-megye.html`: 187 település, 18 járás. Ékezetfüggetlen település- és járáskereső.
- 295 statikus `acs-{telepules}.html` oldal. Minden oldalon elérhető szolgáltatások, munkaterület-előkészítési útmutató, működő telefonhivatkozás, munkafotó/album, kérdések és válaszok, járási belső hivatkozások.
- A főoldali térkép mind a 295 települést és Budapestet eléri. Agárd a Gárdony-oldal kereshető aliasa, nem külön önálló település. A meglévő `#teruletek` horgony megmarad.
- A főmenü és a lábléc a külön területi áttekintőre mutat. A meglévő oldalak URL-je nem változik.
- Egyedi title és meta description, önmagára mutató canonical, Open Graph URL, BreadcrumbList és Service strukturált adatok. Egyetlen közös szolgáltató, kitalált helyi címek/irodák és értékelések nélkül.
- A `robots.txt` engedélyezi a feltérképezést, a noindex tiltás megszűnik; a `sitemap.xml` mind a 311 HTML-oldal kanonikus URL-jét felsorolja. A kész kód önmagában nem jelent Google-indexelést vagy rangsorolási ígéretet.

### Hiteles forrás és karbantartás

A `data/settlements.json` a KSH 2026. január 1-jei Helységnévtárának Fejér és Pest megyei sorait tartalmazza (név, vármegye, járás, járásszékhely, településazonosító). Forrás: https://www.ksh.hu/docs/helysegnevtar/hnt_letoltes_2026.xlsx ; ellenőrizve: 2026-10-27. Budapest nem része Pest vármegye 187 településének.

Generálás: `node scripts/generate-areas.mjs`. Ellenőrzés: `node scripts/check-areas.mjs`. Külső csomag és futásidejű adatletöltés nem szükséges. A megyei és településoldalakat a `scripts/areas-builder.mjs` és az adatállomány alapján kell módosítani, majd újragenerálni; a közvetlen HTML-szerkesztést a következő generálás felülírja.

A generátor újrafuttatása nem okoz további változást. A gépi ellenőrzés a 295 település teljességét, a 311 oldalt, minden helyi linket/képhivatkozást/horgonyt, a metaadatokat, a JSON-LD-t, a sitemap egyezését és az ismételt generálás stabilitását vizsgálja.

Böngészőben ellenőrizve: Fejér 108 / Pest 187 találata, ékezet nélküli keresés, Agárd → Gárdony, üres találat és visszaállítás, megyei szűrés a főoldali térképen, településoldal megnyitása, mobilmenü, lenyíló kérdések, képek, 390 és 320 px szélesség. Nincs JS-hiba vagy vízszintes túlcsordulás a vizsgált nézetekben. A linkek és a tartalom eleve HTML-ben szerepelnek, JavaScript csak a szűréshez kell.

### Publikálás és további tartalom

Ez a változat külön ágon készül elő. A `main` GitHub Pages kiadása a felhasználó élesítési megerősítése után frissítendő. A keresőtiltás feloldása is ezzel a kiadással kerül az éles oldalra. A sitemap Search Console-beküldése és az indexelés ellenőrzése külön, kiadás utáni lépés; ez még nem történt meg.

A településoldalak szolgáltatási területet jelölnek, nem helyi telephelyet. A kiszállás, az időpont és a díjak egyeztetéshez kötöttek. A tulajdonos által megerősített hét helyszín saját projektalbumhoz kapcsolódik; más településre nem rendelünk kitalált referenciát. A későbbi helyi SEO-hoz ténylegesen ott végzett munkák fotóival, műszaki részleteivel és engedélyezett ügyfélértékelésekkel érdemes bővíteni az oldalakat.

## Helyi referenciák és főoldali SEO — 2026. október 27.

A tulajdonos helyszínpárosításai a `data/project-locations.json` fájlban szerepelnek: 01 Érd, 02 Budaörs, 03 Százhalombatta, 04 Budapest XXII. kerület, 05 Adony, 06 Biatorbágy, 07 Ráckeresztúr. Az eredeti projektalbum-URL-ek megmaradnak.

A főoldali projektkártyák címei és a főoldali képnagyítás feliratai településnév nélkül jelennek meg. A Referenciák oldal helyszínhivatkozásai, a hét album szövege és metaadatai, az 55 fotó képleírása és az albumoldali nagyítás felirata a tényleges helyszínhez kapcsolódik. A főoldali SEO-adatok és a területi térkép változatlanul megmaradnak. Az albumok ImageGallery és ImageObject adatai a látható tartalmat írják le, `contentLocation` megadással. Dátumot, utcacímet, ügyfélnevet vagy értékelést nem állítunk a projektekhez.

Hat településoldalon a hozzá tartozó saját referencia, kép és albumhivatkozás szerepel. Budapest XXII. kerülete külön `acs-budapest-22-kerulet.html` oldalt kapott; a főoldali Budapest-választás és a területi áttekintő ezt is eléri. A többi településen az érdi mintareferencia helyszíne kifejezetten Érd. A 295 önálló település száma nem változik, az oldaltérkép 311 oldalt tartalmaz.

Karbantartáskor sorrendben futtatandó:

```sh
node scripts/generate-projects.mjs
node scripts/generate-areas.mjs
node scripts/check-projects.mjs
node scripts/check-areas.mjs
```

A projektgenerátor a meglévő HTML-szerkezetet használja, a helyi tartalmat a párosítási adatból frissíti. A képek eredeti leírását a `sceneAlt` mező őrzi. Mindkét generátor ismételt futtatása változásmentes. Az ellenőrzések a pontos hét párosítást, az 55 képet, a kétirányú hivatkozásokat, a közösségi képfájlokat, minden helyi URL-t és a strukturált adatokat vizsgálják.

Böngészőben ellenőrizve: főoldali kápolna-összehasonlítás és képnagyítás, Budaörs saját referenciaoldala, XXII. kerületi album és területi oldal 390 px szélességen, munkafázisszűrés, Escape bezárás, a térkép Budapest-hivatkozása. A vizsgált nézetekben nincs vízszintes túlcsordulás vagy JavaScript-hiba.

## Google Search Console előkészítés

A https://bokrodiacs.hu/ URL-előtagú tulajdon a tulajdonos Google-fiókjában létrejött, ellenőrzése függőben van. A Google által kiadott ellenőrző metacímke a főoldal head elemében szerepel. A kiadás után a Search Console HTML-címkés ellenőrzését kell befejezni, majd a https://bokrodiacs.hu/sitemap.xml oldaltérképet beküldeni. A Google-beküldés és az indexelés még nem történt meg.


## Új projektalbumok — 2026. október 29.

19 új saját munkafotó öt külön projektben, a meglévő hét projekt elé rendezve: fa kocsibeálló (6), zöld trapézlemezes tető (7), piros tető és kéményburkolat (4), kerti faszerkezet (1), padlástéri tetőszerkezet (1). A főoldalon a három többképes album saját körbefutó, megállítható és nagyítható képsort kapott; az egyképes projektek külön kártyán szerepelnek. A Referenciák oldalon és az albumokban statikus elrendezés marad.

Az új projektek helyszíne nincs megadva, ezért település nincs hozzárendelve. Az adatokat az `assets/projects-data.js`, a forrásfotók párosítását a `data/gallery-upload-map.json`, a hozzáadott blokkokat és albumokat a `scripts/additional-projects.mjs` kezeli. A meglévő `generate-projects.mjs` ezt is meghívja. Összesen 12 projekt és 74 albumfotó szerepel; a külön Munka közben képsor változatlan tartalommal megmarad.

Ellenőrzés: projektgenerálás ismételhetősége, helyi hivatkozások és képfájlok, strukturált adatok és 316 oldalas sitemap. A böngészős vizuális ellenőrzést az előnézeti böngésző időtúllépése megakadályozta.
