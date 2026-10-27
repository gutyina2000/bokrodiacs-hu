# Bokrodi János ács weboldala

A bokrodiacs.hu közzétett statikus weboldala, négy szolgáltatáskörrel, 16 helyszínnel és saját munkafotós projektalbumokkal. Az online üzenetküldés még nincs bekötve; a küldésgombok le vannak tiltva, az űrlapok nem továbbítanak vagy tárolnak adatot. A keresőindexelés a vállalkozói adatok és elérhetőségek megadásáig tiltva marad.

Publikálás: GitHub Pages, main ág, gyökérmappa.

## Projektgaléria — 2026. október 27.

A főoldalon közvetlenül a hero után hét projekt 55 saját munkafotója látható. A kápolnafelújítás kiemelt mozaikot kapott; minden projektnek külön, közvetlenül megnyitható albuma van. A Referenciák oldal ugyanezeket a projekteket mutatja be.

A `assets/projects-data.js` tartalmazza a képleírásokat, munkafázisokat és képhivatkozásokat; a `assets/projects.css` és `assets/projects.js` a galéria megjelenését és működését kezeli. A `assets/projektek/` 157 WebP méretváltozatot tartalmaz, az eredeti fotók arányainak megtartásával. A kisebb képek késleltetve töltődnek; a nagy nézet külön képfájlt használ.

Ellenőrzés: minden helyi hivatkozás és képfájl érvényes, albumonkénti képszámok egyeznek. Böngészőben ellenőrizve: hero utáni elhelyezés, nagyítás, lapozás, Escape, munkafázisszűrés, 390 és 320 képpontos mobilnézet, JavaScript nélküli album. A hero és a fejléc változatlan.
