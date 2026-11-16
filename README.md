# SNT · Sadia Noman Tonni

**Live: [tonni19.github.io/SNT](https://tonni19.github.io/SNT/)**

The personal website of **Sadia Noman Tonni**: artist (as *Tortilla*), game asset creator, UI/UX designer and AI × HCI researcher.

A scrolling, illustrated portfolio. The page is a sequence of scroll-driven scenes inspired by poster-style web design, built around my own drawings:

1. **Hero:** my name, huge, with my self-portrait standing in it. Scrolling swells the letters, lifts the drawing, and a night panel rises with a sweeping line of words.
2. **Fangs:** one of my animations plays until a jaw of cream fangs rises and swallows it, and a statement lands.
3. **Film strip:** my art pans sideways on a strip of film. Every frame opens that piece on my art portfolio.
4. **Story:** a sentence reads itself in, word by word.
5. **Numbers, Built, UI/UX lab, Research, Events, Log:** real counts, shipped interfaces, case-study shelves, papers, competitions and a timeline.
6. **Ending:** the name rises back letter by letter, with the drawing peeking out.

Palette and type are shared with the art portfolio: deep rose, cream and plum-black; Anton, Space Grotesk and JetBrains Mono.

![Home](docs/screenshots/home.png)

- **Art portfolio:** [tortfolio-art.vercel.app](https://tortfolio-art.vercel.app/)
- **GitHub:** [github.com/tonni19](https://github.com/tonni19)

## Motion

Scroll scenes use [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) with [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling, all in `src/scripts/motion.js`. Every section is laid out in its finished state in HTML and CSS, and the script only adds starting positions and scrubs them home. With **Motion off** (the button in the top bar, saved per visitor, and the default for anyone whose system asks for reduced motion) the page is a calm, normal-scrolling page with nothing pinned, flashing or moving.

## Your own art

Swap the drawings in `heroArt` in `src/data/site.ts`:

- `mascot`: the figure standing in the giant name. A transparent PNG or WebP works best.
- `night`: the animation behind the fang reveal.
- `sticker`: the little card in the story section.

Paths starting with `/art/` load from the art portfolio; files you put in `public/` load from here.

## Run it

Needs Node.js 22.23 or newer.

```bash
npm install
npm run dev        # http://127.0.0.1:4321 (live reload)
npm run build      # static site in dist/
npm run preview    # serve the built site
npm run check      # type-check content and code
```

Every push to `main` builds the site and publishes it to GitHub Pages at [tonni19.github.io/SNT](https://tonni19.github.io/SNT/) (`.github/workflows/deploy.yml`). Locally the site also lives under `/SNT/`, e.g. `http://127.0.0.1:4321/SNT/`.

The sub-path comes from `base: '/SNT'` in `astro.config.mjs`. Internal links go through `url()` in `src/lib/url.ts`, so if the repo is renamed, only `base` changes.

## Adding your work

Everything that grows lives in `src/content/`. Each folder has a `_TEMPLATE.md` that explains every field. Files starting with `_` never show on the site.

| To add | Do this |
|---|---|
| A paper or poster | `npm run new research my-paper`, fill it in, delete `draft: true`. Add `arxiv:`, `scholar:`, `pdf:` and `bibtex:` when they exist; until then the card shows "soon". |
| A UI/UX analysis, case study or recreation | `npm run new uiux product-name`. Set `type:` to `analysis`, `case-study` or `recreation` and it lands on the right shelf. The markdown body becomes the case study page. |
| A competition, jam or event | `npm run new achievements event-name`. Fill in `result`, `learned`, `experience`, `verdict` and an optional `rating` from 1 to 5. |
| A piece of art | Add it to your Tortfolio repo as usual, then run `npm run sync-art` here. It reads `../tortfolio` and rebuilds `src/content/art.json` with every piece, its title and its own page link. Images are linked from the art site, not copied. In `art.json`, set `"featured": true` to put a piece at the front of the film strip or `"hidden": true` to leave it out; a sync keeps both. |

The schemas in `src/content.config.ts` check every entry. A missing field or a broken link stops `npm run dev` with a clear message instead of breaking the page.

Things that rarely change (name, links, the hero art, the story sentence, what I've built, the timeline) are in `src/data/site.ts`.

## Accessibility

- Every control is a real button or link with a label, and the whole site works from the keyboard. A skip link jumps past the header.
- Every page works without JavaScript; the film strip simply becomes a sideways-scrolling row.
- With Motion off nothing is pinned, scrubbed or autoplayed.

## Built with

[Astro](https://astro.build) 7 with content collections and TypeScript, optimised images through `astro:assets`, GSAP ScrollTrigger and Lenis for the scroll scenes, and no client framework.

## Rights

The code is © 2026 Sadia Noman Tonni. The artwork shown here is my own, linked from my art portfolio, and may not be reused without permission. Icons are from Lucide under the ISC licence.
