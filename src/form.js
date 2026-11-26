// Aanvraagformulier: samenvatting bijwerken, controleren en versturen.
(function () {
  var form = document.getElementById('aanvraag');
  if (!form) return;
  var q = function (s) { return Array.prototype.slice.call(form.querySelectorAll(s)); };
  var pre = new URLSearchParams(location.search).get('keuze');
  if (pre) q('input[name="keuze"]').forEach(function (i) { if (i.dataset.key === pre) i.checked = true; });

  function picked(name) { var i = form.querySelector('input[name="' + name + '"]:checked'); return i ? i.value : ''; }
  function summary() {
    var ul = document.getElementById('sum-keuze');
    var k = q('input[name="keuze"]:checked').map(function (i) { return i.value; });
    ul.textContent = '';
    (k.length ? k : ['Nog niets gekozen.']).forEach(function (t) {
      var li = document.createElement('li'); li.textContent = t;
      if (!k.length) { li.className = 'muted'; li.style.fontWeight = '400'; }
      ul.appendChild(li);
    });
    document.getElementById('sum-account').textContent = picked('account') || 'Nog niet gekozen';
    document.getElementById('sum-budget').textContent = picked('budget') || 'Nog niet gekozen';
  }
  function show(name, on) { var e = form.querySelector('[data-err="' + name + '"]'); if (e) e.hidden = !on; }
  form.addEventListener('change', function () { summary(); show('keuze', false); });
  form.addEventListener('input', function (e) { if (e.target.name) show(e.target.name, false); });
  summary();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var keuze = d.getAll('keuze');
    var err = {
      keuze: keuze.length === 0,
      naam: !String(d.get('naam')).trim(),
      bedrijf: !String(d.get('bedrijf')).trim(),
      email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(d.get('email')).trim()),
      telefoon: String(d.get('telefoon')).replace(/\D/g, '').length < 8
    };
    var bad = false;
    Object.keys(err).forEach(function (k) { show(k, err[k]); if (err[k]) bad = true; });
    if (bad) { var first = form.querySelector('.err:not([hidden])'); if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var wa = (form.dataset.wa || '').replace(/\D/g, '');
    if (!wa) { document.getElementById('form-err').hidden = false; return; }
    var val = function (k) { return String(d.get(k) || '').trim(); };
    var lines = ['Nieuwe aanvraag via googleadvertising.nl', '', 'Wil uitbesteden: ' + keuze.join(', ')];
    if (val('account')) lines.push('Google Ads account: ' + val('account'));
    if (val('budget')) lines.push('Budget per maand: ' + val('budget'));
    if (val('website')) lines.push('Website: ' + val('website'));
    lines.push('', 'Naam: ' + val('naam'), 'Bedrijf: ' + val('bedrijf'), 'E-mail: ' + val('email'), 'Telefoon: ' + val('telefoon'));
    if (val('opmerking')) lines.push('', 'Opmerking: ' + val('opmerking'));
    window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    location.href = '/aanvragen/bedankt/?via=aanvraag';
  });
})();

// Gratis accountcheck: los, kort formulier met dezelfde WhatsApp-afhandeling.
(function () {
  var form = document.getElementById('accountcheck');
  if (!form) return;
  form.addEventListener('input', function (e) {
    if (!e.target.name) return;
    var el = form.querySelector('[data-err="' + e.target.name + '"]');
    if (el) el.hidden = true;
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    if (String(d.get('bedrijfsnaam2') || '').trim()) return; // honeypot
    var err = {
      naam: !String(d.get('naam')).trim(),
      email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(d.get('email')).trim()),
      website: !String(d.get('website')).trim()
    };
    var bad = false;
    Object.keys(err).forEach(function (k) {
      var el = form.querySelector('[data-err="' + k + '"]');
      if (el) el.hidden = !err[k];
      if (err[k]) bad = true;
    });
    if (bad) { var first = form.querySelector('.err:not([hidden])'); if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    var wa = (form.dataset.wa || '').replace(/\D/g, '');
    if (!wa) { document.getElementById('form-err').hidden = false; return; }
    var val = function (k) { return String(d.get(k) || '').trim(); };
    var lines = ['Nieuwe accountcheck-aanvraag via googleadvertising.nl', '', 'Naam: ' + val('naam'), 'E-mail: ' + val('email'), 'Website: ' + val('website')];
    window.open('https://wa.me/' + wa + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    location.href = '/aanvragen/bedankt/?via=accountcheck';
  });
})();
