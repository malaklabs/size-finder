/*!
 * Size Finder Widget v1.0.0
 * Drop-in clothing size recommender. No dependencies.
 * MIT License · Built by Malak Labs (instagram.com/malak_labs)
 */
(function () {
  'use strict';

  var I18N = {
    en: {
      title: 'Find your size', sub: 'Tell us a bit about you. Takes 5 seconds.',
      height: 'Height', weight: 'Weight', fit: 'How do you like it to fit?',
      fits: ['Slim', 'Regular', 'Loose'], result: 'Your size',
      note: function (f) { return 'Best match for a ' + f.toLowerCase() + ' fit.'; },
      between: function (a, b) { return 'You are between ' + a + ' and ' + b + '. Take ' + b + ' for more room.'; },
      open: 'Find my size', close: 'Close', apply: 'Select this size', cm: 'cm', kg: 'kg'
    },
    fr: {
      title: 'Trouvez votre taille', sub: 'Quelques infos, 5 secondes.',
      height: 'Taille', weight: 'Poids', fit: 'Quelle coupe préférez-vous ?',
      fits: ['Ajustée', 'Normale', 'Ample'], result: 'Votre taille',
      note: function (f) { return 'Idéale pour une coupe ' + f.toLowerCase() + '.'; },
      between: function (a, b) { return 'Vous êtes entre ' + a + ' et ' + b + '. Prenez ' + b + ' pour plus d’aisance.'; },
      open: 'Trouver ma taille', close: 'Fermer', apply: 'Choisir cette taille', cm: 'cm', kg: 'kg'
    },
    ar: {
      title: 'اعرف مقاسك', sub: 'معلومات بسيطة، 5 ثوانٍ فقط.',
      height: 'الطول', weight: 'الوزن', fit: 'كيف تفضّل القصّة؟',
      fits: ['ضيّقة', 'عادية', 'واسعة'], result: 'مقاسك',
      note: function (f) { return 'الأنسب لقصّة ' + f + '.'; },
      between: function (a, b) { return 'أنت بين ' + a + ' و ' + b + '. اختر ' + b + ' لراحة أكثر.'; },
      open: 'اعرف مقاسي', close: 'إغلاق', apply: 'اختر هذا المقاس', cm: 'سم', kg: 'كغ'
    }
  };

  var DEFAULT_CHART = [
    { size: 'XS',  height: [150, 165], weight: [40, 52] },
    { size: 'S',   height: [158, 172], weight: [50, 62] },
    { size: 'M',   height: [165, 180], weight: [60, 74] },
    { size: 'L',   height: [172, 186], weight: [72, 86] },
    { size: 'XL',  height: [178, 192], weight: [84, 100] },
    { size: 'XXL', height: [182, 200], weight: [98, 130] }
  ];

  // 0 at the centre of a range, 0.25 at its edges, grows outside it.
  function dist(v, r) {
    var span = Math.max(1, r[1] - r[0]);
    if (v < r[0]) return 0.25 + (r[0] - v) / span;
    if (v > r[1]) return 0.25 + (v - r[1]) / span;
    return Math.abs(v - (r[0] + r[1]) / 2) / span * 0.5;
  }

  /**
   * recommend(chart, heightCm, weightKg, fit) -> { size, index, between }
   * fit: -1 slim, 0 regular, 1 loose
   */
  function recommend(chart, h, w, fit) {
    var scored = chart.map(function (s, i) {
      return { i: i, score: dist(h, s.height) * 0.4 + dist(w, s.weight) * 0.6 };
    }).sort(function (a, b) { return a.score - b.score; });
    var best = scored[0], second = scored[1];
    var idx = Math.max(0, Math.min(chart.length - 1, best.i + (fit || 0)));
    var between = null;
    if (!fit && second && Math.abs(second.i - best.i) === 1 && second.score - best.score < 0.04) {
      var lo = Math.min(best.i, second.i), hi = Math.max(best.i, second.i);
      between = [chart[lo].size, chart[hi].size];
    }
    return { size: chart[idx].size, index: idx, between: between };
  }

  var CSS = '\
:host{--sf-accent:#111;--sf-bg:#fff;--sf-ink:#111;--sf-muted:#77736c;--sf-tile:#f1eee9;--sf-radius:20px;\
font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--sf-ink);display:block}\
*{box-sizing:border-box}\
.card{background:var(--sf-bg);border-radius:var(--sf-radius);padding:28px;max-width:420px;width:100%}\
h3{margin:0;font-size:24px;font-weight:600;letter-spacing:-.03em}\
.sub{margin:6px 0 0;font-size:14px;color:var(--sf-muted)}\
.row{margin-top:22px}\
.lab{display:flex;justify-content:space-between;font-size:14px;margin-bottom:10px}\
.lab b{font-weight:600;font-variant-numeric:tabular-nums}\
input[type=range]{width:100%;accent-color:var(--sf-accent);margin:0;cursor:pointer}\
.fit{display:flex;gap:6px;margin-top:10px}\
.fit button{all:unset;cursor:pointer;flex:1;text-align:center;padding:11px 0;border-radius:12px;background:var(--sf-tile);font-size:14px;transition:background .2s,color .2s}\
.fit button[aria-pressed=true]{background:var(--sf-accent);color:#fff}\
.fit button:focus-visible,.cta:focus-visible,.open:focus-visible,.x:focus-visible{outline:2px solid var(--sf-accent);outline-offset:2px}\
.out{display:flex;align-items:center;gap:18px;margin-top:24px;padding:18px 20px;border-radius:16px;background:var(--sf-tile)}\
.out small{display:block;font-size:12px;color:var(--sf-muted);margin-bottom:2px}\
.big{font-size:52px;font-weight:700;letter-spacing:-.05em;line-height:1;min-width:64px;transition:transform .35s cubic-bezier(.2,.8,.2,1)}\
.big.pop{transform:scale(1.18)}\
.out p{margin:0;font-size:14px;line-height:1.4;color:var(--sf-muted)}\
.cta{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:block;text-align:center;margin-top:14px;padding:15px;border-radius:999px;background:var(--sf-accent);color:#fff;font-size:15px;font-weight:500}\
.open{all:unset;cursor:pointer;font-size:14px;text-decoration:underline;text-underline-offset:3px}\
.ov{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;pointer-events:none;transition:opacity .25s}\
.ov.on{opacity:1;pointer-events:auto}\
.ov .card{position:relative;transform:translateY(16px);transition:transform .35s cubic-bezier(.2,.8,.2,1);box-shadow:0 30px 80px rgba(0,0,0,.25)}\
.ov.on .card{transform:none}\
.x{all:unset;cursor:pointer;position:absolute;top:18px;inset-inline-end:18px;width:32px;height:32px;border-radius:50%;background:var(--sf-tile);text-align:center;line-height:32px;font-size:18px}\
@media(prefers-reduced-motion:reduce){.big,.ov,.ov .card{transition:none}}';

  function parseChart(el) {
    var src = el.getAttribute('chart-src');
    var raw = src ? (document.getElementById(src) || {}).textContent : el.getAttribute('chart');
    if (!raw) return DEFAULT_CHART;
    try {
      var c = JSON.parse(raw);
      if (Array.isArray(c) && c.length) return c;
    } catch (e) { console.warn('[size-finder] invalid chart JSON, using default', e); }
    return DEFAULT_CHART;
  }

  class SizeFinder extends HTMLElement {
    static get observedAttributes() { return ['lang', 'accent', 'mode', 'chart']; }
  }

  SizeFinder.prototype.connectedCallback = function () {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.state = this.state || { h: 170, w: 65, fit: 0 };
    this.render();
  };
  SizeFinder.prototype.attributeChangedCallback = function () {
    if (this.shadowRoot) this.render();
  };

  SizeFinder.prototype.render = function () {
    var self = this, root = this.shadowRoot;
    var lang = (this.getAttribute('lang') || 'en').slice(0, 2);
    var t = I18N[lang] || I18N.en;
    var rtl = lang === 'ar';
    this.chart = parseChart(this);
    var accent = this.getAttribute('accent');
    if (accent) this.style.setProperty('--sf-accent', accent);
    var popup = this.getAttribute('mode') === 'button';
    var s = this.state;

    var card =
      '<div class="card" dir="' + (rtl ? 'rtl' : 'ltr') + '"' + (popup ? ' role="dialog" aria-modal="true" aria-labelledby="t"' : '') + '>' +
        (popup ? '<button class="x" aria-label="' + t.close + '">×</button>' : '') +
        '<h3 id="t">' + t.title + '</h3><p class="sub">' + t.sub + '</p>' +
        '<div class="row"><div class="lab"><span>' + t.height + '</span><b id="hv"></b></div>' +
          '<input type="range" id="h" min="140" max="210" value="' + s.h + '" aria-label="' + t.height + '"></div>' +
        '<div class="row"><div class="lab"><span>' + t.weight + '</span><b id="wv"></b></div>' +
          '<input type="range" id="w" min="35" max="150" value="' + s.w + '" aria-label="' + t.weight + '"></div>' +
        '<div class="row"><div class="lab"><span>' + t.fit + '</span></div><div class="fit">' +
          t.fits.map(function (f, i) { return '<button data-f="' + (i - 1) + '" aria-pressed="' + (s.fit === i - 1) + '">' + f + '</button>'; }).join('') +
        '</div></div>' +
        '<div class="out" aria-live="polite"><div><small>' + t.result + '</small><div class="big" id="r">–</div></div><p id="n"></p></div>' +
        '<button class="cta" id="apply">' + t.apply + '</button>' +
      '</div>';

    root.innerHTML = '<style>' + CSS + '</style>' +
      (popup ? '<button class="open" id="open">' + t.open + '</button><div class="ov" id="ov">' + card + '</div>' : card);

    var $ = function (id) { return root.getElementById(id); };
    var last = null;

    function update() {
      s.h = +$('h').value; s.w = +$('w').value;
      $('hv').textContent = s.h + ' ' + t.cm;
      $('wv').textContent = s.w + ' ' + t.kg;
      var r = recommend(self.chart, s.h, s.w, s.fit);
      self.result = r;
      var big = $('r');
      if (r.size !== last) {
        big.textContent = r.size;
        big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop');
        setTimeout(function () { big.classList.remove('pop'); }, 350);
        last = r.size;
      }
      $('n').textContent = r.between ? t.between(r.between[0], r.between[1]) : t.note(t.fits[s.fit + 1]);
    }

    $('h').oninput = update;
    $('w').oninput = update;
    root.querySelectorAll('.fit button').forEach(function (b) {
      b.onclick = function () {
        s.fit = +b.getAttribute('data-f');
        root.querySelectorAll('.fit button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        update();
      };
    });

    function close() { var ov = $('ov'); if (ov) ov.classList.remove('on'); }
    $('apply').onclick = function () {
      var size = self.result.size;
      var target = self.getAttribute('target');
      if (target) {
        var el = document.querySelector(target);
        if (el && 'value' in el) { el.value = size; el.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      self.dispatchEvent(new CustomEvent('size-selected', { detail: { size: size, height: s.h, weight: s.w, fit: s.fit }, bubbles: true, composed: true }));
      close();
    };
    if (popup) {
      $('open').onclick = function () { $('ov').classList.add('on'); $('h').focus(); };
      root.querySelector('.x').onclick = close;
      $('ov').onclick = function (e) { if (e.target === $('ov')) close(); };
      root.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    }
    update();
  };

  if (!customElements.get('size-finder')) customElements.define('size-finder', SizeFinder);
  window.SizeFinder = { recommend: recommend, defaultChart: DEFAULT_CHART, i18n: I18N };
})();
