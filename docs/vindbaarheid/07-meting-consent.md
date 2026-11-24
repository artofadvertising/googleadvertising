# Fase 7: meting en consent

Datum: 24 november 2026. Status: Tag Manager en Google Analytics zijn aangemaakt en ingericht, de container is gepubliceerd en de container-ID staat in `content.mjs`. Getest op de preview van de branch met de echte container: consent-test en alle conversies geslaagd. Nog niet live: dat gebeurt bij het samenvoegen van de PR. Daarna de test op productie herhalen.

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

## Accounts en instellingen

Aangemaakt op 24-11-2026 onder het werkaccount bij Art of Advertising waarmee ook Search Console is ingericht. De servicevoorwaarden van Tag Manager en Analytics en de voorwaarden voor gegevensverwerking (AVG) zijn daarbij geaccepteerd, met akkoord van het bureau.

| Onderdeel | Waarde |
|---|---|
| Tag Manager-account | Art of Advertising |
| Tag Manager-container | googleadvertising.nl, `GTM-PV4X5QH3` |
| Gepubliceerde versie | "v1 GA4, conversies, Consent Mode v2" (3 tags, 2 triggers) |
| Analytics-account | Art of Advertising |
| Analytics-property | googleadvertising.nl, tijdzone Nederland, valuta euro |
| Gegevensstroom | Website, `https://googleadvertising.nl`, meet-ID `G-LBK8C1381P`, verbeterde meting aan |
| Delen van gegevens met Google (account) | Alle vier de opties uit |
| Google Signals | Uit |
| Bewaring van gebeurtenisgegevens | 14 maanden (was 2) |
| Koppeling met Search Console | Gemaakt, met de property `https://googleadvertising.nl/` |
| E-mailvoorkeuren Analytics | Alles uit |

De inrichting van de container staat als back-up in `gtm-container-v1.json` (het importbestand waarmee de tags zijn aangemaakt).

| Tag | Type | Trigger |
|---|---|---|
| GA4 - Google-tag | Google-tag, `G-LBK8C1381P` | Initialization - All Pages |
| GA4 - contact_phone | GA4-gebeurtenis `contact_phone`, met `link_url` en `link_text` | Klik - telefoon (link begint met `tel:`) |
| GA4 - form_submit | GA4-gebeurtenis `form_submit`, met `form_name` | Event - form_submit_ok (aangepaste gebeurtenis) |

Alle drie: "geen aanvullende toestemming nodig"; de tags lezen Consent Mode zelf.

## Getest op de preview met de echte container (24-11-2026)

| Stap | Cookies | Wat Google ontvangt |
|---|---|---|
| Eerste bezoek, nog geen keuze | Geen enkele | Eén cookieloos signaal (`page_view`, alle toestemming geweigerd) |
| "Alleen noodzakelijk" | Geen enkele | Idem |
| "Cookie-instellingen", "Alles accepteren" | `_ga` en `_ga_*` | Hits met toestemming toegestaan |
| Klik op het telefoonnummer | | `contact_phone` met de `tel:`-link |
| Bedankpagina met `?via=aanvraag` | | `form_submit` met `form_name: aanvraag` |

Dat komt overeen met wat `/cookies/` belooft. De test heeft een handvol testgebeurtenissen in de nieuwe property gezet (vanaf het preview-adres).

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

De test met echte tags staat hierboven.

## Nog te doen

| # | Wie | Wat | Hoe we controleren dat het klaar is |
|---|---|---|---|
| 1 | Bureau | De PR samenvoegen, zodat de meting live gaat | `curl -sS https://googleadvertising.nl/ \| grep -c GTM-` geeft 2 |
| 2 | Claude | Consent-test op productie herhalen: zonder toestemming geen `_ga`-cookie; na toestemming wel | `document.cookie` en de verzoeken naar Google |
| 3 | Claude | Lighthouse opnieuw meten; Tag Manager kost laadtijd | Homepage blijft boven de 90 |
| 4 | Bureau | Intern verkeer uitsluiten: het IP-adres van kantoor opgeven in Analytics (Gegevensstreams, Tag-instellingen, Intern verkeer definiëren) en het filter op Actief zetten | Eigen bezoeken tellen niet mee |
| 5 | Bureau | Zodra de eerste echte events binnen zijn: `contact_phone` en `form_submit` markeren als belangrijke gebeurtenis (Beheer, Gebeurtenissen) | Staan onder "Belangrijke gebeurtenissen" |
| 6 | Bureau | Een tweede beheerder toevoegen in Tag Manager en Analytics | Twee gebruikers met beheerrechten |
| 7 | Bureau | Privacyverklaring op artofadvertising.nl: googleadvertising.nl noemen, of bevestigen dat de verwijzing vanaf `/cookies/` volstaat | Verklaring klopt met wat er laadt |

Na het samenvoegen krijgt elke nieuwe bezoeker het cookievenster te zien en gaat de meting lopen.

## Definition of done

- [x] Alle conversies gemeten en getest (op de preview, met de gepubliceerde container)
- [ ] Consent-test geslaagd op productie (op de preview geslaagd)
- [ ] `/cookies/` en de privacyverklaring kloppen met wat er daadwerkelijk laadt
- [ ] Rapport zichtbaar voor het bureau
- [x] Container gepubliceerd als versie met beschrijving
