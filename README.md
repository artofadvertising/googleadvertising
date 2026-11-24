# googleadvertising.nl

Statische website (35 pagina's) voor Google Ads uitbesteden. Geen dependencies.

- `content.mjs`: alle teksten van dienst-, doelgroep-, kennisbank- en regiopagina's, plus bedrijfsgegevens (`site`, vul hier het KvK-nummer in).
- `build.mjs`: bouwt de site in `dist/`, inclusief `sitemap.xml` en `llms.txt`. De homepage en het formulier staan in dit bestand.
- `src/styles.css`, `src/form.js`: opmaak en formulierlogica.
- `public/`: `robots.txt`, favicon en afbeeldingen.
- Het aanvraagformulier opent een vooringevuld WhatsApp-bericht naar het nummer in `site.whatsapp` (`content.mjs`).

## Lokaal bouwen

    node build.mjs
    npx serve dist

## Vercel

Importeer de repo; `vercel.json` regelt het build-commando en de uitvoermap. Er zijn geen omgevingsvariabelen nodig.
