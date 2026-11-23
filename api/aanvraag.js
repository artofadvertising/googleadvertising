// Vercel-functie: mailt een aanvraag via Resend naar MAIL_TO.
// Omgevingsvariabelen in Vercel: RESEND_API_KEY (verplicht), MAIL_TO, MAIL_FROM.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clean = (s, n = 500) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body || {};
  const wantsJson = (req.headers.accept || '').includes('application/json');
  const done = () => (wantsJson ? res.status(200).json({ ok: true }) : res.redirect(303, '/aanvragen/bedankt/'));
  if (b.fax) return done(); // honeypot: bots vullen dit verborgen veld in

  const keuze = [].concat(b.keuze || []).map((k) => clean(k, 80)).slice(0, 10);
  const naam = clean(b.naam, 120), bedrijf = clean(b.bedrijf, 160), email = clean(b.email, 200), telefoon = clean(b.telefoon, 40);
  if (!naam || !bedrijf || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || telefoon.replace(/\D/g, '').length < 8 || !keuze.length) {
    return res.status(400).json({ ok: false, error: 'Vul alle verplichte velden in.' });
  }
  const rows = [['Wil uitbesteden', keuze.join(', ')], ['Google Ads account', clean(b.account, 60) || 'niet ingevuld'], ['Budget per maand', clean(b.budget, 60) || 'niet ingevuld'], ['Website', clean(b.website, 200) || 'niet ingevuld'], ['Naam', naam], ['Bedrijf', bedrijf], ['E-mail', email], ['Telefoon', telefoon], ['Opmerking', String(b.opmerking ?? '').trim().slice(0, 4000) || 'geen']];
  const html = `<h2>Nieuwe aanvraag via googleadvertising.nl</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;

  if (!process.env.RESEND_API_KEY) { console.error('RESEND_API_KEY ontbreekt'); return res.status(500).json({ ok: false }); }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'googleadvertising.nl <aanvraag@googleadvertising.nl>',
      to: [process.env.MAIL_TO || 'info@artofadvertising.nl'],
      reply_to: email,
      subject: `Google Ads aanvraag: ${bedrijf} (${naam})`,
      html,
    }),
  });
  if (!r.ok) { console.error('Resend', r.status, await r.text()); return res.status(502).json({ ok: false }); }
  return done();
}
