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
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Bezig met versturen';
    var body = {}; d.forEach(function (v, k) { if (k !== 'keuze') body[k] = v; }); body.keuze = keuze;
    fetch('/api/aanvraag', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error(); location.href = '/aanvragen/bedankt/'; })
      .catch(function () { btn.disabled = false; btn.textContent = 'Aanvraag versturen'; document.getElementById('form-err').hidden = false; });
  });
})();
