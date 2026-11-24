# Status vindbaarheid googleadvertising.nl

Bijgewerkt: 24 november 2026. Domein: https://googleadvertising.nl (canoniek: https, zonder www, met slash aan het eind). Hosting: Vercel, statische site (`node build.mjs`). Statistiekkeuze (fase 7): B, GA4 via Tag Manager met eigen cookievenster en Consent Mode v2 (gekozen op 24-11-2026).

Klant en bureau zijn hier dezelfde partij: googleadvertising.nl is een label van Art of Advertising B.V.

## Fasen

| # | Fase | Status | Laatst | Volgende actie |
|---|---|---|---|---|
| 0 | Nulmeting en plan | Klaar | 24-11-2026 | KvK-nummer en eigenaar van de accounts aanleveren (zie nulmeting) |
| 1 | Technische basis | Deels (live en op productie groen gemeten; controle in Search Console wacht op fase 2) | 24-11-2026 | Na fase 2: URL-inspectie op de homepage en één dienstpagina. Beslissen over de titel van de homepage (67 tekens) |
| 2 | Accounts en registraties | Deels (Search Console en Bing ingericht, sitemap ingediend, indexering aangevraagd) | 24-11-2026 | Over één tot drie dagen controleren of de homepage in Google en Bing staat; tweede eigenaar toevoegen; Tag Manager-container aanmaken |
| 3 | Zoekwoorden en content | Open (eerste lijst staat in `zoekwoorden.md`) | 24-11-2026 | Volumes ophalen, beschrijvingen op lengte, regiopagina's eigen inhoud |
| 4 | Structured data | Deels (live; vijf pagina's zonder fouten op validator.schema.org) | 24-11-2026 | Rich Results Test door het bureau; KvK-nummer invullen; beslissen over `sameAs`; rapport in Search Console bekijken zodra het gevuld is |
| 5 | Lokale vindbaarheid | Open | | Beslissen: eigen Bedrijfsprofiel of onderdeel van dat van Art of Advertising |
| 6 | Performance | Klaar op de simulatie (productie na de merkstijl Raak: Lighthouse mobiel 100 en 100, LCP 1,2 s, toegankelijkheid 100); velddata volgt | 24-11-2026 | Core Web Vitals in Search Console bekijken zodra er velddata is |
| 7 | Meting en consent | Deels (Tag Manager `GTM-PV4X5QH3` en GA4 `G-LBK8C1381P` ingericht en gepubliceerd; consent-test en conversies op de preview geslaagd; nog niet live) | 24-11-2026 | PR samenvoegen; consent-test en Lighthouse op productie; intern verkeer uitsluiten |
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
| Search Console | Art of Advertising, werkaccount (Google Workspace); domein-property en URL-voorvoegsel | Nog geen tweede eigenaar | Onbekend | Onbekend |
| Bing Webmaster Tools | Art of Advertising, het bureau-account met de andere klantsites | | Onbekend | Onbekend |
| GTM | Art of Advertising, werkaccount (Google Workspace); account "Art of Advertising", container `GTM-PV4X5QH3` | Nog geen tweede beheerder | Onbekend | Onbekend |
| Analytics | Art of Advertising, werkaccount (Google Workspace); account "Art of Advertising", property googleadvertising.nl | Nog geen tweede beheerder | Onbekend | Onbekend |
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

- 24-11-2026: PR 4 samengevoegd (merge-commit `f5e411d`), de merkstijl Raak staat live. Op productie gemeten: 42 van 42 sitemap-adressen 200; fonts en het nieuwe logo geven 200 met de juiste `content-type` en een jaar cache; Lighthouse mobiel 100 op alle vier de onderdelen voor de homepage (LCP 1,2 s, CLS 0, 117 kB) en `/google-ads-beheer/` (LCP 1,2 s, CLS 0, 89 kB). Nog te doen door het bureau: in Search Console indexering aanvragen voor de homepage.
- 24-11-2026: merkstijl Raak als PR 4 aangeboden (wit, inkt en felroze-rood; Bricolage Grotesque en Figtree zelf gehost, samen 61 kB; teksten ongewijzigd). Checklist bij wijzigingen doorlopen tegen een build van `main`: titels, meta descriptions, H1's, H2's, canonicals, robots-meta, `sitemap.xml`, `llms.txt` en `robots.txt` gelijk; structured data gelijk op het logo-adres na (nieuw bestand `logo-googleadvertising-raak-512.png`). Lighthouse mobiel lokaal: 100 op alle vier de onderdelen voor de homepage (LCP 1,5 s, CLS 0, 117 kB) en `/google-ads-beheer/` (LCP 1,4 s, CLS 0, 89 kB). Na samenvoegen: Lighthouse op productie herhalen en in Search Console indexering aanvragen voor de homepage.
- 24-11-2026: HTTPS hersteld. Twee AAAA-records bij mijndomein verwijderd en een CNAME voor `www` naar Vercel toegevoegd; Vercel gaf daarna de certificaten uit. Op `_dmarc` staat nog een CNAME naar Vercel die daar niet hoort; verwijderen of vervangen door een echte DMARC-regel.
- 24-11-2026: fase 0 uitgevoerd, fase 1 als PR aangeboden.
- 24-11-2026: Tag Manager en Google Analytics aangemaakt onder het werkaccount (voorwaarden geaccepteerd met akkoord van het bureau), container v1 gepubliceerd, GA4 gekoppeld aan Search Console. Consent-test en conversies getest op de preview.
- 24-11-2026: fase 7 site-kant gebouwd (cookievenster, Consent Mode v2, Tag Manager-snippet, `/cookies/`, formulier-event). Uitgeschakeld tot `site.gtm` is ingevuld; het werkaccount heeft nog geen Tag Manager- of Analytics-account.
- 24-11-2026: PR 2 samengevoegd (merge-commit `e716053`) en op productie gemeten: Lighthouse mobiel 100 op de homepage en de dienstpagina, LCP 1,2 s; structured data op vijf pagina's zonder fouten; fase 1 opnieuw groen, 42 van 42 sitemap-adressen 200.
- 24-11-2026: fase 2 deels uitgevoerd. Search Console (domein-property via TXT-record, plus URL-voorvoegsel) en Bing Webmaster Tools (via CNAME-record) geverifieerd; sitemap in beide ingediend (Google: 42 pagina's ontdekt); indexering aangevraagd voor de homepage en twee dienstpagina's.
- 24-11-2026: fase 4 en 6 als PR 2 aangeboden (structured data aangevuld, foto's in AVIF/WebP, fonts zelf gehost).
- 24-11-2026: PR 1 samengevoegd (merge-commit `b78a4d6`) en op productie gemeten: alle punten van fase 1 groen, 42 van 42 sitemap-adressen geven 200.
