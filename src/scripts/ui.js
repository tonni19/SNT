/* Behaviour shared by every page: header, Motion and Day/Night switches,
   phone menu, videos that play only when on screen (and only with Motion on),
   copy buttons. */
const root = document.documentElement;
const motionOn = () => root.dataset.fx !== 'off';

// ---- header: solid as soon as anything scrolls under it; slides away while you
// scroll down and comes straight back the moment you scroll up.
const bar = document.getElementById('bar');
if (bar) {
  const isHome = !!document.querySelector('.hero');
  let last = Math.max(0, scrollY);
  const tick = () => {
    const y = Math.max(0, scrollY);
    bar.classList.toggle('is-solid', !isHome || y > 8);
    if (y < 240 || y < last - 2) bar.classList.remove('is-hidden');
    else if (y > last + 2) bar.classList.add('is-hidden');
    last = y;
  };
  addEventListener('scroll', () => requestAnimationFrame(tick), { passive: true });
  tick();
}

// ---- videos: play while on screen, only with Motion on
const vids = [...document.querySelectorAll('video[data-autoplay]')];
let io = null;
const syncVideos = () => {
  if (!vids.length || !('IntersectionObserver' in window)) return;
  if (motionOn() && !io) {
    io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())), { threshold: 0.1 });
    vids.forEach((v) => io.observe(v));
  } else if (!motionOn() && io) {
    io.disconnect();
    io = null;
    vids.forEach((v) => v.pause());
  }
};
syncVideos();

// ---- Motion switch: saved per visitor and applied live, no reload
const motionBtns = [...document.querySelectorAll('[data-motion-toggle]')];
const syncMotion = () => motionBtns.forEach((btn) => {
  btn.setAttribute('aria-pressed', String(motionOn()));
  btn.setAttribute('aria-label', motionOn() ? 'Motion is on. Turn scroll animation off' : 'Motion is off. Turn scroll animation on');
});
syncMotion();
motionBtns.forEach((btn) => btn.addEventListener('click', () => {
  const next = motionOn() ? 'off' : 'on';
  try { localStorage.setItem('snt-motion', next); } catch { /* storage blocked */ }
  root.dataset.fx = next;
  window.sntMotion?.set(next === 'on');
  syncMotion();
  syncVideos();
}));

// ---- Day / Night: saved per visitor, set before first paint by the inline script in Base.astro.
// With Motion on, the new theme spreads out in a circle from the switch you pressed.
const themeBtns = [...document.querySelectorAll('[data-theme-toggle]')];
const themeNow = () => (root.dataset.theme === 'night' ? 'night' : 'day');
const syncTheme = () => themeBtns.forEach((btn) => {
  const t = themeNow();
  btn.setAttribute('aria-pressed', String(t === 'night'));
  btn.setAttribute('aria-label', `Theme is ${t}. Switch to ${t === 'night' ? 'day' : 'night'}`);
});
syncTheme();
themeBtns.forEach((btn) => btn.addEventListener('click', () => {
  const next = themeNow() === 'night' ? 'day' : 'night';
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem('snt-theme', next); } catch { /* storage blocked */ }
    syncTheme();
  };
  if (!motionOn() || !document.startViewTransition) { apply(); return; }
  const r = btn.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 750, easing: 'cubic-bezier(.16, 1, .3, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
}));

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
