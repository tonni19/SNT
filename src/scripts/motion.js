/* ==========================================================================
   SNT · scroll choreography (home page only)
   Runs only when Motion is on. The HTML already shows every section in its
   finished state, so this file only sets starting positions and scrubs them
   home as you scroll. Motion off = this file does nothing.

   Scenes:
   1. hero      the name swells and lifts, the mascot climbs, the night rises
   2. fangs     a jaw of cream fangs swallows the night, a statement lands
   3. strip     the film strip pans sideways
   4. story     the sentence reads itself in, word by word
   5. numbers   count up on arrival
   6. band      two lines of giant words slide against each other
   7. contact   the name rises back up, letter by letter
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const on = document.documentElement.dataset.fx !== 'off';

if (on) {
  gsap.registerPlugin(ScrollTrigger);

  // ---- smooth scrolling, driven by GSAP's clock so pins never jitter
  const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.sntLenis = lenis;

  // in-page links glide instead of jumping
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
    const el = a.hash && document.querySelector(a.hash);
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -8, duration: 1.4 });
    history.replaceState(null, '', a.hash);
  });

  const q = (s) => document.querySelector(s);

  // ---- 1. hero
  if (q('.hero')) {
    gsap.set('.hero__night', { autoAlpha: 1, yPercent: 100 });
    gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=160%', scrub: 0.7, pin: true, anticipatePin: 1 },
    })
      .to('.ticker', { autoAlpha: 0, duration: 0.15 }, 0)
      .to('.hero__corner', { autoAlpha: 0, y: -50, duration: 0.25, stagger: 0.05 }, 0)
      .to('.hero__word', { scale: 1.75, yPercent: -34, ease: 'power1.in', duration: 0.6 }, 0)
      .to('.hero__mascot', { yPercent: -38, scale: 1.3, ease: 'power1.in', duration: 0.6 }, 0)
      .to('.hero__night', { yPercent: 0, ease: 'power3.inOut', duration: 0.45 }, 0.42)
      .fromTo('.hero__sweep', { xPercent: 12 }, { xPercent: -42, ease: 'none', duration: 0.6 }, 0.42);
  }

  // ---- 2. fangs
  if (q('.fang')) {
    gsap.set('.fang__teeth', { yPercent: 100 }); // starts below the screen; 0 = jaw closed, cream fills it
    gsap.set('.fang__say', { autoAlpha: 0 });
    gsap.timeline({
      scrollTrigger: { trigger: '.fang', start: 'top top', end: '+=180%', scrub: 0.7, pin: true, anticipatePin: 1 },
    })
      .fromTo('.fang__art video', { scale: 1.18 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.fang__caption', { autoAlpha: 0, duration: 0.1 }, 0.25)
      .to('.fang__teeth', { yPercent: 0, ease: 'power2.inOut', duration: 0.62 }, 0.12)
      .to('.fang__say', { autoAlpha: 1, duration: 0.12 }, 0.66)
      .fromTo('.fang__say .display', { yPercent: 30, scale: 0.92 }, { yPercent: 0, scale: 1, ease: 'power3.out', duration: 0.3 }, 0.66);
  }

  // ---- 3. film strip
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

  // ---- 4. story
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

  // ---- 5. numbers
  const nums = gsap.utils.toArray('[data-count]');
  nums.forEach((b) => { b.textContent = '0'; });
  if (nums.length) {
    ScrollTrigger.create({
      trigger: '.nums', start: 'top 75%', once: true,
      onEnter: () => nums.forEach((b, i) => {
        const o = { v: 0 };
        gsap.to(o, { v: +b.dataset.count, duration: 1.6, delay: i * 0.08, ease: 'power3.out', onUpdate: () => { b.textContent = Math.round(o.v); } });
      }),
    });
  }

  // ---- section titles and rows rise into place once
  gsap.utils.toArray('.sec-head__title, .contact__title').forEach((el) => {
    gsap.from(el, { yPercent: 40, opacity: 0, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });
  gsap.utils.toArray('.built__list, .lab__shelves, .log__list, .events .wrap').forEach((group) => {
    const kids = group.matches('.events .wrap') ? group.querySelectorAll('.event') : group.children;
    gsap.from(kids, { y: 50, opacity: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: group, start: 'top 82%', once: true } });
  });

  // ---- 6. band
  if (q('.band')) {
    const st = { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: 0.4 };
    gsap.fromTo('.band__line--a', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: st });
    gsap.fromTo('.band__line--b', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: st });
  }

  // ---- 7. contact
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

  // images that load late change heights; re-measure the pins once they settle
  addEventListener('load', () => ScrollTrigger.refresh());
}
