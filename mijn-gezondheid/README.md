# Mijn Gezondheid — PWA

Een offline-werkende Progressive Web App om voeding, beweging en slaap bij te
houden. Alle data blijft lokaal op het apparaat (LocalStorage) — er is geen
server nodig.

## Hoe te draaien

1. Open deze map in VS Code.
2. Start "Live Server" op `index.html` (of een andere lokale webserver —
   `service worker` en `manifest.json` werken niet goed via een dubbelklik op
   het bestand, je hebt `http://` nodig, geen `file://`).
3. Open de URL in Chrome. Via DevTools → Application kun je de Manifest en
   Service Worker controleren.

## Hoe te deployen (voor O3 en O4)

1. Maak een Git-repository en commit dit project (zie hieronder voor een
   commit-aanpak die bij de planning past).
2. Push naar GitHub en zet **GitHub Pages** aan (Settings → Pages → branch
   `main`, map `/`).
3. Test de live URL op je telefoon: open hem, en kies "Toevoegen aan
   beginscherm" om de installeerbaarheid (F7) te checken.

## Mapping naar de functionele eisen

| Eis | Waar in de code |
|---|---|
| F1 — Create | `js/app.js` → `entry-form` submit-handler bouwt een entry-object en pusht 'm in de `entries`-array |
| F2 — Read per periode | `js/app.js` → `filterByPeriod()` (dag/week/maand) + `renderOverview()` |
| F3 — Delete/Reset specifiek item | `js/app.js` → click-handler op `#entry-list` met `data-delete-id`, filtert het item uit `entries` |
| F5 — Verplichte velden | `index.html` formulier: datum, categorie, omschrijving, waarde-type (aantal/gewicht/duur/kcal) + waarde |
| F6 — LocalStorage | `js/app.js` → `loadEntries()` / `saveEntries()`, sleutel `mijngezondheid:entries` |
| F7 — Installeerbaar | `manifest.json` + `<link rel="manifest">` in `index.html` |
| F8 — Offline (service worker) | `service-worker.js` (simpel cache-first patroon), geregistreerd in `js/app.js` → `init()` |
| F9 — Responsive (2+ schermformaten) | `css/style.css`: mobile-first, met één `@media (min-width: 700px)` die padding en het aantal kolommen aanpast |
| F10 — Semantische HTML5 + structuur | `index.html` gebruikt `<header>`, `<nav>`, `<main>`; CSS en JS zijn in losse, geordende bestanden |
| F11 — Taalswitch NL/EN | `js/i18n.js` + `i18n/nl.json` / `i18n/en.json`, knop `#lang-toggle` |

### Versimpeld t.o.v. een eerdere versie

Dit project was eerst iets uitgebreider en is daarna versimpeld zodat je 'm
makkelijker kunt uitleggen tijdens de codereview:

- Het "vandaag"-overzicht is een rij simpele balkjes (breedte in %) in plaats
  van een SVG-ring met cirkel-omtrek-berekeningen.
- De taalswitch (`js/i18n.js`) gebruikt gewone functies in plaats van een
  module-patroon met een teruggegeven object.
- De tabbalk staat op elk schermformaat onderaan — geen ingewikkelde
  omschakeling naar een zijbalk op desktop, alleen wat extra ruimte en een
  bredere statistieken-grid via één media query.
- De service worker gebruikt het standaard "cache-first" patroon: kijk in de
  cache, en haal anders op via internet.

Functioneel doet de app precies hetzelfde als voorheen — dit raakt alleen de
leesbaarheid van de code.

## Wat je zelf nog moet doen

Dit project levert de **werkende app (O3)** + de basis voor **O4** (zet 'm in
Git met meerdere kleine, betekenisvolle commits in plaats van één grote
commit — dat is wat de docent bij O4 wil zien).

Deze onderdelen vragen om jouw eigen input en kun je niet door een AI laten
invullen, omdat ze persoonlijk en beoordeeld op jouw proces zijn:

- **O1 Grof ontwerp** — de sitemap/datamodel-tekst kun je baseren op de drie
  schermen hieronder, maar schrijf het in je eigen woorden.
- **O2 Figma wireframes** — gebruik de drie schermen (Dashboard, Invoer,
  Overzicht) als uitgangspunt en bouw ze zelf in Figma.
- **O6 Reflectieverslag** — jouw proces, wat ging goed/minder goed.
- **O7 Thema & leefstijl (Word)** — jouw eigen leefstijl-analyse.
- **O8 Rekenwerk (Excel)** — bijvoorbeeld: kcal-totaal per dag, minuten→uren
  voor slaap (zit al in de app, maar werk het als berekening uit in Excel),
  of een MET-formule voor beweging.

## Structuur

```
index.html          → de drie "schermen" (dashboard / invoer / overzicht)
css/style.css        → mobile-first styling, één media query voor desktop
js/app.js            → CRUD, LocalStorage, weergave-logica (balkjes i.p.v. ring)
js/i18n.js           → taalswitch-logica (leest i18n/nl.json of en.json)
i18n/nl.json         → Nederlandse teksten
i18n/en.json         → Engelse teksten
manifest.json        → app-naam, iconen, kleuren (installeerbaarheid)
service-worker.js    → offline caching van de app-shell (cache-first)
icons/               → app-iconen (192px en 512px)
```

## Mogelijke uitbreidingen

- Een echte grafiek (bijv. een staafdiagram per week) op de overzichtpagina.
- Exporteren van data als CSV/JSON.
- Validatie verfijnen (bijv. geen toekomstige datums).
