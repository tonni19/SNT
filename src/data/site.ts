/**
 * SNT · site data
 * Things that rarely change. Things that grow (art, UI/UX case studies,
 * research, achievements) live in src/content/ instead.
 */

export const site = {
  name: 'Sadia Noman Tonni',
  alias: 'Tortilla',
  email: 'sadiatonni1916@gmail.com',
  artPortfolio: 'https://tortfolio-art.vercel.app',
  github: 'https://github.com/tonni19',
  studies: 'United International University',
};

/** Links in the top bar. `id` is the section id on the home page. */
export const nav = [
  { id: 'art', label: 'Art' },
  { id: 'built', label: 'Built' },
  { id: 'research', label: 'Research' },
  { id: 'events', label: 'Events' },
];

/** The ticker under the bar. */
export const ticker = [
  'Sadia Noman Tonni', 'draws as Tortilla', 'game characters and assets', 'UI/UX design',
  'AI × HCI research', 'ACM IUI 2027 poster', 'IUT ICT Fest game jam', 'always 1:44 am',
];

/**
 * Hero art. Swap these for your own drawings: `mascot` stands in the giant
 * name (a transparent PNG/WebP works best), `night` plays behind the fang reveal.
 * Paths are on the art portfolio unless they start with "/" for files in public/.
 */
export const heroArt = {
  mascot: { src: '/art/my-avatars/trnsprn.webp', width: 1080, height: 1080, alt: 'Tonni, drawn as a fanged girl holding a giant pencil' },
  night: { video: '/art/animation/the-hut.mp4', poster: '/art/animation/the-hut-poster.webp', alt: 'The Hut, a hand-drawn animation loop' },
  sticker: { src: '/art/my-avatars/tortilla.webp', width: 1080, height: 1350, alt: 'Tortilla, a scruffy little self-portrait' },
};

/** The story, read in as you scroll. Short lines land better than long ones. */
export const story =
  'I like the moment before a project exists, when it is just a weird idea on a sticky note. Then I draw it, build it, and find out how people read it.';

export const about = {
  art: 'As Tortilla I draw characters, game assets, comics and hand-drawn animation, in Clip Studio, Procreate, Aseprite and Callipeg.',
  build: 'I design and build interfaces people actually use: a hand-drawn planner, a student housing platform, and this site.',
  research: 'In AI × HCI research I study what people can and cannot tell about the rules an AI uses to reuse its memories.',
};

export const skills = ['Character design', 'Game assets', 'Comics', 'Animation', 'UI/UX', 'Next.js', 'Astro', 'TypeScript', 'Python', 'LaTeX', 'HCI research'];

/** Things I've built. */
export const built = [
  { name: 'Nestly', what: 'Shared student housing, verified: itemised rent, flatmate matching, mess bills and a second-hand marketplace.', meta: 'Next.js 16 · Supabase · with SpicyFalcon619', live: 'https://nestly-core.vercel.app', code: 'https://github.com/SpicyFalcon619/nestly-core' },
  { name: 'AppleDHD', what: 'A hand-drawn personal planner: calendar, tasks, goals, cycle, budget and notes, kept on your device.', meta: 'Next.js · Capacitor · web, Android, iOS', live: 'https://appledhd.vercel.app/', code: null },
  { name: 'Tortfolio', what: 'My art portfolio: a media pipeline, a comic reader, a reel player and day/night themes.', meta: 'Next.js · Tailwind', live: 'https://tortfolio-art.vercel.app', code: 'https://github.com/tonni19/tortfolio' },
  { name: 'UIUNest', what: 'The first version of Nestly: housing and flatmate matching for UIU students.', meta: 'HTML · JS · Leaflet', live: null, code: 'https://github.com/tonni19/UIUNest' },
];

/** oldest first */
export const timeline = [
  { year: '2026.05', title: 'AppleDHD begins', text: 'A planner drawn by hand, built with Next.js and wrapped for Android and iOS.' },
  { year: '2026.06', title: 'UIUNest, then Nestly', text: 'A housing and flatmate platform that grew into Nestly, on Next.js and Supabase.' },
  { year: '2026.07', title: 'IUT ICT Fest game jam', text: 'A Small Journey: a boy who stomps on ants wakes up as one. Made in a week with team Phat_Cat.' },
  { year: '2026.09', title: 'Tortfolio goes live', text: "A home for Tortilla's characters, comics and hand-drawn animation." },
  { year: '2026.11', title: 'Poster paper for ACM IUI 2027', text: 'What a memory preview cannot tell you: ambiguity in AI memory permissions.' },
];

/** Art portfolio categories (each has its own page on the art site). */
export const artCategories = [
  { id: 'portrait', title: 'Portraits', path: '/work/portrait' },
  { id: 'game-characters', title: 'Game characters', path: '/work/game-characters' },
  { id: 'comic', title: 'Comics', path: '/work/comic' },
  { id: 'animation', title: 'Animation', path: '/work/animation' },
  { id: 'custom', title: 'Custom & commissions', path: '/work/custom' },
  { id: 'wallpaper', title: 'Wallpapers', path: '/work/wallpaper' },
] as const;

/** The UI/UX lab shelves. Each fills from src/content/uiux by `type`. */
export const uiuxShelves = [
  { type: 'analysis', title: 'Product analyses', blurb: 'Taking real product websites apart: what works, what doesn’t, and why.' },
  { type: 'case-study', title: 'Case studies', blurb: 'My own projects, from the problem to the shipped interface.' },
  { type: 'recreation', title: 'Recreations', blurb: 'Rebuilding products I admire, and what I would change.' },
] as const;
