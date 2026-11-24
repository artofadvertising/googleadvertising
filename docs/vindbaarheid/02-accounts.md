# Fase 2: accounts en registraties

Datum: 24 november 2026. Status: Search Console en Bing Webmaster Tools zijn ingericht. Tag Manager, statistieken en de beslissing over het Bedrijfsprofiel staan nog open.

## Wat er gedaan is

| Onderdeel | Stand op 24-11-2026 | Hoe gecontroleerd |
|---|---|---|
| Search Console, domein-property `googleadvertising.nl` | Aangemaakt en geverifieerd via een TXT-record bij mijndomein | Melding "Eigendom geverifieerd"; TXT-record zichtbaar op beide nameservers en bij 8.8.8.8 en 1.1.1.1 |
| Search Console, property met URL-voorvoegsel `https://googleadvertising.nl/` | Aangemaakt; automatisch geverifieerd via de domein-property | Melding "Eigendom automatisch geverifieerd" |
| Sitemap in Search Console | `https://googleadvertising.nl/sitemap.xml` ingediend | Status "Succesvol", 42 ontdekte pagina's |
| Indexering aangevraagd | `/`, `/google-ads-beheer/` en `/google-ads-specialist/` | Drie keer de melding "Indexering aangevraagd" |
| URL-inspectie vóór de aanvraag | "URL is onbekend bij Google" op alle drie | Zoals verwacht bij een nieuwe site |
| Bing Webmaster Tools | Site handmatig toegevoegd aan het bestaande bureau-account en geverifieerd via een CNAME-record bij mijndomein | Het dashboard van de site is beschikbaar; CNAME zichtbaar bij de nameserver en de publieke resolvers |
| Sitemap in Bing | Ingediend | Status "Processing" |

Bing is handmatig toegevoegd en niet geïmporteerd uit Search Console, zodat Bing geen toegang tot het Google-account nodig heeft.

## DNS-records die hiervoor zijn toegevoegd (mijndomein)

| Type | Naam | Doel | Laten staan |
|---|---|---|---|
| TXT | `googleadvertising.nl` | Verificatie Search Console (`google-site-verification=...`) | Ja; verwijderen maakt de verificatie ongeldig |
| CNAME | `<code>.googleadvertising.nl` naar `verify.bing.com.` | Verificatie Bing Webmaster Tools | Ja |

De bestaande records (A, CNAME voor `www`, SPF) zijn ongewijzigd; na beide wijzigingen opnieuw gecontroleerd met `dig`, en de site geeft 200 op https.

## Eigenaarschap

| Account | Eigenaar | Beheerder | 2FA | Herstel vastgelegd |
|---|---|---|---|---|
| Search Console (beide properties) | Werkaccount bij Art of Advertising (Google Workspace) waarmee de property is aangemaakt | Nog geen tweede eigenaar | Onbekend | Onbekend |
| Bing Webmaster Tools | Het bureau-account waarin ook de andere klantsites staan | | Onbekend | Onbekend |

Actie: een tweede eigenaar toevoegen in Search Console (Instellingen, Gebruikers en rechten), zodat de property niet van één persoon afhangt.

## Nog open

| # | Wie | Wat | Waar | Hoe we controleren dat het klaar is |
|---|---|---|---|---|
| 1 | Bureau | Tweede eigenaar toevoegen in Search Console | search.google.com/search-console, Instellingen, Gebruikers en rechten | Twee eigenaren in de lijst |
| 2 | Claude | Over één tot drie dagen de URL-inspectie herhalen | Search Console, URL-inspectie | "URL staat in Google" op de homepage |
| 3 | Claude | Controleren of Bing de sitemap heeft verwerkt | bing.com/webmasters, Sitemaps | Status "Success" met 42 URL's |
| 4 | Bureau | Tag Manager-container aanmaken en de container-ID doorgeven | tagmanager.google.com | `curl -sS https://googleadvertising.nl/ \| grep -c GTM-` geeft 2 |
| 5 | Bureau | Keuze statistieken vastleggen (bureau-standaard: GA4 via Tag Manager met eigen cookiebanner) | `STATUS.md` | Keuze staat in `STATUS.md`; uitvoering in fase 7 |
| 6 | Bureau | Beslissen over het Google Bedrijfsprofiel (advies in de nulmeting: geen tweede profiel op hetzelfde adres) | `STATUS.md` | Beslissing vastgelegd |
| 7 | Bureau | Social-profielen: eigen profielen voor het label, of bewust die van Art of Advertising gebruiken | `STATUS.md` | Beslissing vastgelegd; `sameAs` daarop aangepast |

Punt 4 en 5 hangen samen met fase 7: er mag geen tag live die cookies zet zonder cookiebanner.

## Definition of done

- [ ] Homepage staat in Google en Bing (aangevraagd op 24-11-2026; opname duurt meestal één tot drie dagen)
- [x] Sitemap geslaagd in Google (42 pagina's)
- [ ] Sitemap geslaagd in Bing (ingediend, in behandeling)
- [ ] Tag Manager laadt
- [ ] Bedrijfsprofiel: beslissing genomen
- [ ] Eigenaarschapstabel compleet, met een tweede eigenaar
