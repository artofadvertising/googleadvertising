# Fase 1: technische basis

Datum: 24 november 2026. Status: wijzigingen staan in de PR van branch `vindbaarheid/fase-0-1`. "Vóór" is gemeten op productie (https://googleadvertising.nl, commit `b1f9b52`). "Na" is gemeten op de preview-deployment van de branch. De fase is pas klaar als dezelfde metingen op productie groen zijn; dat kan pas na het samenvoegen.

## Checklist

### Indexeerbaarheid

| Punt | Vóór | Na | Status |
|---|---|---|---|
| Geen `noindex` op pagina's die moeten ranken | Alleen op `/aanvragen/bedankt/` | Idem, plus de 404-pagina | Groen |
| `robots.txt` met `Sitemap:`-regel, geen CSS/JS/afbeeldingen geblokkeerd | Aanwezig, maar blokkeerde `/aanvragen/bedankt/` en `/*?utm_` | Beide regels weg: de `noindex` en de canonical moeten leesbaar zijn | Groen |
| `sitemap.xml`: alleen canonieke adressen met status 200 | 42 adressen, alle 200 | 42 adressen, alle met slash, 404-pagina staat er niet in | Groen |
| Preview-omgevingen op noindex en afgeschermd | Vercel zet `X-Robots-Tag: noindex` en vraagt een login | Idem | Groen |

### Eén adres per pagina

| Punt | Vóór | Na | Status |
|---|---|---|---|
| `http://` naar `https://` | 308 | Ongewijzigd | Groen |
| `www` naar apex | 308 naar `https://googleadvertising.nl` | Ongewijzigd | Groen |
| Slash aan het eind: één vorm | `/google-ads-kosten` en `/google-ads-kosten/` gaven allebei 200 | Zonder slash stuurt door naar met slash (`trailingSlash: true`) | Groen op preview |
| `/pagina.html` en `/pagina/index.html` | 308 naar de versie zonder slash (niet de canonieke) | Komt uit op de versie met slash | Groen op preview; aantal stappen meten op productie |
| `/index.html` | 308 naar `/` | Ongewijzigd | Groen |
| Canonical op elke pagina, absoluut, naar zichzelf | Aanwezig | Aanwezig; de 404-pagina heeft er geen | Groen |
| Interne links in de canonieke vorm | Alle met slash | Ongewijzigd | Groen |
| Hoofdletters geven 404 | `/Google-Ads-Kosten/` gaf 404 | Idem | Groen |
| Oude site of oud domein | Niet van toepassing: nieuw domein zonder historie | | Groen |

Keuze: de site is gebouwd met een slash aan het eind (canonicals, sitemap en alle interne links). Daarom staat `trailingSlash` op `true`, in afwijking van het bureau-sjabloon (`false`). De regel "één vorm, de rest stuurt door" is hetzelfde.

### Statuscodes en foutpagina's

| Punt | Vóór | Na | Status |
|---|---|---|---|
| Niet-bestaand adres geeft 404 | 404 | 404 | Groen |
| Eigen 404-pagina in huisstijl | Kale Vercel-melding | Eigen pagina met menu, vier diensten, snelkoppelingen en telefoonnummer (`dist/404.html`, noindex) | Groen op preview |
| Geen redirect-ketens | `http://www` gaat in twee stappen naar de apex (eerst https, dan apex) | Ongewijzigd; standaardgedrag van Vercel | Oranje, geaccepteerd |

### HTML-basis per pagina

| Punt | Vóór | Na | Status |
|---|---|---|---|
| `lang="nl"`, charset, viewport | Aanwezig | Ongewijzigd | Groen |
| Titel 50 tot 60 tekens, uniek | 41 van de 43 langer dan 60 (tot 96) | Alle maximaal 60, behalve de homepage (67, bewust) | Groen, één uitzondering |
| Meta description 120 tot 155 tekens | 18 te lang (156 tot 170), 4 te kort | Ongewijzigd | Rood, naar fase 3 |
| Eén H1 per pagina | Ja | Ja | Groen |
| Open Graph en `twitter:card` | Aanwezig; afbeelding 2000 x 1333, 454 kB | Afbeelding 1200 x 630, 167 kB, met breedte, hoogte en alt | Groen |
| Favicon SVG en PNG 32, `apple-touch-icon` | Alleen SVG | Alle drie | Groen |
| `hreflang` | Niet van toepassing: één taal | | Groen |

Over de titels: de merknaam achteraan (" | googleadvertising.nl", 23 tekens) past bij bijna geen enkele pagina binnen 60 tekens. `build.mjs` laat hem nu vallen als hij niet past; Google toont de sitenaam al apart boven het resultaat. Twaalf titels waren ook zonder merknaam te lang en zijn ingekort (elf in `content.mjs`, plus het sjabloon van de regiopagina's). Bij de klantcases is de titel ook de zichtbare kop; daar is een aparte `seoTitle` toegevoegd, zodat de kop op de pagina gelijk blijft. De homepage houdt de merknaam en is daarmee 67 tekens; inkorten kan alleen door "per maand" of de merknaam te schrappen, en die keuze is aan het bureau.

### Headers

| Header | Vóór | Na | Status |
|---|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000` | `max-age=63072000; includeSubDomains; preload` | Groen |
| `X-Content-Type-Options` | Ontbrak | `nosniff` | Groen |
| `Referrer-Policy` | Ontbrak | `strict-origin-when-cross-origin` | Groen |
| `Permissions-Policy` | Ontbrak | `camera=(), microphone=(), geolocation=(), payment=()` | Groen |
| `Content-Security-Policy` | Ontbrak | `frame-ancestors 'self'` | Groen |
| Caching van `/assets/` | Een jaar, immutable | Ongewijzigd | Groen, zie kanttekening |
| Caching van HTML | `max-age=0, must-revalidate` | Ongewijzigd | Groen |

Kanttekening bij caching: de bestanden in `/assets/` hebben geen versie of hash in de naam. Vervang een afbeelding daarom nooit onder dezelfde naam. `styles.css` en `form.js` worden bij elk bezoek opnieuw gecontroleerd; dat is veilig, en het hashen van die namen hoort bij fase 6.

### AI- en overige bestanden

| Punt | Stand | Status |
|---|---|---|
| `llms.txt` op de root, opgebouwd uit de inhoud | Aanwezig | Groen |
| AI-crawlers toegestaan in `robots.txt` | Ja, expliciet | Groen |
| `/.well-known/security.txt` | Ontbreekt. Optioneel; vraagt een contactadres en een jaarlijks te verversen verloopdatum | Open, optioneel |

### Markup

Buiten de checklist van fase 1, maar een risico: de `AggregateRating` in de JSON-LD is verwijderd. Die markeerde de Google-reviews van Art of Advertising (5,0 uit 39) als eigen beoordeling van googleadvertising.nl. De zichtbare badge met de link naar de reviews staat er nog.

## Na het samenvoegen meten op productie

```bash
D=https://googleadvertising.nl
for p in / /robots.txt /sitemap.xml /llms.txt /index.html /google-ads-kosten /google-ads-kosten/ /google-ads-kosten.html /google-ads-kosten/index.html /Google-Ads-Kosten/ /niet-bestaand/ /favicon-32.png /apple-touch-icon.png /assets/og-google-ads-uitbesteden.jpg; do printf "%-40s " "$p"; curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" -A "Mozilla/5.0" "$D$p"; done
curl -sS -D - -o /dev/null "$D/" | grep -iE '^(x-robots|strict|x-content|referrer|permissions|content-security|cache-control)'
curl -sS "$D/sitemap.xml" | grep -o '<loc>[^<]*' | sed 's/<loc>//' | while read u; do printf "%s " "$u"; curl -sS -o /dev/null -w "%{http_code}\n" "$u"; done
curl -sS "$D/niet-bestaand/" | grep -o '<title>[^<]*'
```

Verwacht: `/google-ads-kosten` en beide `.html`-varianten sturen in één stap door naar `/google-ads-kosten/`; `/niet-bestaand/` geeft 404 met de titel "Pagina niet gevonden"; geen `x-robots-tag` op productie; alle sitemap-adressen 200.

## Handmatige acties

1. Bureau: de PR beoordelen en samenvoegen. Controle: de meting hierboven.
2. Bureau: na het samenvoegen in Search Console de homepage en één dienstpagina inspecteren ("Indexering toegestaan"). Vereist fase 2.
3. Bureau: beslissen over de titel van de homepage (67 tekens met merknaam, of korter).

## Definition of done

- [ ] Alle regels groen op productie, gemeten na de deploy
- [x] Sitemap-adressen geven allemaal 200 (gemeten vóór; opnieuw meten na de deploy)
- [ ] Search Console meldt geen "uitgesloten door noindex" op pagina's die moeten ranken (kan pas na fase 2)
