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
- A `robots.txt` engedélyezi a feltérképezést, a noindex tiltás megszűnik; a `sitemap.xml` mind a 310 HTML-oldal kanonikus URL-jét felsorolja. A kész kód önmagában nem jelent Google-indexelést vagy rangsorolási ígéretet.

### Hiteles forrás és karbantartás

A `data/settlements.json` a KSH 2026. január 1-jei Helységnévtárának Fejér és Pest megyei sorait tartalmazza (név, vármegye, járás, járásszékhely, településazonosító). Forrás: https://www.ksh.hu/docs/helysegnevtar/hnt_letoltes_2026.xlsx ; ellenőrizve: 2026-10-27. Budapest nem része Pest vármegye 187 településének.

Generálás: `node scripts/generate-areas.mjs`. Ellenőrzés: `node scripts/check-areas.mjs`. Külső csomag és futásidejű adatletöltés nem szükséges. A megyei és településoldalakat a `scripts/areas-builder.mjs` és az adatállomány alapján kell módosítani, majd újragenerálni; a közvetlen HTML-szerkesztést a következő generálás felülírja.

A generátor újrafuttatása nem okoz további változást. A gépi ellenőrzés a 295 település teljességét, a 310 oldalt, minden helyi linket/képhivatkozást/horgonyt, a metaadatokat, a JSON-LD-t, a sitemap egyezését és az ismételt generálás stabilitását vizsgálja.

Böngészőben ellenőrizve: Fejér 108 / Pest 187 találata, ékezet nélküli keresés, Agárd → Gárdony, üres találat és visszaállítás, megyei szűrés a főoldali térképen, településoldal megnyitása, mobilmenü, lenyíló kérdések, képek, 390 és 320 px szélesség. Nincs JS-hiba vagy vízszintes túlcsordulás a vizsgált nézetekben. A linkek és a tartalom eleve HTML-ben szerepelnek, JavaScript csak a szűréshez kell.

### Publikálás és további tartalom

Ez a változat külön ágon készül elő. A `main` GitHub Pages kiadása a felhasználó élesítési megerősítése után frissítendő. A keresőtiltás feloldása is ezzel a kiadással kerül az éles oldalra. A sitemap Search Console-beküldése és az indexelés ellenőrzése külön, kiadás utáni lépés; ez még nem történt meg.

A településoldalak szolgáltatási területet jelölnek, nem helyi telephelyet. A kiszállás, az időpont és a díjak egyeztetéshez kötöttek. A biatorbágyi oldal a meglévő, helyszínnel azonosított projektalbumra mutat; más településre nem rendelünk kitalált referenciát. A későbbi helyi SEO-hoz ténylegesen ott végzett munkák fotóival, műszaki részleteivel és engedélyezett ügyfélértékelésekkel érdemes bővíteni az oldalakat.
