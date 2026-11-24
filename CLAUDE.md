# googleadvertising.nl

Statische site zonder dependencies. Zie `README.md` voor de opbouw en het bouwen (`node build.mjs`).

## Vindbaarheid (Stap 2)

Stap 2 van dit project, de site vindbaar maken, loopt via de bureau-plugin `vindbaar-maken` (`/vindbaar-maken status`, `/vindbaar-maken fase N`, `/vindbaar-maken check`, `/vindbaar-maken maand`). De administratie staat in `docs/vindbaarheid/`; `STATUS.md` daar is leidend voor de stand van zaken. Elke wijziging aan de live site doorloopt de checklist uit fase 10 van die plugin. Zet nooit `noindex` of een `Disallow: /` op productie zonder vervaldatum in `STATUS.md`.

Afspraken die uit fase 1 komen:

- Adressen eindigen op een slash (`trailingSlash: true` in `vercel.json`); canonicals, sitemap en interne links volgen die vorm.
- Titels zijn maximaal 60 tekens. `build.mjs` laat de merknaam achteraan vallen als hij niet past en waarschuwt bij een te lange titel.
- Vervang een bestand in `public/assets/` nooit onder dezelfde naam: die map wordt een jaar onveranderlijk gecachet.

Afspraken die uit fase 4 en 6 komen:

- Foto's: zet de JPG (2000 breed) in `public/assets`, draai `tools/convert-images.mjs` (zie `docs/vindbaarheid/06-performance.md`) en gebruik in `build.mjs` de helper `photo()`. Geen losse `<img>` voor foto's.
- Fonts staan in `public/fonts/` en worden in `src/styles.css` geladen. Geen externe stylesheets of scripts toevoegen zonder dat de privacyverklaring en fase 7 daarop zijn aangepast.
- Structured data wordt in `build.mjs` opgebouwd uit de inhoud. Wat in de markup staat, staat ook zichtbaar op de pagina; geen `AggregateRating` op basis van Google-reviews.
