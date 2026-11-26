/* Cookievenster en Google Consent Mode v2 voor googleadvertising.nl.
   De standaardstatus (alles geweigerd) staat inline in de <head>, vóór Google Tag Manager.
   Dit bestand toont het venster (hoofdlaag en voorkeurenlaag), bewaart de keuze een jaar
   per categorie en geeft de keuze door aan Google en aan de dataLayer. */
(function () {
  var KEY = 'gadv_consent';
  var DAYS = 365;
  var root = document.getElementById('cookie');
  if (!root) return;

  var dialog = root.querySelector('.cookie-dialog');
  var views = { main: root.querySelector('[data-view="main"]'), prefs: root.querySelector('[data-view="prefs"]') };
  var boxAnalytics = root.querySelector('#c-analytics');
  var boxMarketing = root.querySelector('#c-marketing');
  var lastFocus = null;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (!v || !v.t || Date.now() - v.t > DAYS * 864e5) return null;
      // Oud formaat (tot 12 november 2026): { granted: true/false }
      if (typeof v.analytics !== 'boolean') v.analytics = !!v.granted;
      if (typeof v.marketing !== 'boolean') v.marketing = !!v.granted;
      return v;
    } catch (e) { return null; }
  }
  function write(analytics, marketing) {
    try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), analytics: !!analytics, marketing: !!marketing })); } catch (e) {}
  }
  function apply(analytics, marketing) {
    var a = analytics ? 'granted' : 'denied';
    var m = marketing ? 'granted' : 'denied';
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m });
    }
    window.dataLayer.push({ event: 'consent_update', consent_analytics: !!analytics, consent_marketing: !!marketing });
  }

  function showView(name) {
    views.main.hidden = name !== 'main';
    views.prefs.hidden = name !== 'prefs';
    var first = views[name].querySelector('.btn') || views[name].querySelector('button, input:not([disabled]), a');
    if (first) first.focus({ preventScroll: true });
  }
  function open(view) {
    var saved = read();
    boxAnalytics.checked = !!(saved && saved.analytics);
    boxMarketing.checked = !!(saved && saved.marketing);
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('cookie-open');
    showView(view || 'main');
  }
  function close() {
    root.hidden = true;
    document.documentElement.classList.remove('cookie-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function decide(analytics, marketing) {
    write(analytics, marketing);
    apply(analytics, marketing);
    close();
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-consent], [data-consent-view]');
    if (!el) return;
    e.preventDefault();
    var view = el.getAttribute('data-consent-view');
    if (view) { showView(view); return; }
    switch (el.getAttribute('data-consent')) {
      case 'accept-all': decide(true, true); break;
      case 'reject': decide(false, false); break;
      case 'save': decide(boxAnalytics.checked, boxMarketing.checked); break;
    }
  });

  // Toetsenbord: Tab blijft binnen het venster; Escape sluit alleen als er al een keuze is opgeslagen.
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && read()) { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var items = dialog.querySelectorAll('button:not([hidden]), input:not([disabled]), a[href]');
    var list = [];
    for (var i = 0; i < items.length; i++) { if (items[i].offsetParent !== null) list.push(items[i]); }
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('click', function (e) {
    var l = e.target.closest('[data-cookie-settings]');
    if (!l) return;
    e.preventDefault();
    open('prefs');
  });

  if (!read()) open('main');
})();
