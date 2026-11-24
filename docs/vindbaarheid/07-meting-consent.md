# Fase 7: meting en consent

Datum: 24 november 2026. Status: de site-kant is gebouwd en lokaal getest; hij staat uit totdat er een container-ID is ingevuld. De accounts (Tag Manager en Google Analytics) bestaan nog niet, dus er wordt nog niets gemeten.

## Keuze

Optie B uit het stappenplan: Google Analytics 4 via Google Tag Manager, met een eigen cookievenster en Google Consent Mode v2. Uitbreidbaar naar C (Google Ads-conversies) zonder de site aan te passen: de categorie "Marketing" zit al in het venster.

## Wat er in de site zit

Alles staat achter één schakelaar: `site.gtm` in `content.mjs`. Is die leeg, dan bouwt de site zonder tags, zonder cookievenster en zonder cookiepagina (de huidige situatie op productie).

| Onderdeel | Waar | Wat het doet |
|---|---|---|
| Consent Mode v2, standaardstatus | `build.mjs`, inline in de `<head>`, vóór Tag Manager | Zet alles op geweigerd; herstelt een eerdere keuze (maximaal een jaar oud) |
| Tag Manager-snippet | `build.mjs`, in de `<head>` en als `<noscript>` direct na `<body>` | Laadt de container |
| Cookievenster | `build.mjs` (markup), `src/consent.js` (gedrag), `src/styles.css` (huisstijl) | Twee lagen: hoofdlaag en voorkeuren per categorie. Weigeren is één klik, net als accepteren; geen vooraf aangevinkte vakjes |
| Link "Cookie-instellingen" | Footer van elke pagina en een knop op `/cookies/` | Opent de voorkeuren opnieuw |
| Pagina `/cookies/` | `build.mjs` | Welke cookies, waarvoor, hoe lang, en hoe je je keuze aanpast; verwijst voor de rest naar de privacyverklaring van Art of Advertising |
| Conversie-event formulier | `src/form.js` en de bedankpagina | Na een verstuurd formulier gaat de bezoeker naar `/aanvragen/bedankt/?via=aanvraag` of `?via=accountcheck`; de bedankpagina zet dan `form_submit_ok` met `form_name` in de dataLayer |

De keuze wordt per categorie een jaar bewaard in de lokale opslag van de browser onder de sleutel `gadv_consent`.

## Conversies

| Conversie | Hoe gemeten | Naam in GA4 |
|---|---|---|
| Klik op het telefoonnummer | Tag Manager, trigger op links die beginnen met `tel:` | `contact_phone` |
| Aanvraagformulier verstuurd | dataLayer-event `form_submit_ok`, `form_name` = `aanvraag` | `form_submit` |
| Gratis accountcheck aangevraagd | dataLayer-event `form_submit_ok`, `form_name` = `accountcheck` | `form_submit` |

Kanttekening: beide formulieren openen een vooringevuld WhatsApp-bericht. "Verstuurd" betekent hier dat het formulier geldig is ingevuld en WhatsApp is geopend; of de bezoeker het bericht daarna ook echt verzendt, is niet te meten. De triggers voor `wa.me` en `mailto:` uit het sjabloon zijn niet nodig: de site heeft geen losse WhatsApp- of e-maillinks.

## Lokaal getest (24-11-2026)

Getest op de lokale build met een test-ID als container (een lege container; er draaiden dus geen echte tags).

| Test | Uitkomst |
|---|---|
| Eerste bezoek | Venster verschijnt; `consent default` (alles geweigerd) staat vóór `gtm.js` in de dataLayer; niets in de lokale opslag |
| "Alleen noodzakelijk" | Venster sluit; opslag `analytics: false, marketing: false`; `consent update` alles geweigerd; event `consent_update` |
| "Cookie-instellingen" in de footer | Opent de voorkeurenlaag; beide schakelaars staan uit |
| Statistieken aan, "Keuze opslaan" | Opslag `analytics: true, marketing: false`; `analytics_storage` toegestaan, de drie advertentiesignalen geweigerd |
| Volgende pagina | Geen venster; de keuze wordt hersteld vóór `gtm.js` |
| Bedankpagina met `?via=aanvraag` | `form_submit_ok` met `form_name: aanvraag` |
| Bedankpagina zonder `?via` | Geen event |
| Telefoonbreedte (375) | Venster past in beeld |
| Build met lege `site.gtm` | Geen Tag Manager, geen venster, geen `/cookies/` |

Niet getest, omdat het een echte container en property vraagt: of Google Analytics zonder toestemming geen `_ga`-cookie zet en geen `collect`-verzoek met cookies doet, of de tags vuren in Tag Manager Preview, en of de events in GA4 binnenkomen.

## Nog te doen

| # | Wie | Wat | Hoe we controleren dat het klaar is |
|---|---|---|---|
| 1 | Bureau | Beslissen onder welk Google-account Tag Manager en Analytics komen. Het werkaccount waarmee Search Console is ingericht, heeft geen van beide; aanmaken betekent de voorwaarden van Google accepteren | Accounts bestaan; eigenaarschap staat in `STATUS.md` |
| 2 | Bureau of Claude | Tag Manager-container aanmaken; de container-ID invullen in `content.mjs` (`site.gtm`) | `curl -sS https://googleadvertising.nl/ \| grep -c GTM-` geeft 2 |
| 3 | Bureau of Claude | GA4-property volgens `gtm-ga4-stappen.md` uit de plugin: delen van gegevens uit, Google Signals uit, bewaring 14 maanden, intern verkeer uitgesloten, koppeling met de Search Console-property `https://googleadvertising.nl/` | Instellingen komen overeen met wat `/cookies/` belooft |
| 4 | Bureau of Claude | Tag Manager inrichten: Google-tag, trigger en tag `contact_phone`, trigger op het aangepaste event `form_submit_ok` en tag `form_submit` met `form_name` | Preview: elke conversie vuurt één keer |
| 5 | Claude | Consent-test op productie: zonder toestemming geen `_ga`-cookie; na toestemming wel | Netwerkpaneel en `document.cookie` |
| 6 | Claude | Lighthouse opnieuw meten; Tag Manager kost laadtijd | Homepage blijft boven de 90 |
| 7 | Bureau | Privacyverklaring op artofadvertising.nl: googleadvertising.nl noemen, of bevestigen dat de verwijzing vanaf `/cookies/` volstaat | Verklaring klopt met wat er laadt |

Volgorde: de PR met de site-kant kan nu al samengevoegd worden, want zonder container-ID verandert er niets aan wat bezoekers zien, op de bedankpagina-URL na (`?via=...`). Daarna 1 tot en met 4, dan de container-ID invullen in een tweede kleine PR, en pas dan 5 en 6.

## Definition of done

- [ ] Alle conversies gemeten en getest in Tag Manager Preview
- [ ] Consent-test geslaagd op productie
- [ ] `/cookies/` en de privacyverklaring kloppen met wat er daadwerkelijk laadt
- [ ] Rapport zichtbaar voor het bureau
- [ ] Container gepubliceerd als versie met beschrijving
