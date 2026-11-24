# googleadvertising.nl

Statische website (35 pagina's) voor Google Ads uitbesteden. Geen dependencies.

- `content.mjs`: alle teksten van dienst-, doelgroep-, kennisbank- en regiopagina's, plus bedrijfsgegevens (`site`, vul hier het KvK-nummer in).
- `build.mjs`: bouwt de site in `dist/`, inclusief `sitemap.xml` en `llms.txt`. De homepage en het formulier staan in dit bestand.
- `src/styles.css`, `src/form.js`: opmaak en formulierlogica. De merkstijl heet Raak: wit, inkt (`#0B0B0B`) en één signaalkleur (`#FF2E63`), koppen in Bricolage Grotesque, lopende tekst in Figtree. Merktekens zijn de roos (ring met stip) en de roze punt achter koppen, die `build.mjs` automatisch zet bij elke h1 en h2 die op een punt eindigt. `src/consent.js`: cookievenster en Consent Mode; staat alleen aan als `site.gtm` in `content.mjs` is ingevuld (zie `docs/vindbaarheid/07-meting-consent.md`).
- `public/`: `robots.txt`, favicon en afbeeldingen.
- `public/fonts/`: de twee zelf gehoste fonts. `tools/convert-images.mjs`: maakt de AVIF- en WebP-varianten van de foto's (zie `docs/vindbaarheid/06-performance.md`).
- `docs/vindbaarheid/`: de administratie van het vindbaar maken; `STATUS.md` is leidend.
- Het aanvraagformulier opent een vooringevuld WhatsApp-bericht naar het nummer in `site.whatsapp` (`content.mjs`).

## Lokaal bouwen

    node build.mjs
    npx serve dist

## Vercel

Importeer de repo; `vercel.json` regelt het build-commando en de uitvoermap. Er zijn geen omgevingsvariabelen nodig.
