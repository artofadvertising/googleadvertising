# Fase 6: performance

Datum: 24 november 2026. Status: live (PR 2, merge-commit `e716053`) en op productie gemeten. Open blijft alleen de velddata, die er pas is als de site genoeg bezoekers heeft. "Vóór" en "na" zijn allebei gemeten op https://googleadvertising.nl; de tussenmeting op de lokale build staat erbij ter vergelijking.

## Metingen

Lighthouse 12, mobiel, gesimuleerde vertraging.

| Pagina | Meting | Vóór (productie) | Lokale build | Na (productie) |
|---|---|---|---|---|
| `/` | Performance | 90 | 100 | 100 |
| `/` | LCP | 3,6 s | 1,7 s | 1,2 s |
| `/` | FCP | 1,6 s | 0,8 s | 0,9 s |
| `/` | CLS | 0,041 | 0 | 0 |
| `/` | Gewicht | 557 kB | 136 kB | 136 kB |
| `/google-ads-beheer/` | Performance | 99 | 100 | 100 |
| `/google-ads-beheer/` | LCP | 1,8 s | 1,6 s | 1,2 s |
| `/google-ads-beheer/` | FCP | 1,8 s | 0,8 s | 0,8 s |
| `/google-ads-beheer/` | CLS | 0,032 | 0 | 0 |

Toegankelijkheid, best practices en SEO zijn gelijk gebleven (96 / 100 / 100 op de homepage, 100 / 100 / 100 op de dienstpagina).

## Wat er gedaan is

### Afbeeldingen

- De vijf foto's op de homepage staan nu in een `<picture>` met AVIF en WebP in drie breedtes (480, 800 en 1200) en een `sizes` die klopt met de layout. De oorspronkelijke JPG (2000 breed) blijft de terugvaloptie voor oude browsers.
- Grootste variant per foto: 23 tot 66 kB in AVIF, tegen 295 tot 620 kB als JPG.
- Alle vijf staan buiten het eerste scherm en laden lui (`loading="lazy"`, `decoding="async"`). Het LCP-element van de homepage is tekst, dus er is geen afbeelding die voorrang nodig heeft.
- In `build.mjs` maakt de helper `photo(naam, alt, sizes)` de markup; in de CSS staat `picture{display:contents}`, zodat de bestaande layoutregels blijven werken.

### Fonts

- Inter en Big Shoulders Display worden zelf gehost als variabele WOFF2 (`public/fonts/`, samen 84 kB, alleen de Latijnse tekenset) met `font-display: swap` en een `preload`.
- De externe stylesheet van Google Fonts is weg. Daarmee is er geen render-blokkerende externe bron meer en gaat er geen bezoekersverzoek meer naar Google.
- De bestandsnamen bevatten de versie (`-v20`, `-v24`) en `/fonts/` wordt een jaar onveranderlijk gecachet.

## Conversiecommando voor nieuwe foto's

```bash
mkdir -p /tmp/imgtool && cd /tmp/imgtool && npm init -y >/dev/null && npm install sharp@0.33.5 --silent
cd /pad/naar/de/repo && NODE_PATH=/tmp/imgtool/node_modules node tools/convert-images.mjs
```

Het script maakt van elke JPG in `public/assets` (behalve de deelafbeelding `og-*.jpg`) de zes varianten. Zet een nieuwe foto er als JPG van 2000 breed in, draai het script en gebruik in `build.mjs` de helper `photo()`.

## Checklist

| Punt | Stand | Status |
|---|---|---|
| Modern formaat (AVIF met WebP-terugval) | Alle vijf foto's | Groen |
| `srcset` met drie breedtes en kloppende `sizes` | Alle vijf foto's | Groen |
| Gewicht: overige beelden onder 80 kB in het grootste formaat | 23 tot 66 kB (AVIF) | Groen |
| `width` en `height` op elke `<img>` | Ja | Groen |
| Buiten het eerste scherm lui laden | Ja | Groen |
| Fonts zelf gehost als WOFF2, alleen gebruikte gewichten, `swap`, `preload` | Ja | Groen |
| Geen render-blokkerende externe stylesheets | Geen externe bronnen meer | Groen |
| Scripts `defer` | `form.js` staat op `defer`, alleen op de formulierpagina's | Groen |
| Caching van assets | `/assets/` en `/fonts/` een jaar, immutable | Groen |
| `styles.css` en `form.js` met hash in de naam | Niet; ze worden bij elk bezoek opnieuw gecontroleerd | Oranje, geaccepteerd |
| Badge Google Partner (PNG, 20 kB, getoond op 80 x 76) | Niet omgezet; Lighthouse schat 15 kB winst | Open, klein |
| Kleurcontrast | Twee labels ("Stap 2" en "Stap 3", groen en oranje op wit) halen het contrast niet | Open, keuze in de huisstijl |

## Nog te doen

1. Gedaan op 24-11-2026: Lighthouse mobiel op productie (tabel hierboven). Ook gecontroleerd: fonts en AVIF-bestanden geven 200 met de juiste `content-type` en een jaar cache; geen verwijzing meer naar Google Fonts in de HTML.
2. Zodra er genoeg bezoekers zijn: de velddata in PageSpeed Insights en het rapport Core Web Vitals in Search Console (na 28 dagen).
3. Beslissen over de kleur van de labels "Stap 2" en "Stap 3".

## Definition of done

- [x] Lighthouse mobiel 90+ op de homepage en de zwaarste subpagina, gemeten op productie (100 en 100)
- [x] LCP onder 2,5 s in de simulatie, gemeten op productie (1,2 s)
- [x] Geen render-blokkerende externe bronnen
- [x] Alle foto's in modern formaat met `srcset`
- [ ] Search Console Core Web Vitals zonder "slechte URL's" (kan pas met velddata)
