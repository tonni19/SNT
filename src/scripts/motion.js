/* ==========================================================================
   SNT · scroll choreography (home page only)
   The HTML already shows every section in its finished state, so this file
   only sets starting positions and scrubs them home as you scroll.

   window.sntMotion.set(true | false) starts or stops everything live, with no
   reload: the section you are looking at stays where it is.

   Scenes:
   1. strip     the film strip pans sideways
   2. story     the sentence reads itself in, word by word
   3. numbers   count up on arrival
   4. rise-ins  section titles and rows rise into place once
   5. band      two lines of giant words slide against each other
   6. contact   the name rises back up, letter by letter
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const q = (s) => document.querySelector(s);
const below = (el, fraction) => el.getBoundingClientRect().top > innerHeight * fraction;

let ctx = null;
let lenis = null;
const tick = (t) => lenis && lenis.raf(t * 1000);

// in-page links glide while smooth scrolling is on
document.addEventListener('click', (e) => {
  if (!lenis) return;
  const a = e.target.closest('a[href*="#"]');
  if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
  const el = a.hash && document.querySelector(a.hash);
  if (!el) return;
  e.preventDefault();
  lenis.scrollTo(el, { offset: -8, duration: 1.4 });
  history.replaceState(null, '', a.hash);
});

function start() {
  if (ctx) return;

  // smooth scrolling, driven by GSAP's clock so pins never jitter
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  window.sntLenis = lenis;

  ctx = gsap.context(() => {
    // ---- 1. film strip
    const rail = q('.strip__rail');
    if (rail) {
      const vp = q('.strip__viewport');
      vp.classList.add('is-pinned');
      const dist = () => Math.max(0, rail.scrollWidth - vp.clientWidth);
      gsap.to(rail, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: '.strip', start: 'center center', end: () => `+=${dist()}`, scrub: 0.7, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      // frames tilt a little against the motion, like film in a gate
      gsap.utils.toArray('.frame').forEach((f, i) => gsap.set(f, { rotate: i % 2 ? 1.2 : -1.2 }));
    }

    // ---- 2. story
    if (q('.story__text')) {
      gsap.fromTo('.story__text .w', { opacity: 0.13 }, {
        opacity: 1, stagger: 0.06, ease: 'none',
        scrollTrigger: { trigger: '.story__text', start: 'top 78%', end: 'bottom 42%', scrub: true },
      });
      gsap.fromTo('.story__sticker', { yPercent: 60, rotate: -14 }, {
        yPercent: -20, rotate: 10, ease: 'none',
        scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }

    // ---- 3. numbers: only count up if they are still ahead of you
    const nums = gsap.utils.toArray('[data-count]');
    const numsBox = q('.nums');
    if (nums.length && numsBox && below(numsBox, 0.75)) {
      nums.forEach((b) => { b.textContent = '0'; });
      ScrollTrigger.create({
        trigger: numsBox, start: 'top 75%', once: true,
        onEnter: () => nums.forEach((b, i) => {
          const o = { v: 0 };
          gsap.to(o, { v: +b.dataset.count, duration: 1.6, delay: i * 0.08, ease: 'power3.out', onUpdate: () => { b.textContent = Math.round(o.v); } });
        }),
      });
    }

    // ---- 4. titles and rows rise into place once (skipped for what you have already passed)
    gsap.utils.toArray('.sec-head__title, .contact__title').forEach((el) => {
      if (!below(el, 0.86)) return;
      gsap.from(el, { yPercent: 40, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    gsap.utils.toArray('.built__list, .lab__shelves, .events .wrap, .interests__grid, .skills__grid').forEach((group) => {
      if (!below(group, 0.82)) return;
      const kids = group.matches('.events .wrap') ? group.querySelectorAll('.event') : group.children;
      gsap.from(kids, { y: 50, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 82%', once: true } });
    });

    // ---- 5. band
    if (q('.band')) {
      const st = { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: 0.4 };
      gsap.fromTo('.band__line--a', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: st });
      gsap.fromTo('.band__line--b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
    }

    // ---- 6. contact
    if (q('.contact__word')) {
      gsap.from('.contact__word .ch', {
        yPercent: 105, stagger: 0.07, ease: 'none',
        scrollTrigger: { trigger: '.contact__word', start: 'top 95%', end: 'bottom bottom', scrub: 0.6 },
      });
      gsap.from('.contact__peek', {
        yPercent: 80, rotate: -8, ease: 'none',
        scrollTrigger: { trigger: '.contact__word', start: 'top 80%', end: 'bottom bottom', scrub: 0.6 },
      });
    }
  });
}

function stop() {
  if (!ctx) return;
  ctx.revert(); // removes every tween, trigger and pin this file made
  ctx = null;
  gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  window.sntLenis = undefined;
  q('.strip__viewport')?.classList.remove('is-pinned');
  document.querySelectorAll('[data-count]').forEach((b) => { b.textContent = b.dataset.count; });
}

/** Keep the section in view where it is while the page changes underneath. */
function holdPlace(change) {
  const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bar-h')) || 64;
  const anchor = [...document.querySelectorAll('main section')].find((s) => s.getBoundingClientRect().bottom > bar);
  const before = anchor ? anchor.getBoundingClientRect().top : 0;
  change();
  ScrollTrigger.refresh();
  if (!anchor) return;
  const y = scrollY + anchor.getBoundingClientRect().top - before;
  scrollTo(0, y);
  if (lenis) {
    lenis.resize(); // the page just changed height; let smooth scrolling know before it moves
    lenis.scrollTo(y, { immediate: true, force: true });
  }
}

window.sntMotion = {
  set(on) { holdPlace(on ? start : stop); },
};

if (document.documentElement.dataset.fx !== 'off') start();
// images that load late change heights; re-measure the pins once they settle
addEventListener('load', () => ctx && ScrollTrigger.refresh());
