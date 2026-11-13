/* ==========================================================================
   MNEMOS-87 · the desk (home page behaviour)
   Data arrives as JSON from src/pages/index.astro (built from src/data/site.ts).
   ========================================================================== */
(() => {
  'use strict';

  const S = JSON.parse(document.getElementById('site-data').textContent);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const resolveUrl = (u) => (u === '@art' ? S.artPortfolio : String(u || '').replace('@email', S.email));
  const isExternal = (u) => /^https?:/.test(u);
  // Lucide icon from the sprite in Icons.astro
  const icon = (name, cls = '') => `<svg class="i${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const redact = (v, w = 8) => (v == null ? `<span class="redact" style="width:${w}ch" title="redacted"></span>` : esc(v));
  const session = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } }
  };

  const SECTIONS = S.sections;

  /* ---------- elements ---------- */
  const stage = $('#stage');
  const bar = $('#siteBar');
  const sub = $('#subliminal');
  // every room is its own CRT: <section class="room" id="home"> … </section>
  const ROOMS = SECTIONS.map((s) => {
    const el = $('#' + s.id);
    return { el, screen: $('.crt__screen', el), ui: $('.screen__ui', el) };
  });
  const roomOf = (node) => {
    const r = node && node.closest ? node.closest('.room') : null;
    return r ? SECTIONS.findIndex((s) => s.id === r.id) : -1;
  };
  const desk = matchMedia('(min-width: 981px)'); // dragging is desktop-only
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ======================================================================
     AUDIO (off until the LCD ▶ is pressed)
     ====================================================================== */
  let actx = null, amb = null, soundOn = false;
  function ac() {
    if (!actx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      actx = new C();
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }
  function blip(f = 520, d = 0.06, type = 'square', v = 0.035) {
    if (!soundOn) return;
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + d);
    o.connect(g).connect(a.destination);
    o.start(); o.stop(a.currentTime + d + 0.02);
  }
  const tick = () => blip(1700 + Math.random() * 500, 0.012, 'square', 0.01);
  function startAmbient() {
    const a = ac(); if (!a || amb) return;
    const out = a.createGain();
    out.gain.setValueAtTime(0, a.currentTime);
    out.gain.linearRampToValueAtTime(0.05, a.currentTime + 2.5);
    out.connect(a.destination);
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.connect(out);
    const oscs = [55, 55.6, 82.4].map((f, i) => {
      const o = a.createOscillator(); o.type = i < 2 ? 'sawtooth' : 'sine'; o.frequency.value = f;
      const g = a.createGain(); g.gain.value = i < 2 ? 0.5 : 0.25;
      o.connect(g).connect(lp); o.start(); return o;
    });
    const buf = a.createBuffer(1, a.sampleRate * 2, a.sampleRate);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    const n = a.createBufferSource(); n.buffer = buf; n.loop = true;
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 0.7;
    const ng = a.createGain(); ng.gain.value = 0.05;
    n.connect(bp).connect(ng).connect(out); n.start();
    const lfo = a.createOscillator(); lfo.frequency.value = 0.07;
    const lg = a.createGain(); lg.gain.value = 90;
    lfo.connect(lg).connect(lp.frequency); lfo.start();
    amb = { out, nodes: [...oscs, n, lfo] };
  }
  function stopAmbient() {
    if (!amb) return;
    const a = actx, { out, nodes } = amb;
    out.gain.cancelScheduledValues(a.currentTime);
    out.gain.setValueAtTime(out.gain.value, a.currentTime);
    out.gain.linearRampToValueAtTime(0, a.currentTime + 0.6);
    setTimeout(() => nodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } }), 700);
    amb = null;
  }
  $('#soundBtn').addEventListener('click', (e) => {
    soundOn = !soundOn;
    e.currentTarget.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) { startAmbient(); blip(440, 0.08); } else stopAmbient();
  });

  /* ======================================================================
     CRT STATIC + GLITCHES + SUBLIMINALS
     ====================================================================== */
  // one noise frame is drawn off-screen, then copied onto whichever CRTs are in view
  const cvs = document.createElement('canvas');
  cvs.width = 160; cvs.height = 100;
  const cctx = cvs.getContext('2d');
  const img = cctx.createImageData(cvs.width, cvs.height);
  const statics = new Map($$('.static').map((c) => [c, c.getContext('2d')]));
  const onScreen = new Set();
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target))));
    statics.forEach((_, c) => so.observe(c));
  } else statics.forEach((_, c) => onScreen.add(c));
  function drawStatic() {
    if (!onScreen.size) return;
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = v; d[i + 1] = (v * 0.62) | 0; d[i + 2] = (v * 0.85) | 0; d[i + 3] = 255;
    }
    cctx.putImageData(img, 0, 0);
    onScreen.forEach((c) => statics.get(c).drawImage(cvs, 0, 0));
  }
  if (!reduced) {
    let f = 0;
    (function loop() { if (++f % 3 === 0) drawStatic(); requestAnimationFrame(loop); })();
  }

  const curRoom = () => ROOMS[cur] || ROOMS[0];
  function flashSub(text, ms = 120, i = cur) {
    if (reduced) return;
    const r = ROOMS[i] || ROOMS[0];
    if (sub.parentNode !== r.ui) r.ui.appendChild(sub); // the message appears on the screen you're looking at
    sub.textContent = text;
    sub.classList.add('is-on');
    setTimeout(() => sub.classList.remove('is-on'), ms);
  }
  function glitch(hard = body.dataset.mood === 'dread') {
    const ui = curRoom().ui;
    ui.classList.remove('is-glitch', 'is-hard'); void ui.offsetWidth;
    ui.classList.add('is-glitch'); ui.classList.toggle('is-hard', hard);
    setTimeout(() => ui.classList.remove('is-glitch', 'is-hard'), 260);
  }
  (function scheduleGlitch() {
    const mood = body.dataset.mood;
    const [a, b] = mood === 'dread' ? [3500, 8000] : mood === 'numb' ? [25000, 45000] : [18000, 36000];
    setTimeout(() => {
      if (!busy && !document.hidden && !reduced) {
        glitch();
        if (mood === 'dread' && Math.random() < 0.35) flashSub(pick(['STILL HERE?', 'LOOK BEHIND', '1:44', "DON'T BLINK"]), 110);
      }
      scheduleGlitch();
    }, rand(a, b));
  })();

  /* ======================================================================
     NAVIGATION
     ====================================================================== */
  let cur = -1;        // the room on screen right now
  let busy = false;    // true while a CRT is changing channel
  let jump = null;     // { i, then, wrapped } while an arrow press is scrolling you somewhere
  const entered = new Set();
  const here = () => (jump ? jump.i : cur);

  // the top bar (links, menu, progress line) is rendered and wired by SiteBar.astro
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  const closeMenu = () => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); };
  // lcd track
  $('#lcdTrack').innerHTML = SECTIONS.map(() => '<b></b>').join('');

  /* go(i): scroll to a room. The page is one long desk; arrows, keys and
     buttons glide you down (or up) to the next CRT. */
  let jumpTimer = 0;
  function roomY(i) {
    if (i === 0) return 0;
    const el = ROOMS[i].el;
    const y = el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0);
    return Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight));
  }
  function go(target, { instant = false, then = null } = {}) {
    let i = typeof target === 'string' ? SECTIONS.findIndex((s) => s.id === target) : target;
    let wrapped = false;
    if (i >= SECTIONS.length) { i = 0; wrapped = true; }
    if (i < 0) i = SECTIONS.length - 1;
    closeMenu();
    const y = roomY(i);
    if (cur !== -1 && i !== cur) blip(220 + i * 70, 0.09, 'square', 0.03);
    if (instant || reduced || Math.abs(scrollY - y) < 4) {
      jump = null;
      scrollTo(0, y);
      arrive(i, { then, wrapped });
      return;
    }
    jump = { i, then, wrapped };
    scrollTo({ top: y, behavior: 'smooth' });
    clearTimeout(jumpTimer);
    jumpTimer = setTimeout(settle, 2500); // safety net if the scroll never reports back
  }
  function arrive(i, { then, wrapped } = {}) {
    activate(i, { wrapped });
    if (then) then();
  }

  // which room is under the reading line (a bit above the middle of the window)?
  function detect() {
    const top = bar.offsetHeight;
    const line = top + (innerHeight - top) * 0.38;
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) return SECTIONS.length - 1;
    let i = 0;
    ROOMS.forEach((r, k) => { if (r.el.getBoundingClientRect().top <= line) i = k; });
    return i;
  }
  let scrollRaf = 0, settleTimer = 0;
  function settle() {
    clearTimeout(jumpTimer);
    if (jump) { const j = jump; jump = null; arrive(j.i, j); }
    else { const i = detect(); if (i !== cur) activate(i); }
  }
  addEventListener('scroll', () => {
    if (booting) return;
    if (!scrollRaf) scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      queueEyes();
      if (!jump) { const i = detect(); if (i !== cur) activate(i); }
    });
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 140);
  }, { passive: true });

  // a CRT "tunes in" when you reach it: full channel change the first time, a puff of static after that
  function tuneIn(i) {
    if (reduced) return;
    const sc = ROOMS[i].screen;
    const full = !entered.has(i);
    entered.add(i);
    const cls = full ? 'is-switching' : 'is-tuning';
    sc.classList.remove('is-switching', 'is-tuning'); void sc.offsetWidth;
    sc.classList.add(cls);
    if (full) busy = true;
    setTimeout(() => { sc.classList.remove(cls); if (full) busy = false; }, full ? 440 : 240);
  }

  function activate(i, { wrapped = false } = {}) {
    if (i === cur) { if (wrapped) flashSub('AGAIN?', 260, i); return; }
    const first = cur === -1;
    const s = SECTIONS[i];
    cur = i;
    $('#ep').textContent = 'EP.' + (i + 1);
    $$('#rail a').forEach((b, k) => { b.classList.toggle('is-current', k === i); if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    $$('#menu a').forEach((b, k) => b.classList.toggle('is-current', k === i));
    $('#lcdBig').textContent = s.lcd;
    $$('#lcdTrack b').forEach((b, k) => b.classList.toggle('on', k <= i));
    renderMemo(s.id);
    refreshStatus();
    renderPhoneInfo();
    if (!document.hidden) document.title = baseTitle();
    const hash = i === 0 ? '' : '#' + s.id;
    if (location.hash !== hash) history.replaceState(null, '', hash || location.pathname + location.search);
    movePet(i, !first);
    if (first) entered.add(i);
    else {
      tuneIn(i);
      nudgeDesk(i);
      if (wrapped) setTimeout(() => flashSub('AGAIN?', 260, i), 90);
    }
    onEnter[s.id]?.();
    queueEyes();
  }
  addEventListener('hashchange', () => {
    const i = SECTIONS.findIndex((s) => s.id === location.hash.slice(1));
    if (i >= 0) go(i);
  });

  // delegated clicks: data-go / data-nav
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.dataset.go); return; }
    const n = e.target.closest('[data-nav]');
    if (n) {
      const d = n.dataset.nav;
      const from = jump ? jump.i : (roomOf(n) >= 0 ? roomOf(n) : cur); // ◀ ▶ under a CRT move from that CRT
      if (d === 'next') go(from + 1); else if (d === 'prev') go(from - 1); else go(d);
      return;
    }
    if (!menu.hidden && !e.target.closest('#menu')) closeMenu();
  });

  /* keypad + keyboard */
  function pressVisual(k) {
    const b = $(`.key[data-key="${k}"]`);
    if (!b) return;
    b.classList.add('is-pressed');
    setTimeout(() => b.classList.remove('is-pressed'), 120);
  }
  function act(k) {
    tick();
    switch (k) {
      case 'left': case 'b': go(here() - 1); break;
      case 'right': go(here() + 1); break;
      case 'up': moveV(-1); break;
      case 'down': moveV(1); break;
      case 'a': case 'enter': confirmAction(); break;
      case 'c': go('contact'); break;
    }
  }
  $$('.key[data-key]').forEach((b) => b.addEventListener('click', () => act(b.dataset.key)));

  function moveV(d) {
    if (SECTIONS[cur].id === 'work') { selectFile(sel + d, true); return; }
    scrollBy({ top: d * Math.round(innerHeight * 0.4), behavior: reduced ? 'auto' : 'smooth' });
  }
  function confirmAction() {
    const id = SECTIONS[cur].id;
    if (id === 'home') advanceDialog();
    else if (id === 'work') openFile();
    else if (id === 'contact') $('#msgForm input').focus({ preventScroll: true });
    else go(cur + 1);
  }

  addEventListener('keydown', (e) => {
    if (booting) return;
    markActive();
    const t = e.target;
    if (t.closest && t.closest('input, textarea, select')) { if (e.key === 'Escape') t.blur(); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', Enter: 'enter' };
    const k = map[e.key] || ({ a: 'a', b: 'b', c: 'c' })[e.key.toLowerCase()];
    if (e.key === 'Enter' && t.closest('button, a')) return; // let native activation happen
    if (k === 'up' || k === 'down') {
      // ↑ ↓ scroll the page like normal, except inside the file list where they browse files
      pressVisual(k);
      if (t.closest && t.closest('#gridList')) { e.preventDefault(); tick(); selectFile(sel + (k === 'up' ? -1 : 1), true); }
      return;
    }
    if (k) { e.preventDefault(); pressVisual(k); act(k); }
    else if (/^[1-9]$/.test(e.key) && +e.key <= SECTIONS.length) go(+e.key - 1);
    else if (e.key === 'Escape') closeMenu();
  });

  /* ======================================================================
     MOODS (:)  :|  :( keys)
     ====================================================================== */
  function setMood(m) {
    body.dataset.mood = m;
    $$('[data-mood-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.moodSet === m)));
    if (cur >= 0) renderMemo(SECTIONS[cur].id);
    refreshStatus(); renderPhoneInfo();
    if (m === 'dread') { glitch(); flashSub('OK.', 140); petSay("don't do that"); blip(90, 0.4, 'sawtooth', 0.05); }
    else if (m === 'numb') { petSay('...'); blip(300, 0.1, 'sine'); }
    else { petSay('better'); blip(880, 0.06, 'sine'); }
  }
  $$('[data-mood-set]').forEach((b) => b.addEventListener('click', () => setMood(b.dataset.moodSet)));
  $$('[data-mood-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.moodSet === 'calm')));

  function statusText() {
    if (body.classList.contains('is-idle')) return 'WAITING';
    if (body.dataset.mood === 'dread') return 'AFRAID';
    if (body.dataset.mood === 'numb') return 'NUMB';
    return cur >= 0 ? SECTIONS[cur].status : S.profile.status;
  }
  function refreshStatus() {
    $('#phoneStatus').textContent = statusText();
    const ps = body.dataset.mood === 'calm' && !body.classList.contains('is-idle') ? S.profile.status : statusText();
    $('#profileStatus').textContent = ps;
  }

  /* ======================================================================
     DESK OBJECTS: phone · memo · pet · stickies · folders · clock
     ====================================================================== */
  $('#phoneName').textContent = S.handle;
  const fieldVal = (k) => (S.profile.fields.find((f) => f[0] === k) || [])[1];
  function renderPhoneInfo() {
    const s = SECTIONS[cur] || SECTIONS[0];
    const lines = [
      `Room: ${s.title}`,
      `Alias: ${fieldVal('Alias') ?? '????'}`,
      `Hobby: ${fieldVal('Hobby') ?? '????'}`,
      body.dataset.mood === 'dread' ? 'Seen: you, twice' : `Height: ${fieldVal('Height') ?? '?'}`
    ];
    $('#phoneInfo').innerHTML = lines.map((l) => `<li>${esc(l)}</li>`).join('');
  }

  function renderMemo(id) {
    const items = S.memo[id] || [];
    let html = items.map(([t, done], i) => `<li class="${done ? 'done' : ''}" style="animation-delay:${i * 0.12}s">${esc(t)}</li>`).join('');
    if (body.dataset.mood === 'dread') html += `<li class="dread" style="animation-delay:${items.length * 0.12 + 0.4}s">${esc(S.dreadMemo)}</li>`;
    $('#memoList').innerHTML = html;
  }

  // pet
  const pet = $('#pet'), bubble = $('#petBubble');
  let petTimer, lastFed = Date.now();
  function petSay(t, ms = 2200) {
    bubble.textContent = t;
    bubble.classList.add('is-on');
    clearTimeout(petTimer);
    petTimer = setTimeout(() => bubble.classList.remove('is-on'), ms);
  }
  const PET_LINES = {
    calm: ['HI!!', 'feed me', 'u ok?', '...', '*blinks*', 'zzz', 'nice cursor', 'click the arrows'],
    numb: ['...', 'meh', 'zzz', '.'],
    dread: ['behind u', "it's 1:44", "don't go", 'i saw it too', 'did u hear that']
  };
  $$('[data-pet]').forEach((b) => b.addEventListener('click', () => {
    const a = b.dataset.pet;
    blip(a === 'feed' ? 990 : a === 'talk' ? 660 : 330, 0.05);
    if (a === 'feed') {
      lastFed = Date.now();
      pet.classList.add('is-fed'); petSay('yum!');
      setTimeout(() => pet.classList.remove('is-fed'), 1800);
    } else if (a === 'talk') petSay(pick(PET_LINES[body.dataset.mood] || PET_LINES.calm));
    else {
      const dark = pet.classList.toggle('is-dark');
      petSay(dark ? "it's dark now" : 'better.');
    }
  }));
  setInterval(() => {
    if (document.hidden || booting) return;
    if (Date.now() - lastFed > 120000) { petSay('hungry...'); return; }
    if (Math.random() < 0.4) petSay(pick(PET_LINES[body.dataset.mood] || PET_LINES.calm));
  }, 24000);

  // the pet follows you: it hops onto the desk beside whichever CRT you're looking at
  function movePet(i, hop) {
    const d = $('.desk', ROOMS[i].el);
    if (!d || pet.parentNode === d) return;
    pet.style.left = ''; pet.style.top = '';
    d.appendChild(pet);
    if (hop && !reduced && pet.animate) {
      pet.animate([{ transform: 'translateY(-22px) scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: 420, easing: 'steps(6)' });
    }
  }

  // links to the separate art site
  // entrances: headings, then their text, then pictures, as each section arrives
  document.documentElement.classList.add('js');
  $$('.room__head').forEach((h) => [...h.children].forEach((c, k) => { c.classList.add('reveal'); c.style.setProperty('--rd', (k * 0.08) + 's'); }));
  if ('IntersectionObserver' in window && !reduced) {
    const ro = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((el) => ro.observe(el));
  } else $$('.reveal').forEach((el) => el.classList.add('is-in'));

  // locked folder → jump to the locked file in Work
  $('#lockedFolder').addEventListener('click', () => {
    flashSub("DON'T", 90);
    filter = 'ALL'; renderTabs(); renderList();
    const idx = visible.findIndex((f) => f.locked);
    go('work', { then: () => { selectFile(idx, false); $('#pw')?.focus({ preventScroll: true }); } });
  });

  // clocks
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let wrongUntil = 0;
  function clock() {
    const d = new Date();
    const wrong = Date.now() < wrongUntil;
    const h = wrong ? 3 : (d.getHours() % 12 || 12);
    const m = wrong ? '33' : String(d.getMinutes()).padStart(2, '0');
    const lc = $('#lcdClock');
    lc.innerHTML = `${h}<i>:</i>${m}`;
    lc.classList.toggle('is-wrong', wrong);
    $('#phoneTime').textContent = `${h}:${m}`;
    $('#stickyDate').textContent = `${d.getMonth() + 1}/${d.getDate()}`;
    $('#gridDate').textContent = `${d.getDate()}-${MON[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`;
  }
  clock();
  setInterval(clock, 1000);
  setInterval(() => { if (Math.random() < 0.15) { wrongUntil = Date.now() + 1600; clock(); } }, 60000);

  /* ======================================================================
     THE DESK MOVES: objects float on their own, jolt when the channel
     changes, and can be dragged around (desktop). Double-click the wall
     to tidy up. Positions are remembered in this browser only.
     ====================================================================== */
  const local = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
    clear(k) { try { localStorage.removeItem(k); } catch { /* storage blocked */ } }
  };
  // positions are offsets from each object's own spot beside its CRT
  const DESK_KEY = 'mnemos-desk-v2';
  const movers = $$('.lcd, .phone, .memo, .pet, .sticky, .keypad');
  movers.forEach((el, i) => {
    el.dataset.mover = String(i);
    el.classList.add('floaty');
    el.setAttribute('draggable', 'false');
    el.style.setProperty('--fd', rand(5.5, 9).toFixed(2) + 's');
    el.style.setProperty('--fdelay', (-rand(0, 8)).toFixed(2) + 's');
    el.style.setProperty('--fy', (el.classList.contains('keypad') ? -2 : -rand(3, 7)).toFixed(1) + 'px');
    el.addEventListener('dragstart', (e) => e.preventDefault());
  });
  function loadDesk() {
    let saved = {};
    if (desk.matches) { try { saved = JSON.parse(local.get(DESK_KEY) || '{}'); } catch { saved = {}; } }
    movers.forEach((el) => {
      if (el === pet) return; // the pet goes where it likes
      const p = saved[el.dataset.mover];
      el.style.left = Array.isArray(p) ? p[0] + 'px' : '';
      el.style.top = Array.isArray(p) ? p[1] + 'px' : '';
    });
  }
  loadDesk();
  desk.addEventListener?.('change', loadDesk); // phones get the tidy stacked layout
  function saveDesk() {
    const o = {};
    movers.forEach((el) => { if (el !== pet && el.style.left) o[el.dataset.mover] = [parseFloat(el.style.left), parseFloat(el.style.top)]; });
    local.set(DESK_KEY, JSON.stringify(o));
  }
  function nudgeDesk(room) {
    if (reduced) return;
    movers.filter((el) => room == null || roomOf(el) === room).forEach((el, k) => {
      setTimeout(() => {
        el.style.rotate = rand(-1.4, 1.4).toFixed(2) + 'deg';
        setTimeout(() => { el.style.rotate = ''; }, 170);
      }, k * 25);
    });
  }
  let drag = null, justDragged = false, topZ = 10, taughtTidy = false;
  movers.forEach((el) => el.addEventListener('pointerdown', (e) => {
    if (!desk.matches || e.button !== 0 || e.target.closest('input, textarea')) return;
    drag = {
      el, id: e.pointerId, x: e.clientX, y: e.clientY,
      left: parseFloat(el.style.left) || 0, top: parseFloat(el.style.top) || 0,
      rect: el.getBoundingClientRect(), moved: false
    };
  }));
  addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    let dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 6) return;
      drag.moved = true;
      drag.el.classList.add('is-dragging');
      drag.el.style.zIndex = String(++topZ);
      try { drag.el.setPointerCapture(drag.id); } catch { /* not capturable */ }
    }
    // keep at least half of it inside the window
    const r = drag.rect, w = r.width, h = r.height;
    dx = Math.max(-r.left - w / 2, Math.min(innerWidth - r.right + w / 2, dx));
    dy = Math.max(-r.top - h / 2, Math.min(innerHeight - r.bottom + h / 2, dy));
    drag.el.style.left = (drag.left + dx) + 'px';
    drag.el.style.top = (drag.top + dy) + 'px';
  });
  function endDrag() {
    if (!drag) return;
    if (drag.moved) {
      drag.el.classList.remove('is-dragging');
      justDragged = true;
      setTimeout(() => { justDragged = false; }, 0);
      saveDesk();
      if (!taughtTidy) { taughtTidy = true; setTimeout(() => petSay('double-click the wall to tidy', 3200), 300); }
    }
    drag = null;
  }
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  // a drag should never also count as a click on the thing you dropped
  document.addEventListener('click', (e) => { if (justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
  document.addEventListener('dblclick', (e) => {
    const t = e.target;
    if (t !== stage && t !== body && !['wall', 'room', 'desk', 'site-foot'].some((c) => t.classList.contains(c))) return;
    movers.forEach((el) => { el.style.left = ''; el.style.top = ''; el.style.zIndex = ''; });
    local.clear(DESK_KEY);
    nudgeDesk();
    petSay('all tidy');
  });

  /* ======================================================================
     EYES THAT FOLLOW THE CURSOR
     ====================================================================== */
  let mx = innerWidth / 2, my = innerHeight / 2, eyeRaf = 0;
  function updateEyes() {
    const idle = body.classList.contains('is-idle');
    $$('.eye').forEach((g) => {
      const el = g.querySelector('ellipse'), p = g.querySelector('.pupil');
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      if (idle) { p.style.transform = 'translate(0px, 0px)'; return; } // staring straight at you
      const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const rx = +el.getAttribute('rx'), ry = +el.getAttribute('ry'), pr = +p.getAttribute('r');
      const k = Math.min(1, dist / 220);
      p.style.transform = `translate(${(dx / dist) * (rx - pr - 0.6) * k}px, ${(dy / dist) * (ry - pr - 0.4) * k}px)`;
    });
  }
  function queueEyes() { if (!eyeRaf) eyeRaf = requestAnimationFrame(() => { eyeRaf = 0; updateEyes(); }); }
  addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; queueEyes(); markActive(); }, { passive: true });

  /* ======================================================================
     IDLE + TAB VISIBILITY
     ====================================================================== */
  let idleTimer;
  function markActive() {
    if (body.classList.contains('is-idle')) {
      body.classList.remove('is-idle');
      refreshStatus(); queueEyes();
      petSay('oh. there you are');
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(goIdle, 35000);
  }
  function goIdle() {
    body.classList.add('is-idle');
    refreshStatus(); updateEyes();
    petSay('...hello?', 4000);
    if (SECTIONS[cur]?.id === 'home' && dialogDone) typeText($('#dialogText'), 'Are you still there?');
  }
  const baseTitle = () => `${(SECTIONS[cur] || SECTIONS[0]).title} · ${S.name || 'MNEMOS-87'}`;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.title = 'come back…';
    else { document.title = baseTitle(); setTimeout(() => petSay('you came back'), 400); }
  });

  /* ======================================================================
     TYPEWRITER
     ====================================================================== */
  let typing = null;
  function typeText(el, text, speed = 26) {
    if (typing) typing.finish();
    return new Promise((res) => {
      if (reduced) { el.textContent = text; res(); return; }
      let n = 0;
      el.textContent = '';
      const job = {
        timer: setInterval(() => {
          n++;
          el.textContent = text.slice(0, n);
          if (n % 2 === 0 && text[n - 1] !== ' ') tick();
          if (n >= text.length) job.finish();
        }, speed),
        finish() { clearInterval(job.timer); el.textContent = text; if (typing === job) typing = null; res(); }
      };
      typing = job;
    });
  }

  /* ======================================================================
     SCENE 1 · HOME
     ====================================================================== */
  const h1 = $('#homeName');
  if (S.name) {
    // last word on its own line: "Sadia Noman / Tonni"
    const words = S.name.trim().split(/\s+/), last = words.length > 1 ? words.pop() : '';
    h1.innerHTML = `<span>${esc(words.join(' '))}</span>${last ? ` <span>${esc(last)}</span>` : ''}`;
    h1.dataset.text = words.join(' ') + (last ? '\n' + last : '');
  } else { h1.innerHTML = redact(null, 8); h1.dataset.text = ''; }

  const dialog = $('#dialog');
  let dIdx = 0, dialogDone = false, homeVisits = 0;
  function showLine(i) {
    dIdx = i;
    $('#dialogTitle').textContent = i === 0 ? '???' : `${S.handle}.txt`;
    const p = typeText($('#dialogText'), S.dialogue[i]);
    if (i === S.dialogue.length - 1) p.then(() => { dialogDone = true; dialog.classList.add('is-done'); });
  }
  function advanceDialog() {
    if (typing) { typing.finish(); return; }
    if (dIdx < S.dialogue.length - 1) showLine(dIdx + 1);
    else dialog.querySelector('.dialog__choices button')?.focus({ preventScroll: true });
  }
  dialog.addEventListener('click', (e) => { if (!e.target.closest('button')) advanceDialog(); });
  $('#dialogSkip').addEventListener('click', () => { if (typing) typing.finish(); showLine(S.dialogue.length - 1); if (typing) typing.finish(); });

  /* ======================================================================
     SCENE 2 · WORK & TOOLS (GRiD file manager)
     ====================================================================== */
  const KINDS = [['ALL', 'All'], ['GAME', 'Games'], ['ASSET', 'Assets'], ['UI', 'UI/UX'], ['RESEARCH', 'Research'], ['ART', 'Art'], ['IDEA', 'Ideas'], ['TOOL', 'Tools']];
  const tabsEl = $('#gridTabs'), listEl = $('#gridList'), detailEl = $('#gridDetail');
  let filter = 'ALL', sel = 0, visible = [];

  function renderTabs() {
    tabsEl.innerHTML = KINDS.filter(([k]) => k === 'ALL' || S.files.some((f) => f.kind === k))
      .map(([k, l]) => `<button role="tab" aria-selected="${k === filter}" data-kind="${k}">${l}</button>`).join('');
  }
  function renderList() {
    visible = S.files.filter((f) => filter === 'ALL' || f.kind === filter);
    sel = 0;
    listEl.innerHTML = visible.map((f, i) => `
      <li role="option" aria-selected="${i === sel}" data-i="${i}">
        <button tabindex="${i === sel ? 0 : -1}"><span>${esc(f.name)}<span class="ext">.${esc(f.ext)}</span></span><span>${esc(f.label)}</span></button>
      </li>`).join('');
    listEl.scrollTop = 0;
    renderDetail();
  }
  function selectFile(i, focus) {
    if (!visible.length) return;
    sel = Math.max(0, Math.min(visible.length - 1, i));
    $$('li', listEl).forEach((li, k) => {
      li.setAttribute('aria-selected', String(k === sel));
      li.firstElementChild.tabIndex = k === sel ? 0 : -1;
    });
    const li = listEl.children[sel];
    if (li.offsetTop < listEl.scrollTop) listEl.scrollTop = li.offsetTop;
    else if (li.offsetTop + li.offsetHeight > listEl.scrollTop + listEl.clientHeight) listEl.scrollTop = li.offsetTop + li.offsetHeight - listEl.clientHeight;
    if (focus) li.firstElementChild.focus({ preventScroll: true });
    renderDetail();
  }
  function renderDetail() {
    const f = visible[sel];
    if (!f) { detailEl.innerHTML = '<dd class="desc">No files of this kind. Yet.</dd>'; return; }
    const url = f.url ? resolveUrl(f.url) : null;
    let action;
    if (f.locked) action = '<label>Password <input id="pw" maxlength="6" autocomplete="off" spellcheck="false"></label><span id="pwOut" aria-live="polite"></span>';
    else if (url) {
      const attrs = url.startsWith('#') ? `data-go="${esc(url.slice(1))}"` : isExternal(url) ? 'target="_blank" rel="noopener"' : '';
      action = `<a href="${esc(url)}" ${attrs}>[ OPEN ]</a><span class="hint">${icon('corner-down-left')} also works</span>`;
    }
    else action = '<span style="opacity:.6">[ case file coming soon ]</span>';
    detailEl.innerHTML = `
      <dt>Device</dt><dd>${esc(f.device)}</dd>
      <dt>Subject</dt><dd>${esc(f.subject)}</dd>
      <dt>Title</dt><dd class="boxed">${redact(f.title, 8)}</dd>
      <dt>Kind</dt><dd>${esc(f.label)} · ${esc(f.status)}</dd>
      <dd class="desc">${esc(f.desc)}</dd>
      <dd class="act">${action}</dd>`;
    const pw = $('#pw');
    if (pw) pw.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const out = $('#pwOut');
      if (/^1:?44$/.test(pw.value.trim())) {
        out.textContent = 'ACCESS GRANTED';
        $('.desc', detailEl).textContent = 'You found the back room. Nothing is here yet — but something will be.';
        blip(1200, 0.2, 'sine'); flashSub('WELCOME', 200);
      } else {
        out.innerHTML = '<span class="denied">DENIED</span> · hint: check the clock';
        blip(110, 0.25, 'sawtooth', 0.05); glitch();
      }
      pw.select();
    });
  }
  function openFile() {
    const f = visible[sel];
    if (!f) return;
    if (f.locked) { $('#pw')?.focus({ preventScroll: true }); return; }
    if (f.url) {
      const u = resolveUrl(f.url);
      if (u.startsWith('#')) go(u.slice(1));
      else if (isExternal(u)) window.open(u, '_blank', 'noopener');
      else location.href = u;
    } else { glitch(); flashSub('NOT YET', 140); }
  }
  tabsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-kind]');
    if (!b) return;
    filter = b.dataset.kind; tick();
    renderTabs(); renderList();
  });
  listEl.addEventListener('click', (e) => { const li = e.target.closest('li'); if (li) { selectFile(+li.dataset.i, false); tick(); } });
  listEl.addEventListener('dblclick', (e) => { if (e.target.closest('li')) openFile(); });
  renderTabs(); renderList();

  /* ======================================================================
     SCENE 3 · PROFILE
     ====================================================================== */
  const SEG = ['#3d63c9', '#4ea6c4', '#5fbfb0', '#5fbfb0', '#9fd38a', '#f3d36b', '#f3b73f', '#f39a4b', '#ee6f5a', '#e0485f'];
  $('#profileFields').innerHTML = S.profile.fields.map(([k, v]) =>
    `<dt>${esc(k)}</dt><dd>${redact(k === 'Name' ? (S.name ?? v) : v, 9)}</dd>`).join('');
  $('#stats').innerHTML = S.interests.map((it) => `
    <li>
      <span class="s-name">${esc(it.name)}</span>
      <span class="s-bar" role="img" aria-label="${it.level} out of 10">${SEG.map((c) => `<i style="--c:${c}"></i>`).join('')}</span>
      <span class="s-note">${esc(it.note)}</span>
    </li>`).join('');
  const ab = S.profile.about.map(esc);
  ab.splice(Math.min(2, ab.length), 0, `<span class="whisper">${esc(S.profile.whisper)}</span>`);
  $('#about').innerHTML = ab.join(' ') + ' <span class="cursor-blk"></span>';
  $('#chips').innerHTML = S.profile.tags.map((t) => `<span>${esc(t)}</span>`).join('');
  let statTimers = [];
  function animateStats() {
    statTimers.forEach(clearTimeout); statTimers = [];
    $$('#stats li').forEach((li, i) => {
      const segs = $$('.s-bar i', li);
      segs.forEach((s) => s.classList.remove('on'));
      const lvl = S.interests[i].level;
      segs.slice(0, lvl).forEach((s, k) => {
        statTimers.push(setTimeout(() => { s.classList.add('on'); if (k % 2 === 0) tick(); }, reduced ? 0 : 250 + i * 160 + k * 55));
      });
    });
  }

  /* ======================================================================
     SCENE 4 · TIMELINE
     ====================================================================== */
  const tapesEl = $('#tapes');
  tapesEl.innerHTML = S.timeline.map((t, i) => `
    <li class="tape${t.blank ? ' tape--blank' : ''}">
      <div class="tape__card">
        <div class="tape__top"><span class="tape__year">${esc(t.year)}</span><span class="tape__no">TAPE ${String(i + 1).padStart(2, '0')}</span><span class="tape__tag">${esc(t.tag)}</span></div>
        <h3 class="tape__title">${esc(t.title)}</h3>
        ${t.text ? `<p class="tape__text">${esc(t.text)}</p>` : ''}
      </div>
    </li>`).join('');
  const tapeCount = () => { $('#tapeCount').textContent = $$('.tape.is-in', tapesEl).length + '/' + S.timeline.length; };
  const tapeObs = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    let n = 0;
    entries.forEach((en) => {
      if (!en.isIntersecting || en.target.classList.contains('is-in')) return;
      const el = en.target;
      setTimeout(() => { el.classList.add('is-in'); tick(); tapeCount(); }, reduced ? 0 : n++ * 110);
    });
  }, { threshold: 0.25 }) : null;
  $$('.tape', tapesEl).forEach((t) => (tapeObs ? tapeObs.observe(t) : t.classList.add('is-in')));

  // VHS timecode — runs while the tape room is open
  let tc = 14 * 60 + 22, tcTimer = null;
  const fmtTc = (s) => [s / 3600, (s / 60) % 60, s % 60].map((v) => String(Math.floor(v)).padStart(2, '0')).join(':');
  function startTimecode() {
    clearInterval(tcTimer);
    tcTimer = setInterval(() => {
      if (SECTIONS[cur].id !== 'timeline') { clearInterval(tcTimer); return; }
      tc++; $('#timecode').textContent = fmtTc(tc);
    }, 1000);
    $('#timecode').textContent = fmtTc(tc);
  }

  /* ======================================================================
     SCENE 5 · CONTACT
     ====================================================================== */
  $('#channels').innerHTML = S.links.map((l) => {
    const u = resolveUrl(l.url);
    return `<li><a href="${esc(u)}" ${isExternal(u) ? 'target="_blank" rel="noopener"' : ''}><span>${esc(l.label)}</span><span class="dots"></span><span class="note">${esc(l.note)}</span></a></li>`;
  }).join('');
  $('#msgForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const from = fd.get('from'), mail = fd.get('email');
    const subject = fd.get('subject') || `A message from ${from}`;
    const text = `${fd.get('body')}\n\n— ${from} (${mail})`;
    const out = $('#msgOut');
    out.innerHTML = `${icon('circle', 'i--rec')} recording…`;
    blip(1000, 0.45, 'sine', 0.05);
    setTimeout(() => {
      location.href = `mailto:${S.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      out.textContent = 'saved. someone will listen to it.';
    }, 800);
  });

  /* ======================================================================
     SCENE HOOKS
     ====================================================================== */
  const onEnter = {
    home() {
      homeVisits++;
      if (homeVisits === 1) { dialog.classList.remove('is-done'); showLine(0); }
      else {
        dialogDone = true; dialog.classList.add('is-done');
        $('#dialogTitle').textContent = `${S.handle}.txt`;
        typeText($('#dialogText'), pick(['You came back.', 'Still here? Good.', 'The door was open when you left.', 'Where to now?']));
      }
    },
    work() {},
    profile() { animateStats(); },
    timeline() { tapeCount(); startTimecode(); },
    contact() {}
  };

  /* ======================================================================
     BOOT
     ====================================================================== */
  let booting = true;
  const bootEl = $('#boot');
  const BOOT = [
    'MNEMOS-87 BIOS v1.44 (c) 1987',
    'MEMORY TEST ............ 640K OK',
    'BUBBLE MEMORY .......... OK',
    'MOUNTING /archive ...... OK',
    `LOADING SUBJECT ........ ${S.name ? S.name.toUpperCase() : S.handle}`,
    '<span class="warn">WARNING: subject file is incomplete.</span>',
    '<span class="warn">WARNING: 1 unknown presence detected.</span>',
    '',
    'hello, presence.'
  ];
  function enter() {
    if (!booting) return;
    booting = false;
    body.classList.remove('is-locked');
    session.set('mnemos-booted', '1');
    bootEl.classList.add('is-gone');
    setTimeout(() => bootEl.remove(), 600);
    body.classList.add('is-powering');
    setTimeout(() => body.classList.remove('is-powering'), 800);
    start();
  }
  function start() {
    const i = SECTIONS.findIndex((s) => s.id === location.hash.slice(1));
    go(i >= 0 ? i : 0, { instant: true });
    setTimeout(() => petSay('HI!!'), 1400);
    markActive();
  }
  if (session.get('mnemos-booted') || reduced) {
    enter();
  } else {
    const log = $('#bootLog');
    let li = 0;
    (function next() {
      if (!booting) return;
      if (li >= BOOT.length) { $('#bootPrompt').classList.add('is-on'); setTimeout(enter, 450); return; } // carries on by itself
      log.innerHTML += BOOT[li++] + '\n';
      setTimeout(next, li > 5 ? 200 : rand(70, 130));
    })();
    addEventListener('keydown', enter, { once: true });
    bootEl.addEventListener('click', enter, { once: true });
  }

  /* ---------- for the curious ---------- */
  console.log('%cyou shouldn\'t be in here.', 'font: 16px monospace; color: #ff7ac0; background: #1a0512; padding: 6px 10px;');
  console.log('%c(the password is on the clock.)', 'font: 11px monospace; color: #888;');
})();
