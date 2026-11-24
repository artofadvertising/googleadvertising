// Bouwt de statische site in ./dist. Geen dependencies: `node build.mjs`.
import { mkdirSync, writeFileSync, rmSync, cpSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { site, spokes, articles, cities } from './content.mjs';

const OUT = 'dist';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().replace(/\s+/g, '-');
const bySlug = Object.fromEntries(spokes.map((s) => [s.slug, s]));
const pages = [];
rmSync(OUT, { recursive: true, force: true });

const check = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const arrow = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
const mark = '<span class="logo-mark"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 17l5-5 4 3 7-8"/><path d="M15 7h5v5"/></svg></span>';
const logo = `<a class="logo" href="/" aria-label="googleadvertising.nl, naar home">${mark}<span>googleadvertising<small>.nl</small></span></a>`;
const badge = `<div class="badge"><img src="/assets/google-partner-badge.png" alt="Google Partner" width="80" height="76" loading="lazy"><span>Officieel Google Partner</span></div>`;
const list = (items) => `<ul class="checks col">${items.map((i) => `<li>${check}<span>${esc(i)}</span></li>`).join('')}</ul>`;

const org = {
  '@type': 'ProfessionalService', '@id': `${site.url}/#organisatie`, name: site.name, url: site.url,
  description: 'Google Ads uitbesteden aan een vaste specialist. Beheer vanaf € 199 per maand, inclusief Google Tag Manager, zonder minimumbudget en maandelijks opzegbaar.',
  telephone: site.phoneHref, priceRange: 'Vanaf € 199 per maand', areaServed: { '@type': 'Country', name: 'Nederland' },
  address: { '@type': 'PostalAddress', streetAddress: site.street, postalCode: site.zip, addressLocality: site.city, addressCountry: 'NL' },
  parentOrganization: { '@type': 'Organization', name: site.company, url: site.companyUrl },
  image: `${site.url}/assets/google-ads-specialist-in-overleg-met-klant.jpg`,
};
const faqLd = (faq) => ({ '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const crumbLd = (trail) => ({ '@type': 'BreadcrumbList', itemListElement: trail.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.url + path })) });

function header() {
  return `<a class="skip" href="#inhoud">Direct naar de inhoud</a>
<header class="site-header"><div class="wrap">${logo}
<nav class="nav" aria-label="Hoofdmenu">
<a href="/#diensten">Diensten</a><a href="/#werkwijze">Werkwijze</a><a href="/google-ads-kosten/">Kosten</a><a href="/#resultaten">Resultaten</a><a href="/kennisbank/">Kennisbank</a>
<a class="btn btn-sm" href="/aanvragen/">Voorstel aanvragen</a>
</nav></div></header>`;
}

function footer() {
  const col = (title, label, links, two) => `<nav aria-label="${label}"><h2>${title}</h2><div${two ? ' class="two"' : ''}>${links.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join('')}</div></nav>`;
  const d = spokes.filter((s) => s.group === 'dienst').map((s) => [s.name, `/${s.slug}/`]);
  const w = spokes.filter((s) => s.group === 'voor').map((s) => [s.name, `/${s.slug}/`]);
  const r = cities.map(([c]) => [c, `/google-ads-specialist-${slugify(c)}/`]);
  const k = [['Google Ads uitbesteden', '/'], ['Kennisbank', '/kennisbank/'], ...articles.slice(0, 4).map((a) => [a.name, `/kennisbank/${a.slug}/`]), ['Voorstel aanvragen', '/aanvragen/']];
  return `<footer class="site-footer"><div class="wrap">
<div class="f-top">
<div class="f-brand">${logo}<p>Google Ads uitbesteden aan een vaste specialist. Voor bedrijven in heel Nederland die meer uit hun advertentiebudget willen halen.</p>${badge}</div>
<div class="f-cta"><p class="title">Meer uit je Google Ads halen?</p><p>Vanaf € 199 per maand, maandelijks opzegbaar. Je krijgt binnen 1 dag reactie.</p><a class="btn" href="/aanvragen/">Voorstel aanvragen</a><a href="tel:${site.phoneHref}"><strong>Of bel ${site.phone}</strong></a></div>
</div>
<div class="f-cols">
${col('Diensten', 'Diensten', d)}${col('Voor wie', 'Doelgroepen', w)}${col('Google Ads specialist in', 'Regio', r, true)}${col('Meer weten', 'Informatie', k)}
<div><h2>Contact</h2><address><a class="hl" href="${site.companyUrl}">${site.company}</a><span>${site.street}</span><span>${site.zip} ${site.city}</span>${site.kvk ? `<span>KvK ${site.kvk}</span>` : ''}<a href="tel:${site.phoneHref}">${site.phone}</a><a href="/aanvragen/">Aanvraagformulier</a></address></div>
</div>
<div class="f-bottom"><div class="row"><p>© ${new Date().getFullYear()} googleadvertising.nl. Website door <a class="hl" href="${site.companyUrl}">Art of Advertising</a>.</p>
<div><a href="${site.companyUrl}/privacyverklaring">Privacyverklaring</a><a href="${site.companyUrl}/algemene-voorwaarden">Algemene voorwaarden</a><a href="${site.companyUrl}/cookieverklaring">Cookies</a></div></div>
<p>Onafhankelijke website, niet verbonden aan Google. Google Ads is een handelsmerk van Google LLC.</p></div>
</div></footer>`;
}

function page({ path, title, desc, body, ld = [], noindex = false, scripts = '' }) {
  const canonical = site.url + path;
  const graph = JSON.stringify({ '@context': 'https://schema.org', '@graph': [org, ...ld] });
  const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">'}
<meta property="og:type" content="website">
<meta property="og:locale" content="nl_NL">
<meta property="og:site_name" content="googleadvertising.nl">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/assets/google-ads-specialist-in-overleg-met-klant.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${graph}</script>
</head>
<body>
${header()}
<main id="inhoud">
${body}
</main>
${footer()}
${scripts}
</body>
</html>
`;
  const file = join(OUT, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!noindex) pages.push(path);
}

const crumbs = (trail) => `<nav class="crumbs" aria-label="Kruimelpad">${trail.map(([n, p], i) => (i < trail.length - 1 ? `<a href="${p}">${esc(n)}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(n)}</span>`)).join('')}</nav>`;
const faqBlock = (h2, faq) => `<section class="section" id="faq"><div class="wrap stack gap-lg"><div class="stack narrow"><p class="kicker">Veelgestelde vragen</p><h2>${esc(h2)}</h2></div>
<div class="grid g2">${faq.map(([q, a]) => `<div class="card faq"><h3>${esc(q)}</h3><p>${esc(a)}</p></div>`).join('')}</div></div></section>`;
const related = (slugs) => `<div class="grid g4">${slugs.map((s) => bySlug[s]).map((s) => `<a class="card" href="/${s.slug}/"><h3>${esc(s.name)}</h3><p>${esc(s.desc.split('. ')[0])}.</p></a>`).join('')}</div>`;
const band = (h2, btn = 'Voorstel aanvragen') => `<div class="band"><div class="txt"><h2>${esc(h2)}</h2><p class="muted">Vanaf € 199 per maand, inclusief Tag Manager. Geen minimumbudget, maandelijks opzegbaar en binnen 1 dag reactie.</p></div><div class="act"><a class="btn btn-lg" href="/aanvragen/">${btn}</a><a class="link-strong" href="tel:${site.phoneHref}">Of bel ${site.phone}</a></div></div>`;
const pageHero = (trail, h1, intro, withBadge = true) => `<section class="alt page-hero"><div class="wrap">${crumbs(trail)}<div class="inner"><h1>${esc(h1)}</h1><p class="lead">${esc(intro)}</p><div class="actions"><a class="btn btn-lg" href="/aanvragen/">Voorstel aanvragen</a><a class="link-strong" href="tel:${site.phoneHref}">Of bel ${site.phone}</a></div>${withBadge ? badge : ''}</div></div></section>`;

// ---------- dienst- en doelgroeppagina's ----------
for (const s of spokes) {
  const path = `/${s.slug}/`;
  const trail = [['Home', '/'], [s.name, path]];
  const body = `${pageHero(trail, s.h1, s.intro)}
<section class="section"><div class="wrap stack gap-lg">
<div class="stack narrow"><h2>${esc(s.defH)}</h2><p class="lead" style="max-width:none">${esc(s.def)}</p></div>
<div class="grid g2"><div class="card"><h3>${esc(s.aT)}</h3>${list(s.a)}</div><div class="card"><h3>${esc(s.bT)}</h3>${list(s.b)}</div></div>
</div></section>
${s.spec ? `<section class="section alt"><div class="wrap split"><div class="side"><p class="kicker">In het kort</p><h2>De feiten op een rij.</h2><div><a class="btn" href="/aanvragen/">Voorstel aanvragen</a></div></div><dl class="spec main" style="gap:0">${s.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div></section>` : ''}
<section class="section${s.spec ? '' : ' alt'}"><div class="wrap"><div class="prose narrow">${s.secs.map(([h, ps]) => `<h2>${esc(h)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}</div></div></section>
${faqBlock(`Vragen over ${s.name.charAt(0).toLowerCase() === 'g' ? s.name : s.name.toLowerCase()}.`, s.faq)}
<section class="section alt"><div class="wrap stack gap-lg"><h2>Ook interessant</h2>${related(s.rel)}${band('Benieuwd wat er nog in je Google Ads zit?')}</div></section>`;
  page({ path, title: `${s.title} | googleadvertising.nl`, desc: s.desc, body, ld: [crumbLd(trail), faqLd(s.faq), { '@type': 'Service', name: s.name, serviceType: s.name, description: s.def, provider: { '@id': `${site.url}/#organisatie` }, areaServed: { '@type': 'Country', name: 'Nederland' }, url: site.url + path }] });
}

// ---------- kennisbank ----------
for (const a of articles) {
  const path = `/kennisbank/${a.slug}/`;
  const trail = [['Home', '/'], ['Kennisbank', '/kennisbank/'], [a.name, path]];
  const body = `<section class="alt page-hero"><div class="wrap">${crumbs(trail)}<div class="inner"><h1>${esc(a.h1)}</h1><div class="answer"><p class="kicker">Kort antwoord</p><p>${esc(a.answer)}</p></div><p class="small">Bijgewerkt op ${new Date(site.updated).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })} door het team van googleadvertising.nl</p></div></div></section>
<section class="section"><div class="wrap"><div class="prose narrow">${a.secs.map(([h, ps]) => `<h2>${esc(h)}</h2>${ps.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')}</div></div></section>
${faqBlock('Veelgestelde vragen', a.faq)}
<section class="section alt"><div class="wrap stack gap-lg"><h2>Verder lezen</h2>${related(a.rel)}${band('Liever dat een specialist meekijkt?')}</div></section>`;
  page({ path, title: `${a.title} | googleadvertising.nl`, desc: a.desc, body, ld: [crumbLd(trail), faqLd(a.faq), { '@type': 'Article', headline: a.h1, description: a.desc, datePublished: site.updated, dateModified: site.updated, inLanguage: 'nl', author: { '@id': `${site.url}/#organisatie` }, publisher: { '@id': `${site.url}/#organisatie` }, mainEntityOfPage: site.url + path }] });
}
{
  const trail = [['Home', '/'], ['Kennisbank', '/kennisbank/']];
  const body = `<section class="alt page-hero"><div class="wrap">${crumbs(trail)}<div class="inner"><h1>Kennisbank Google Ads</h1><p class="lead">Korte, eerlijke antwoorden op de vragen die we het vaakst krijgen over Google Ads en uitbesteden.</p></div></div></section>
<section class="section"><div class="wrap"><div class="grid g3">${articles.map((a) => `<a class="card" href="/kennisbank/${a.slug}/"><h3>${esc(a.h1)}</h3><p>${esc(a.answer.split('. ')[0])}.</p></a>`).join('')}</div></div></section>
<section class="section alt"><div class="wrap">${band('Meer uit je Google Ads halen?')}</div></section>`;
  page({ path: '/kennisbank/', title: 'Kennisbank Google Ads: antwoorden op veelgestelde vragen | googleadvertising.nl', desc: 'Antwoorden op veelgestelde vragen over Google Ads: zelf doen of uitbesteden, kosten per klik, Performance Max, meting en begrippen.', body, ld: [crumbLd(trail)] });
}

// ---------- regiopagina's ----------
for (const [c, near] of cities) {
  const path = `/google-ads-specialist-${slugify(c)}/`;
  const trail = [['Home', '/'], ['Google Ads specialist', '/google-ads-specialist/'], [c, path]];
  const local = c === 'Groningen' ? `Ons kantoor staat aan de ${site.street} in Groningen. Je bent welkom voor de intake of het maandelijkse overleg.` : `We werken op afstand voor bedrijven in ${c} en omgeving. De intake en het maandelijkse overleg doen we online, of bij ons op kantoor als je dat prettig vindt.`;
  const faq = [
    [`Wat kost een Google Ads specialist in ${c}?`, 'Beheer door een vaste specialist kost vanaf € 199 per maand, inclusief Tag Manager. Het advertentiebudget betaal je rechtstreeks aan Google en er is geen minimumbudget.'],
    [`Moet de specialist in ${c} gevestigd zijn?`, c === 'Groningen' ? 'Dat hoeft niet, maar het kan wel: ons kantoor staat in Groningen.' : `Nee. Google Ads beheer gebeurt online. Wat telt is dat je een vast aanspreekpunt hebt dat je markt in ${c} en omgeving begrijpt.`],
    [`Kunnen jullie alleen in ${c} en omgeving adverteren?`, `Ja. We stellen je campagnes in op ${c}, omliggende plaatsen zoals ${near.slice(0, 3).join(', ')} of een straal rond je vestiging.`],
  ];
  const body = `${pageHero(trail, `Google Ads specialist ${c}. Meer aanvragen uit je bestaande budget.`, `Voor bedrijven in ${c} en omgeving die al adverteren en weten dat er meer in zit. Eén vaste specialist, wekelijks bijgestuurd, vanaf € 199 per maand.`)}
<section class="section"><div class="wrap stack gap-lg">
<div class="stack narrow"><h2>Een Google Ads specialist voor bedrijven in ${c}.</h2><p class="lead" style="max-width:none">Een Google Ads specialist richt je advertentieaccount in en stuurt het bij, zodat je budget gaat naar zoekers die klant kunnen worden. ${local}</p></div>
<div class="grid g2"><div class="card"><h3>Wat de specialist voor je doet</h3>${list(['Je huidige account doorlichten', `Campagnes richten op ${c} en omgeving`, 'Irrelevante zoektermen uitsluiten', 'Tag Manager en conversiemeting inrichten', 'Maandelijks overleg over de cijfers'])}</div>
<div class="card"><h3>Werkgebied rond ${c}</h3><p style="font-size:16px">We stellen je campagnes in op de plaatsen waar je klanten zitten, bijvoorbeeld:</p>${list([c, ...near])}</div></div>
</div></section>
<section class="section alt"><div class="wrap split"><div class="side"><p class="kicker">In het kort</p><h2>De feiten op een rij.</h2></div><dl class="spec main" style="gap:0">${[['Prijs', 'Vanaf € 199 per maand'], ['Inbegrepen', 'Google Tag Manager'], ['Minimumbudget', 'Geen'], ['Opzeggen', 'Per maand'], ['Reactie op je aanvraag', 'Binnen 1 dag']].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></div></section>
${faqBlock(`Vragen over een Google Ads specialist in ${c}.`, faq)}
<section class="section alt"><div class="wrap stack gap-lg"><h2>Ook interessant</h2>${related(['google-ads-specialist', 'google-ads-audit', 'google-ads-kosten', 'google-ads-voor-lokale-dienstverleners'])}
<nav class="chips" aria-label="Andere regio's">${cities.filter(([x]) => x !== c).map(([x]) => `<a href="/google-ads-specialist-${slugify(x)}/">Google Ads specialist ${x}</a>`).join('')}</nav>
${band(`Op zoek naar een Google Ads specialist in ${c}?`)}</div></section>`;
  page({ path, title: `Google Ads specialist ${c}: beheer vanaf € 199 per maand | googleadvertising.nl`, desc: `Google Ads specialist voor bedrijven in ${c} en omgeving. Eén vast aanspreekpunt, wekelijks geoptimaliseerd, geen minimumbudget en maandelijks opzegbaar.`, body, ld: [crumbLd(trail), faqLd(faq)] });
}

// ---------- home ----------
{
  const homeFaq = [
    ['Wat kost Google Ads uitbesteden?', 'Het beheer kost vanaf € 199 per maand, inclusief het inrichten van Google Tag Manager, en is maandelijks opzegbaar. Daarnaast betaal je het advertentiebudget rechtstreeks aan Google.'],
    ['Hoe snel zie ik resultaat van Google Ads?', 'De eerste aanvragen komen meestal binnen 2 tot 4 weken na de start. Binnen een kwartaal werken we toe naar stabiele kosten per aanvraag.'],
    ['Blijft het Google Ads account van mij?', 'Ja. Het account, de campagnes en alle data staan op jouw naam en blijven van jou, ook als je de samenwerking stopt.'],
    ['Kunnen jullie mijn bestaande account overnemen?', 'Ja. Je geeft ons toegang tot je huidige account, wij doen eerst een accountcheck en bouwen verder op wat goed werkt.'],
    ['Hoeveel advertentiebudget heb ik nodig?', 'Dat hangt af van de klikprijzen in jouw branche en hoeveel aanvragen je wilt. Er is geen minimumbudget. In de intake rekenen we door wat voor jouw doel realistisch is.'],
    ['Is Google Ads uitbesteden beter dan zelf doen?', 'Uitbesteden loont als het beheer je meer tijd kost dan je hebt, of als je niet kunt zien welke klikken klant worden. Bij een klein budget en genoeg tijd kun je het prima zelf doen.'],
    ['Wat is het verschil tussen Google Ads en SEO?', 'Met Google Ads betaal je per klik en sta je direct bovenaan. Met SEO betaal je niet per klik, maar duurt het maanden voor je op die posities staat. De twee vullen elkaar aan.'],
    ['Hoe vraag ik een voorstel aan?', 'Vul het aanvraagformulier in. Je kiest wat je wilt uitbesteden en laat je gegevens achter. Je aanvraag gaat als WhatsApp-bericht naar ons en je krijgt binnen 1 dag reactie.'],
  ];
  const svc = [
    ['google-ads-beheer', 'Google Ads beheer', 'Opzet, Tag Manager, wekelijkse optimalisatie en maandelijks overleg met één vaste specialist.', true],
    ['google-ads-laten-maken', 'Google Ads laten maken', 'Een nieuw account of nieuwe campagnes, goed opgezet en daarna aan jou overgedragen.'],
    ['google-ads-audit', 'Google Ads audit', 'Een controle van je account met een lijst verbeterpunten, gerangschikt op wat het meeste oplevert.'],
    ['google-ads-account-overnemen', 'Account overnemen', 'Overstappen van een ander bureau of freelancer, zonder dat je historie of data kwijtraakt.'],
    ['google-ads-specialist', 'Zoekcampagnes', 'Tekstadvertenties op zoekwoorden van mensen die nu een leverancier zoeken.'],
    ['google-shopping-uitbesteden', 'Google Shopping en Performance Max', 'Productfeed, campagnestructuur en sturing op marge voor webshops.'],
    ['youtube-ads-uitbesteden', 'YouTube en Display', 'Video en banners voor bereik en remarketing, gemeten op wat het aan aanvragen toevoegt.'],
    ['conversietracking-google-ads', 'Conversiemeting', 'GA4, Tag Manager en een koppeling met je CRM, zodat Google leert van echte klanten.'],
  ];
  const lb = (title, label, links, two) => `<nav class="linkbox" aria-label="${label}"><h3>${title}</h3><div${two ? ' class="two"' : ''}>${links.map(([t, h]) => `<a href="${h}">${esc(t)}</a>`).join('')}</div></nav>`;
  const body = `<section class="alt hero"><div class="wrap">
<div class="hero-text"><p class="kicker">Google Ads uitbesteden</p>
<h1>Google Ads uitbesteden en meer halen uit hetzelfde budget.</h1>
<p class="lead">Voor bedrijven in heel Nederland die al adverteren en weten dat er meer in zit. Een vaste Google Ads specialist neemt je account over, stopt wat geld kost en bouwt uit wat klanten oplevert.</p>
<div class="actions"><a class="btn btn-lg" href="/aanvragen/">Voorstel aanvragen</a><a class="link-strong" href="tel:${site.phoneHref}">Of bel ${site.phone}</a></div>
<ul class="checks"><li>${check}<span>Het account blijft van jou</span></li><li>${check}<span>Eén vast aanspreekpunt</span></li><li>${check}<span>Wekelijks geoptimaliseerd</span></li><li>${check}<span>Maandelijks opzegbaar</span></li></ul>
${badge}</div>
<div class="hero-card"><div><p class="title">Wat wil je uitbesteden?</p><p class="muted" style="font-size:15px">Kies waar je mee wilt starten. Je aanvraag staat in drie stappen klaar.</p></div>
<div class="stack" style="gap:10px">
<a class="choice" href="/aanvragen/?keuze=volledig"><span>Google Ads volledig uitbesteden</span>${arrow}</a>
<a class="choice" href="/aanvragen/?keuze=overnemen"><span>Bestaand account laten overnemen</span>${arrow}</a>
<a class="choice" href="/aanvragen/?keuze=audit"><span>Mijn account laten checken</span>${arrow}</a>
<a class="choice" href="/aanvragen/?keuze=opzetten"><span>Campagnes laten opzetten</span>${arrow}</a>
</div><p class="small">Je krijgt binnen 1 dag reactie.</p></div>
</div></section>

<section class="facts" aria-label="Kerngegevens"><dl class="wrap">
<div><dt>Eerste aanvragen</dt><dd>Meestal na 2 tot 4 weken</dd></div><div><dt>Optimalisatie</dt><dd>Elke week</dd></div><div><dt>Beheer vanaf</dt><dd>€ 199 per maand</dd></div><div><dt>Bureau</dt><dd>Google Partner, heel Nederland</dd></div>
</dl></section>

<section class="section" id="uitbesteden"><div class="wrap split">
<div class="side"><img class="photo" style="aspect-ratio:4/3;object-position:60% 50%" src="/assets/google-ads-specialist-in-overleg-met-klant.jpg" alt="Google Ads specialist bespreekt de resultaten met een klant aan tafel" width="1600" height="1066"></div>
<div class="main prose"><p class="kicker">In het kort</p><h2 style="margin-top:0">Wat is Google Ads uitbesteden?</h2>
<p class="first">Google Ads uitbesteden betekent dat een specialist je advertentiecampagnes in Google opzet, beheert en verbetert, terwijl jij eigenaar blijft van het account en het budget.</p>
<p>Je betaalt het advertentiebudget rechtstreeks aan Google en een vaste beheerfee aan het bureau. De specialist kiest de zoekwoorden, schrijft de advertenties, sluit irrelevante zoekopdrachten uit en stuurt de biedingen bij op basis van wat er werkelijk binnenkomt.</p>
<p>Het loont zodra je campagnes meer tijd of kennis vragen dan je in huis hebt, of wanneer je wel klikken ziet maar niet weet welke daarvan klant worden.</p></div>
</div></section>

<section class="section alt" id="werkwijze"><div class="wrap stack gap-lg">
<div class="head-row"><div class="stack"><p class="kicker">Werkwijze</p><h2>Van aanvraag naar draaiende campagnes in drie stappen.</h2></div>
<img class="photo" style="object-position:30% 30%" src="/assets/google-ads-specialist-legt-aanpak-uit.jpg" alt="Google Ads specialist legt de aanpak uit op kantoor" width="1800" height="1200" loading="lazy"></div>
<ol class="steps grid g3">
<li class="card"><span class="step-no">Stap 1</span><h3>Intake en accountcheck.</h3><p>We lopen je huidige account door: waar lekt budget weg, welke campagnes leveren klanten op en wat is een realistisch doel. Mkb-bedrijven kunnen na de intake direct aansluiten.</p></li>
<li class="card"><span class="step-no">Stap 2</span><h3>Opzet en meting.</h3><p>Campagnestructuur, zoekwoorden, advertenties en uitsluitingen. De conversiemeting koppelen we aan je formulieren, telefoon en waar mogelijk je CRM.</p></li>
<li class="card"><span class="step-no">Stap 3</span><h3>Wekelijks bijsturen.</h3><p>Je vaste specialist werkt elke week in het account en bespreekt maandelijks met je de aanvragen, de kosten per aanvraag en wat er de komende maand verandert.</p></li>
</ol><div><a class="btn" href="/aanvragen/?keuze=audit">Start met een accountcheck</a></div>
</div></section>

<section class="section" id="diensten"><div class="wrap stack gap-lg">
<div class="stack narrow"><p class="kicker">Diensten</p><h2>Alles uitbesteden of één onderdeel. Allebei kan.</h2><p class="lead">Volledig beheer is de meest gekozen vorm. Heb je zelf een marketeer in huis, dan nemen we alleen het deel over waar specialistische kennis voor nodig is.</p></div>
<div class="grid g4">${svc.map(([s, t, d, f]) => `<a class="card${f ? ' feature' : ''}" href="/${s}/">${f ? '<span class="tag">Meest gekozen</span>' : ''}<h3>${t}</h3><p>${d}</p></a>`).join('')}</div>
</div></section>

<section class="section alt" id="kosten"><div class="wrap split">
<div class="side"><p class="kicker">Kosten</p><h2>Wat kost Google Ads uitbesteden?</h2><p class="muted" style="font-size:18px">Je betaalt twee dingen: het advertentiebudget aan Google en een beheerfee aan ons. Er is geen minimumbudget en opzeggen kan per maand. Mkb-bedrijven kunnen na een intake direct aansluiten.</p><div><a class="link-strong" href="/google-ads-kosten/">Lees alles over Google Ads kosten</a></div>
<img class="photo" style="aspect-ratio:1/1;object-position:50% 100%" src="/assets/google-ads-team-aan-het-werk.jpg" alt="Het Google Ads team aan het werk op kantoor" width="1200" height="1800" loading="lazy"></div>
<div class="main"><div class="table-box"><table><thead><tr><th scope="col">Onderdeel</th><th scope="col">Je betaalt aan</th><th scope="col">Bedrag</th></tr></thead><tbody>
<tr><th scope="row">Advertentiebudget</th><td>Google</td><td>Bepaal je zelf, er is geen minimum</td></tr>
<tr><th scope="row">Maandelijks beheer</th><td>googleadvertising.nl</td><td>Vanaf € 199 per maand, inclusief Tag Manager</td></tr>
<tr><th scope="row">Eenmalige opzet</th><td>googleadvertising.nl</td><td>Staat in je voorstel</td></tr>
<tr><th scope="row">Looptijd</th><td>n.v.t.</td><td>Maandelijks opzegbaar</td></tr>
</tbody></table></div></div>
</div></section>

<section class="section" id="vergelijken"><div class="wrap stack gap-lg">
<div class="stack narrow"><p class="kicker">Zelf doen of uitbesteden</p><h2>Google Ads zelf doen, een freelancer of een bureau?</h2></div>
<div class="table-box"><table class="compare"><thead><tr><td></td><th scope="col">Zelf doen</th><th scope="col">Freelancer</th><th scope="col" class="us">Uitbesteden aan ons</th></tr></thead><tbody>
<tr><th scope="row">Past bij</th><td>Klein budget en tijd om het te leren</td><td>Eén kanaal, weinig afstemming nodig</td><td class="us">Campagnes die aantoonbaar omzet moeten opleveren</td></tr>
<tr><th scope="row">Jouw tijd</th><td>Wekelijks zelf in het account</td><td>Briefen en controleren</td><td class="us">Eén overleg per maand</td></tr>
<tr><th scope="row">Meting</th><td>Vaak alleen klikken en formulieren</td><td>Wisselt per freelancer</td><td class="us">Tot in je CRM: offertes en orders</td></tr>
<tr><th scope="row">Kosten</th><td>Alleen advertentiebudget</td><td>Budget plus uurtarief</td><td class="us">Budget plus vaste fee vanaf € 199 per maand</td></tr>
</tbody></table></div>
<p class="muted">Meer lezen: <a href="/kennisbank/google-ads-zelf-doen-of-uitbesteden/">Google Ads zelf doen of uitbesteden</a> en <a href="/kennisbank/google-ads-freelancer-of-bureau/">freelancer of bureau</a>.</p>
</div></section>

<section class="section dark" id="resultaten"><div class="wrap stack gap-lg">
<div class="stack narrow"><p class="kicker">Resultaten</p><h2>Wat Google Ads uitbesteden opleverde voor onze klanten.</h2></div>
<div class="grid g3">
<article class="card"><p class="who">Mitsubishi Forklift Trucks</p><h3 class="stat">80% lager</h3><p>De kosten per acquisitie daalden met 80 procent.</p></article>
<article class="card"><p class="who">PromoBee</p><h3 class="stat">Bovenaan</h3><p>Zichtbaar op de eerste positie bij zakelijke zoekers.</p></article>
<article class="card"><p class="who">Allround Hekwerk</p><h3 class="stat">Inzicht</h3><p>Per campagne helder wat die aan aanvragen oplevert.</p></article>
</div></div></section>

<section class="section" id="meer"><div class="wrap stack gap-lg">
<div class="split"><div class="side"><h2>Google Ads uitbesteden, laten beheren of laten opzetten door een specialist.</h2></div>
<div class="main muted" style="font-size:17px"><p>Of je nu een <a href="/google-ads-specialist/">Google Ads specialist</a> zoekt voor een eenmalige <a href="/google-ads-audit/">Google Ads audit</a> of een <a href="/google-ads-bureau/">Google Ads bureau</a> voor doorlopend beheer: je werkt met één vast team. We beheren accounts voor <a href="/google-ads-voor-b2b/">B2B-bedrijven</a>, <a href="/google-ads-voor-webshops/">webshops</a> en <a href="/google-ads-voor-mkb/">mkb-bedrijven</a> door heel Nederland.</p>
<p>De meeste bedrijven komen bij ons met een account dat al loopt, maar te weinig oplevert. We <a href="/google-ads-account-overnemen/">nemen het over</a>, je houdt alle historie en we beginnen bij de campagnes waar het meeste te winnen valt. Adverteer je nog niet, dan beginnen we met <a href="/google-ads-laten-maken/">Google Ads laten maken</a>. Twijfel je nog, lees dan eerst wat <a href="/google-ads-kosten/">Google Ads kost</a>.</p></div></div>
<div class="grid g3">
${lb('Diensten', 'Diensten', spokes.filter((s) => s.group === 'dienst').map((s) => [s.name, `/${s.slug}/`]))}
${lb('Voor wie en kennisbank', 'Doelgroepen en kennisbank', [...spokes.filter((s) => s.group === 'voor').map((s) => [s.name, `/${s.slug}/`]), ...articles.map((a) => [a.name, `/kennisbank/${a.slug}/`])])}
${lb('Google Ads specialist per regio', 'Regio', cities.map(([c]) => [c, `/google-ads-specialist-${slugify(c)}/`]), true)}
</div></div></section>

<div class="alt">${faqBlock('Alles wat je wilt weten voor je Google Ads uitbesteedt.', homeFaq)}</div>

<section class="section" id="contact"><div class="wrap"><div class="band">
<img src="/assets/google-ads-specialist-aan-de-telefoon.jpg" alt="Google Ads specialist aan de telefoon op kantoor" width="1100" height="1370" loading="lazy">
<div class="txt"><h2>Klaar om meer uit je Google Ads te halen?</h2><p class="muted" style="font-size:18px">Vraag een voorstel aan of laat eerst je account checken. Je krijgt antwoord van de specialist die ook je campagnes gaat beheren.</p></div>
<div class="act"><a class="btn btn-lg" href="/aanvragen/">Voorstel aanvragen</a><a class="link-strong" href="tel:${site.phoneHref}">Bel ${site.phone}</a></div>
</div></div></section>`;
  page({ path: '/', title: 'Google Ads uitbesteden vanaf € 199 per maand | googleadvertising.nl', desc: 'Google Ads uitbesteden aan een vaste specialist. Wekelijks geoptimaliseerd, Tag Manager inbegrepen, geen minimumbudget en maandelijks opzegbaar. Officieel Google Partner.', body, ld: [{ '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, inLanguage: 'nl' }, faqLd(homeFaq), { '@type': 'Service', name: 'Google Ads uitbesteden', serviceType: 'Google Ads beheer', provider: { '@id': `${site.url}/#organisatie` }, areaServed: { '@type': 'Country', name: 'Nederland' }, offers: { '@type': 'Offer', price: '199', priceCurrency: 'EUR', description: 'Beheer per maand, inclusief Google Tag Manager, maandelijks opzegbaar' } }] });
}

// ---------- aanvragen ----------
{
  const opts = [['volledig', 'Google Ads volledig uitbesteden', 'Opzet, beheer, optimalisatie en overleg.'], ['overnemen', 'Bestaand account overnemen', 'Overstappen met behoud van historie.'], ['audit', 'Accountcheck of audit', 'Weten waar budget weglekt.'], ['opzetten', 'Campagnes laten opzetten', 'Nieuw account of nieuwe campagnes.'], ['shopping', 'Google Shopping en Performance Max', 'Voor webshops.'], ['meting', 'Conversiemeting inrichten', 'GA4, Tag Manager en CRM-koppeling.']];
  const pills = (name, items) => items.map((l) => `<label class="pill"><input type="radio" name="${name}" value="${esc(l)}">${esc(l)}</label>`).join('');
  const body = `<section class="alt"><div class="wrap" style="padding-block:56px 88px"><div class="stack gap-lg">
<div class="stack narrow"><p class="kicker">Voorstel aanvragen</p><h1 style="font-size:clamp(32px,4.4vw,48px)">Haal meer uit je Google Ads.</h1><p class="lead">Drie korte stappen. Je aanvraag gaat rechtstreeks naar onze Google Ads specialisten en verplicht je tot niets.</p></div>
<form class="form-layout" id="aanvraag" data-wa="${site.whatsapp}" novalidate>
<div class="form-main">
<fieldset><legend><span class="tag">Stap 1</span><span class="t">Wat wil je uitbesteden?</span><span class="muted" style="font-size:15px">Meerdere keuzes mogelijk.</span></legend>
<div class="opts">${opts.map(([v, l, d]) => `<label class="opt"><input type="checkbox" name="keuze" value="${esc(l)}" data-key="${v}"><span class="box"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span><b>${l}</b><small>${d}</small></span></label>`).join('')}</div>
<p class="err" data-err="keuze" hidden>Kies minimaal één onderdeel.</p></fieldset>
<fieldset><legend><span class="tag">Stap 2</span><span class="t">Hoe sta je er nu voor?</span></legend>
<div class="stack" style="gap:10px"><p class="q" id="q-account">Heb je al een Google Ads account?</p><div class="pills" role="group" aria-labelledby="q-account">${pills('account', ['Ja, het loopt', 'Ja, maar het staat stil', 'Nee, nog niet'])}</div></div>
<div class="stack" style="gap:10px"><p class="q" id="q-budget">Advertentiebudget per maand <span>(een schatting is genoeg)</span></p><div class="pills" role="group" aria-labelledby="q-budget">${pills('budget', ['Tot € 1.000', '€ 1.000 tot € 2.500', '€ 2.500 tot € 5.000', '€ 5.000 tot € 10.000', 'Meer dan € 10.000', 'Weet ik nog niet'])}</div></div>
<div class="field"><label for="f-site">Website <span>(niet verplicht)</span></label><input id="f-site" name="website" type="text" inputmode="url" autocomplete="url" placeholder="www.jouwbedrijf.nl"></div>
</fieldset>
<fieldset><legend><span class="tag">Stap 3</span><span class="t">Jouw gegevens</span></legend>
<div class="fields">
<div class="field"><label for="f-naam">Naam</label><input id="f-naam" name="naam" type="text" autocomplete="name" required><p class="err" data-err="naam" hidden>Vul je naam in.</p></div>
<div class="field"><label for="f-bedrijf">Bedrijf</label><input id="f-bedrijf" name="bedrijf" type="text" autocomplete="organization" required><p class="err" data-err="bedrijf" hidden>Vul je bedrijfsnaam in.</p></div>
<div class="field"><label for="f-email">E-mail</label><input id="f-email" name="email" type="email" autocomplete="email" required><p class="err" data-err="email" hidden>Vul een geldig e-mailadres in.</p></div>
<div class="field"><label for="f-tel">Telefoonnummer</label><input id="f-tel" name="telefoon" type="tel" autocomplete="tel" required><p class="err" data-err="telefoon" hidden>Vul je telefoonnummer in, dan kunnen we snel reageren.</p></div>
</div>
<div class="field"><label for="f-opm">Opmerking of vraag <span>(niet verplicht)</span></label><textarea id="f-opm" name="opmerking" rows="4"></textarea></div>
</fieldset>
</div>
<aside class="summary" aria-label="Jouw aanvraag"><h2>Jouw aanvraag</h2>
<ul id="sum-keuze"><li class="muted" style="font-weight:400">Nog niets gekozen.</li></ul>
<dl><div><dt>Account</dt><dd id="sum-account">Nog niet gekozen</dd></div><div><dt>Budget per maand</dt><dd id="sum-budget">Nog niet gekozen</dd></div></dl>
<button class="btn btn-lg" type="submit">Aanvraag versturen</button>
<p class="small">Je aanvraag opent als bericht in WhatsApp. Druk daar op verzenden.</p>
<p class="err" id="form-err" hidden>Versturen is niet gelukt. Probeer het opnieuw of bel ${site.phone}.</p>
<p class="small">Je krijgt binnen 1 dag reactie.</p>
${badge}
<div class="sep"><p style="font-weight:600">Liever direct contact?</p><a class="link-strong" href="tel:${site.phoneHref}">Bel ${site.phone}</a></div>
</aside>
</form></div></div></section>`;
  page({ path: '/aanvragen/', title: 'Voorstel aanvragen voor Google Ads | googleadvertising.nl', desc: 'Vraag in drie stappen een voorstel aan voor het uitbesteden van je Google Ads. Je krijgt binnen 1 dag reactie van een specialist.', body, scripts: '<script src="/form.js" defer></script>' });
  page({ path: '/aanvragen/bedankt/', noindex: true, title: 'Aanvraag verstuurd | googleadvertising.nl', desc: 'Je aanvraag is ontvangen.', body: `<section class="alt"><div class="wrap" style="padding-block:56px 88px"><div class="done" role="status"><h1 style="font-size:clamp(30px,4vw,40px)">Bijna geregeld.</h1><p class="lead">Je aanvraag staat als bericht klaar in WhatsApp. Druk daar op verzenden, dan neemt een specialist binnen 1 dag contact met je op om een intake in te plannen.</p><ol class="muted" style="padding-left:20px;display:flex;flex-direction:column;gap:6px"><li>Aanvraag: je verstuurt het WhatsApp-bericht.</li><li>Intake en accountcheck: we kijken in je account of naar je markt.</li><li>Voorstel: je ontvangt aanpak, budgetadvies en prijs.</li></ol><div class="actions"><a class="link-strong" href="/">Terug naar home</a><a class="link-strong" href="tel:${site.phoneHref}">Bel ${site.phone}</a></div></div></div></section>` });
}

// ---------- statische bestanden ----------
cpSync('src/styles.css', join(OUT, 'styles.css'));
cpSync('src/form.js', join(OUT, 'form.js'));
cpSync('public', OUT, { recursive: true });
const all = pages.sort((a, b) => a.length - b.length || a.localeCompare(b));
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${all.map((p) => `<url><loc>${site.url}${p}</loc><lastmod>${site.updated}</lastmod></url>`).join('\n')}\n</urlset>\n`);

// llms.txt wordt uit de inhoud opgebouwd, zodat het altijd klopt met de site
const L = (t, p, d) => `- [${t}](${site.url}${p})${d ? `: ${d}` : ''}`;
writeFileSync(join(OUT, 'llms.txt'), `${readFileSync('src/llms-intro.md', 'utf8').trim()}

## Hoofdpagina's

${L('Google Ads uitbesteden', '/', 'wat het is, werkwijze in drie stappen, kosten, vergelijking zelf doen/freelancer/bureau en veelgestelde vragen')}
${L('Voorstel aanvragen', '/aanvragen/', 'aanvraagformulier in drie stappen')}

## Diensten

${spokes.filter((s) => s.group === 'dienst').map((s) => L(s.name, `/${s.slug}/`, s.def)).join('\n')}

## Voor wie

${spokes.filter((s) => s.group === 'voor').map((s) => L(s.name, `/${s.slug}/`, s.def)).join('\n')}

## Kennisbank

${articles.map((a) => L(a.name, `/kennisbank/${a.slug}/`, a.answer)).join('\n')}

## Optional

${cities.map(([c]) => L(`Google Ads specialist ${c}`, `/google-ads-specialist-${slugify(c)}/`)).join('\n')}
`);
if (!site.whatsapp) console.warn('LET OP: site.whatsapp is leeg in content.mjs; het aanvraagformulier kan nog niets versturen.');
console.log(`Klaar: ${all.length} pagina's in ./${OUT}`);
