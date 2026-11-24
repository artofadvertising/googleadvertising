# Fase 4: structured data

Datum: 24 november 2026. Status: wijzigingen staan in PR 2. Gecontroleerd op de lokale build met een script dat de JSON-LD uit alle 44 HTML-bestanden terugleest. Valideren op validator.schema.org en in de Rich Results Test kan pas op de live site, dus na het samenvoegen.

## Wat er op welke pagina staat

Eén `<script type="application/ld+json">` per pagina met een `@graph`. De markup wordt in `build.mjs` opgebouwd uit dezelfde inhoud als de zichtbare tekst, zodat FAQ en markup niet uit elkaar kunnen lopen.

| Object | `@id` | Op welke pagina's | Aantal |
|---|---|---|---|
| `ProfessionalService` (de organisatie) | `/#organisatie` | Alle | 44 |
| `Person` (de specialist) | `/#specialist` | Alle | 44 |
| `WebSite` | `/#website` | Alle (was: alleen de homepage) | 44 |
| `WebPage` | `<pagina>#webpage` | Alle, behalve de 404-pagina (nieuw) | 43 |
| `BreadcrumbList` | `<pagina>#breadcrumb` | Alle subpagina's met een kruimelpad | 39 |
| `FAQPage` | `<pagina>#faq` | Homepage, diensten, doelgroepen, kennisbank, regio's | 35 |
| `Service` | `<pagina>#dienst` | Homepage, diensten, doelgroepen en nu ook de tien regiopagina's | 26 |
| `Article` | `<pagina>#artikel` | Kennisbankartikelen en klantcases | 12 |

## Wat er veranderd is

- `WebSite` staat op elke pagina, met `publisher` naar de organisatie.
- Elke pagina heeft een `WebPage` met titel, beschrijving, `isPartOf` (website), `about` (organisatie), de deelafbeelding en een verwijzing naar het kruimelpad.
- `FAQPage`, `BreadcrumbList`, `Service` en `Article` hebben een eigen `@id`, zodat objecten naar elkaar verwijzen in plaats van los te staan.
- De regiopagina's hebben een `Service` met die ene plaats als `areaServed` (`City`).
- `Article` heeft een `image` (de deelafbeelding) en `isPartOf` naar de pagina.
- De organisatie heeft een `logo` (PNG, 512 x 512) en krijgt een `identifier` met het KvK-nummer zodra `site.kvk` in `content.mjs` is ingevuld.
- De moederorganisatie heeft een `legalName`.
- Eerder vandaag (PR 1): `AggregateRating` verwijderd.

## Controle op de lokale build

| Controle | Uitkomst |
|---|---|
| Eén geldig JSON-LD-blok per pagina | 44 van 44 |
| Elke verwijzing naar een `@id` wijst naar een object in hetzelfde blok | Ja, geen losse verwijzingen |
| Geen dubbele `@id` binnen een pagina | Ja |
| Elke FAQ-vraag en elk antwoord staat letterlijk zichtbaar op de pagina | Ja, op alle 35 pagina's |
| `aggregateRating` in de markup | Nergens |

## Open punten

| Punt | Wie | Hoe we controleren |
|---|---|---|
| KvK-nummer invullen in `content.mjs` (`site.kvk`) | Bureau | `identifier` verschijnt in de markup en het nummer in de footer |
| `sameAs` van de organisatie wijst naar een zoekopdracht in Google Maps en naar het Instagram-account van Art of Advertising. Dat zijn geen profielen van googleadvertising.nl zelf. Beslissen: laten staan, of vervangen door eigen profielen (LinkedIn-pagina, en het Bedrijfsprofiel als dat er komt) | Bureau | `sameAs` bevat alleen profielen van het label of van het moederbedrijf, bewust gekozen |
| Openingstijden en e-mailadres ontbreken in de markup, omdat ze niet op de site staan | Bureau | Staan op de site en in de markup, of bewust niet |
| Valideren op https://validator.schema.org voor de homepage, één dienstpagina, één regiopagina en één kennisbankartikel | Claude, na het samenvoegen | Geen fouten |
| Rich Results Test (vereist een Google-login) op dezelfde vier pagina's | Bureau | Geen fouten; waarschuwingen beoordelen |
| Rapport "Verbeteringen" in Search Console na een paar dagen | Bureau, na fase 2 | Geen fouten |

## Definition of done

- [ ] Rich Results Test zonder fouten op de homepage, één dienstpagina, één regiopagina en één FAQ
- [ ] Search Console toont geen structured-data-fouten (kan pas na fase 2)
- [x] NAP in de markup identiek aan de footer (er is geen eigen Bedrijfsprofiel om mee te vergelijken)
