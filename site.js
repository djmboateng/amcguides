// The mixer library. To add a mixer, add an entry here, for example:
// {
//   title: 'Yamaha MG16XU',
//   url: 'mixers/mg16xu/index.html',
//   image: 'assets/mg16xu-top.png',
//   access: 'Free',              // 'Free' or 'Premium'
//   description: 'Every control on the MG16XU, plus the basic operations to run a mix.',
//   tags: ['16 channels', 'USB', 'Effects'],
//   meta: 'Guide · interactive',
// },
const MIXERS = [];

const grid = document.getElementById('grid');
const search = document.getElementById('search');
const chipsEl = document.getElementById('chips');
const countEl = document.getElementById('count');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
let activeTag = 'All';

const filters = ['All', 'Free', 'Premium', ...new Set(MIXERS.flatMap(m => m.tags))];
chipsEl.innerHTML = filters.map(t => `<button class="chip${t === activeTag ? ' on' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('');
chipsEl.addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  activeTag = b.dataset.tag;
  chipsEl.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === b));
  render();
});
search.addEventListener('input', render);

function render() {
  const q = search.value.trim().toLowerCase();
  const list = MIXERS.filter(m =>
    (activeTag === 'All' || m.access === activeTag || m.tags.includes(activeTag)) &&
    (!q || [m.title, m.description, m.meta, m.access, ...m.tags].join(' ').toLowerCase().includes(q)));
  countEl.textContent = `${list.length} of ${MIXERS.length} mixer${MIXERS.length === 1 ? '' : 's'}`;
  if (!MIXERS.length) {
    grid.innerHTML = `<div class="empty"><b>No mixers yet</b>The free Yamaha MG16XU guide is in the works and will be the first one here.</div>`;
    return;
  }
  grid.innerHTML = list.length ? list.map(m => `
    <article class="mixer">
      <a class="shot" href="${esc(m.url)}" aria-label="Open ${esc(m.title)}">
        <img src="${esc(m.image)}" alt="" loading="lazy" />
        <span class="pill${m.access === 'Free' ? ' blue' : ''}">${esc(m.access)}</span>
      </a>
      <div class="mixer-body">
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.description)}</p>
        <div class="tags">${m.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="mixer-foot"><small>${esc(m.meta)}</small><a class="btn small" href="${esc(m.url)}">Open</a></div>
      </div>
    </article>`).join('') : `<div class="empty"><b>No mixers found</b>Try a different search, or <a href="#" id="clearSearch">show everything</a>.</div>`;
  document.getElementById('clearSearch')?.addEventListener('click', e => {
    e.preventDefault(); search.value = ''; activeTag = 'All';
    chipsEl.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.tag === 'All')); render(); search.focus();
  });
}
render();
