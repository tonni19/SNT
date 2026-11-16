/* Behaviour shared by every page: header, phone menu, Motion switch,
   videos that play only when on screen (and only with Motion on), copy buttons. */
const root = document.documentElement;
const motionOn = () => root.dataset.fx !== 'off';

// ---- header: solid once you leave the hero, hides while scrolling down
const bar = document.getElementById('bar');
if (bar) {
  const isHome = !!document.querySelector('.hero');
  let last = scrollY;
  const tick = () => {
    const y = scrollY;
    bar.classList.toggle('is-solid', !isHome || y > innerHeight * 0.85);
    bar.classList.toggle('is-hidden', y > 240 && y > last + 2);
    if (y < last - 2) bar.classList.remove('is-hidden');
    last = y;
  };
  addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true });
  tick();
}

// ---- Motion switch: saved per visitor; the page reloads so every scene sets itself up cleanly
const motionBtn = document.getElementById('motionBtn');
if (motionBtn) {
  motionBtn.setAttribute('aria-pressed', String(motionOn()));
  motionBtn.setAttribute('aria-label', motionOn() ? 'Motion is on. Turn scroll animation off' : 'Motion is off. Turn scroll animation on');
  motionBtn.addEventListener('click', () => {
    const next = motionOn() ? 'off' : 'on';
    try { localStorage.setItem('snt-motion', next); } catch { /* storage blocked */ }
    root.dataset.fx = next;
    location.reload();
  });
}

// ---- phone menu
const sheet = document.getElementById('sheet');
const menuBtn = document.getElementById('menuBtn');
if (sheet && menuBtn) {
  const open = (v) => { sheet.hidden = !v; menuBtn.setAttribute('aria-expanded', String(v)); document.body.style.overflow = v ? 'hidden' : ''; if (v) sheet.querySelector('a')?.focus(); };
  menuBtn.addEventListener('click', () => open(true));
  document.getElementById('sheetClose')?.addEventListener('click', () => open(false));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) open(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !sheet.hidden) { open(false); menuBtn.focus(); } });
}

// ---- videos: play while on screen, only with Motion on
const vids = [...document.querySelectorAll('video[data-autoplay]')];
if (vids.length && motionOn() && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())), { threshold: 0.1 });
  vids.forEach((v) => io.observe(v));
}

// ---- copy-to-clipboard buttons: <button data-copy="text">
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  const label = btn.querySelector('span');
  const before = label ? label.textContent : '';
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    btn.classList.add('is-copied');
    if (label) label.textContent = 'Copied';
  } catch {
    if (label) label.textContent = 'Copy failed: select it from the page';
  }
  setTimeout(() => { btn.classList.remove('is-copied'); if (label) label.textContent = before; }, 1800);
});
