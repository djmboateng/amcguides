// Quick intro loading screen, shown once per visit (first page opened in the tab).
(function () {
  var seen = false;
  try { seen = !!sessionStorage.getItem('dbSeen'); sessionStorage.setItem('dbSeen', '1'); } catch (e) {}
  if (seen) { document.documentElement.classList.add('seen'); return; }
  var start = Date.now();
  function hide() {
    var el = document.getElementById('loader');
    if (!el) return;
    setTimeout(function () { el.classList.add('done'); }, Math.max(0, 900 - (Date.now() - start)));
  }
  window.addEventListener('load', hide);
  setTimeout(hide, 2500); // never hold the page longer than this
})();

// Discourage saving images: no right-click menu or dragging on any image.
document.addEventListener('contextmenu', function (e) { if (e.target.tagName === 'IMG') e.preventDefault(); });
document.addEventListener('dragstart', function (e) { if (e.target.tagName === 'IMG') e.preventDefault(); });

// Mobile menu: the button opens and closes the page links; tapping outside or pressing Escape closes them.
function setMenu(open) {
  var nav = document.querySelector('.nav'), btn = document.querySelector('.menu-btn');
  if (!nav || !btn) return;
  nav.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
document.addEventListener('click', function (e) {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  if (e.target.closest('.menu-btn')) setMenu(!nav.classList.contains('open'));
  else if (!e.target.closest('.nav')) setMenu(false);
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

// Homepage mixer tilts slightly toward the mouse (desktop only, skipped when reduced motion is on).
document.addEventListener('DOMContentLoaded', function () {
  var shot = document.querySelector('.hero-shot'), art = document.querySelector('.mixer-art');
  if (!shot || !art || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  shot.addEventListener('mousemove', function (e) {
    var r = shot.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    art.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg');
    art.style.setProperty('--rx', (y * -10).toFixed(2) + 'deg');
  });
  shot.addEventListener('mouseleave', function () { art.style.setProperty('--ry', '0deg'); art.style.setProperty('--rx', '0deg'); });
});

// Basic Features: reveal the cards and count the numbers up the first time they scroll into view.
document.addEventListener('DOMContentLoaded', function () {
  var box = document.querySelector('.features');
  if (!box || !('IntersectionObserver' in window)) return;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  box.classList.add('reveal');
  new IntersectionObserver(function (entries, obs) {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    box.classList.add('in');
    if (still) return;
    box.querySelectorAll('[data-count]').forEach(function (el, i) {
      var end = +el.getAttribute('data-count'), t0 = null, delay = i * 110;
      el.textContent = '0';
      function tick(t) {
        if (t0 === null) t0 = t + delay;
        var p = Math.min(1, Math.max(0, (t - t0) / 900));
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.3 }).observe(box);
});
