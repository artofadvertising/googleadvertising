# Status vindbaarheid googleadvertising.nl

Bijgewerkt: 24 november 2026. Domein: https://googleadvertising.nl (canoniek: https, zonder www, met slash aan het eind). Hosting: Vercel, statische site (`node build.mjs`). Statistiekkeuze (fase 7): nog te maken; bureau-standaard is B (GA4 via Tag Manager met eigen cookiebanner).

Klant en bureau zijn hier dezelfde partij: googleadvertising.nl is een label van Art of Advertising B.V.

## Fasen

| # | Fase | Status | Laatst | Volgende actie |
|---|---|---|---|---|
| 0 | Nulmeting en plan | Klaar | 24-11-2026 | KvK-nummer en eigenaar van de accounts aanleveren (zie nulmeting) |
| 1 | Technische basis | Deels (live en op productie groen gemeten; controle in Search Console wacht op fase 2) | 24-11-2026 | Na fase 2: URL-inspectie op de homepage en één dienstpagina. Beslissen over de titel van de homepage (67 tekens) |
| 2 | Accounts en registraties | Open | | Search Console: domein-property, TXT-record bij mijndomein, sitemap indienen. Daarna Bing importeren |
| 3 | Zoekwoorden en content | Open (eerste lijst staat in `zoekwoorden.md`) | 24-11-2026 | Volumes ophalen, beschrijvingen op lengte, regiopagina's eigen inhoud |
| 4 | Structured data | Deels (markup compleet en lokaal gecontroleerd, PR 2; validatie op de live site volgt) | 24-11-2026 | Na samenvoegen valideren op validator.schema.org en in de Rich Results Test; KvK-nummer invullen; beslissen over `sameAs` |
| 5 | Lokale vindbaarheid | Open | | Beslissen: eigen Bedrijfsprofiel of onderdeel van dat van Art of Advertising |
| 6 | Performance | Deels (foto's in AVIF/WebP met `srcset`, fonts zelf gehost, PR 2; lokaal 100 en 100, LCP 1,7 s) | 24-11-2026 | Na samenvoegen Lighthouse op productie herhalen; beslissen over het contrast van de labels "Stap 2" en "Stap 3" |
| 7 | Meting en consent | Open (er draait nog niets) | | Tag Manager-container, cookiebanner, conversies bellen en WhatsApp-aanvraag |
| 8 | Autoriteit en links | Open | | Link vanaf artofadvertising.nl; aanmelden bij Trustoo, Sortlist, Semrush Agency Partners |
| 9 | AI-vindbaarheid | Deels (`llms.txt` en AI-crawlers geregeld) | 24-11-2026 | Eerste meting met de drie vragen zodra de site in Bing staat |
| 10 | Monitoring en onderhoud | Open | | Uptime-monitor en Search Console-meldingen instellen na fase 2 |

Status is één van: Open, Bezig, Deels (met wat er staat), Klaar.

## Eigenaarschap van accounts

| Account | Eigenaar (klant) | Beheerder (bureau) | 2FA | Herstel vastgelegd |
|---|---|---|---|---|
| Domein en DNS | Art of Advertising, bij mijndomein | Art of Advertising | Onbekend | Onbekend |
| Hosting | Art of Advertising, Vercel-team | Art of Advertising | Nee (Vercel toont de melding "Enable 2FA") | Onbekend |
| Code | GitHub `artofadvertising/googleadvertising` | Art of Advertising | Onbekend | Onbekend |
| Search Console | Bestaat nog niet | | | |
| Bing Webmaster Tools | Bestaat nog niet | | | |
| GTM | Bestaat nog niet | | | |
| Analytics | Bestaat nog niet | | | |
| Google Bedrijfsprofiel | Geen eigen profiel; de site verwijst naar dat van Art of Advertising | | | |
| Social | Geen eigen profielen; `sameAs` wijst naar Instagram van Art of Advertising | | | |

Uitgangspunt: klant eigenaar, bureau beheerder. Wachtwoorden staan in de wachtwoordmanager, niet hier.

## NAP-standaard

- Naam: googleadvertising.nl (label van Art of Advertising B.V.)
- Adres: Coehoornsingel 117, 9711 BR Groningen
- Telefoon: 050 211 3612 (op de site) / +31502113612 (internationaal)
- E-mail: geen; aanvragen lopen via het formulier (WhatsApp) en telefoon
- Website: https://googleadvertising.nl
- KvK / btw: nog niet ingevuld (`site.kvk` in `content.mjs` is leeg)
- Openingstijden: niet vastgelegd

## Tijdelijke noindex-regels

Geen op productiepagina's die moeten ranken. Blijvend op noindex: `/aanvragen/bedankt/` (bedankpagina) en de 404-pagina. Preview-deployments krijgen van Vercel automatisch `X-Robots-Tag: noindex` en staan achter een login.

## Logboek

- 24-11-2026: HTTPS hersteld. Twee AAAA-records bij mijndomein verwijderd en een CNAME voor `www` naar Vercel toegevoegd; Vercel gaf daarna de certificaten uit. Op `_dmarc` staat nog een CNAME naar Vercel die daar niet hoort; verwijderen of vervangen door een echte DMARC-regel.
- 24-11-2026: fase 0 uitgevoerd, fase 1 als PR aangeboden.
- 24-11-2026: fase 4 en 6 als PR 2 aangeboden (structured data aangevuld, foto's in AVIF/WebP, fonts zelf gehost).
- 24-11-2026: PR 1 samengevoegd (merge-commit `b78a4d6`) en op productie gemeten: alle punten van fase 1 groen, 42 van 42 sitemap-adressen geven 200.
