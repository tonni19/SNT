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
  position: 'Undergraduate student, Computer Science and Engineering',
};

/** Links in the top bar. `id` is the section id on the home page. */
export const nav = [
  { id: 'research', label: 'Research' },
  { id: 'events', label: 'Achievements' },
  { id: 'built', label: 'Projects' },
  { id: 'skills', label: 'Toolkit' },
  { id: 'art', label: 'Art' },
];

/** The ticker under the bar. */
export const ticker = [
  'Sadia Noman Tonni', 'human-AI interaction', 'UX research', 'game UX',
  'interactive animation', 'game art', 'interface design', 'drawing as Tortilla',
];

/**
 * Hero art. Swap these for your own drawings: `mascot` stands in the giant
 * name (a transparent PNG/WebP works best), `sticker` sits in the about section.
 * Paths are on the art portfolio unless they start with "/" for files in public/.
 */
export const heroArt = {
  mascot: { src: '/art/my-avatars/trnsprn.webp', width: 1080, height: 1080, alt: 'Tonni, drawn as a fanged girl holding a giant pencil' },
  sticker: { src: '/art/my-avatars/tortilla.webp', width: 1080, height: 1350, alt: 'Tortilla, a scruffy little self-portrait' },
};

/** The story, read in as you scroll. Short lines land better than long ones. */
export const story =
  'Curious by nature, creative by instinct, and occasionally a troublemaker with a prototype.';

/** Three short paragraphs under the story. */
export const about = {
  research: 'How people understand, trust and stay in control of AI, and how games and animation can be studied as interaction.',
  games: 'I make characters, game assets and levels, and I care about how a screen feels to use as much as how it looks.',
};

/** Research interests, in my order. Keep it short. */
export const researchInterests = [
  'Human-AI Interaction and Human-Centered Agentic AI',
  'Trust, Transparency, and Explainability in AI Systems',
  'UX Research and User-Centered Design',
  'Interactive and Adaptive User Interfaces',
  'Game User Experience and Player-Computer Interaction',
  'Interactive Animation and Motion-Based Interfaces',
  'AI-Assisted Game Design and Procedural Content Generation',
];

export const creativeInterests = [
  '2D and 3D game asset creation',
  'Game art and visual development',
  'Level design and environment design',
  'Game UI/UX and interaction design',
  'Animation and motion design',
  'Interactive environments',
  'Creative ideation and game development',
];

export const interestsNote =
  'The thread through all of it: using HCI research to make games and interactive animation better to play, use and watch.';

/** Tools, grouped by what they are for. Most-used first in each group. */
export const skillGroups = [
  { title: 'Programming languages', items: [
    { name: 'Python' }, { name: 'JavaScript' }, { name: 'HTML' }, { name: 'CSS' },
    { name: 'C' }, { name: 'C++' }, { name: 'PHP' }, { name: 'SQL' },
  ] },
  { title: 'AI, machine learning and data', items: [
    { name: 'PyTorch' }, { name: 'Scikit-learn' }, { name: 'NumPy' },
    { name: 'Pandas' }, { name: 'Matplotlib' }, { name: 'Google Colab' }, { name: 'Jupyter Notebook' },
  ] },
  { title: 'Design and creative tools', items: [
    { name: 'Clip Studio Paint' }, { name: 'Aseprite' }, { name: 'Figma' }, { name: 'Krita' },
    { name: 'Blender' }, { name: 'Adobe Photoshop' }, { name: 'Adobe Illustrator' },
  ] },
  { title: 'Game development and interactive media', items: [
    { name: 'Godot' }, { name: 'Unity' }, { name: 'Unreal Engine' },
  ] },
  { title: 'Research and version control', items: [
    { name: 'Git and GitHub' }, { name: 'LaTeX' }, { name: 'Kaggle' },
  ] },
  { title: 'Web development', items: [
    { name: 'Next.js' }, { name: 'Astro' }, { name: 'TypeScript' },
    { name: 'Supabase' }, { name: 'Tailwind' }, { name: 'Capacitor' },
  ] },
];

/** Projects and initiatives. Shetu goes first: it is the newest and still an idea. */
export const built = [
  { name: 'Shetu', what: 'An AI-powered employer role ledger. It keeps work going when someone is on leave through AI-assisted role documentation, responsibility tracking and structured handover planning, and eases the return to work.', meta: 'GP Futuremakers · idea selected for the second round', live: null, code: null },
  { name: 'A Small Journey', what: 'A 2D platformer about empathy: a boy who stomps on ants wakes up as one. Made in a week by team Phat_Cat, where I was the character and game artist.', meta: '12th IUT ICT Fest 2026 GameJam · finalist · Godot 4', live: 'https://xiao-maow.itch.io/a-small-journey', code: 'https://github.com/AntiLogicZ9/IUTGameJam' },
  { name: 'Tortfolio', what: 'My art and creative technology portfolio: digital illustration, visual storytelling, game assets, UI/UX and interactive experiences. Built with a media pipeline, a comic reader and a reel player.', meta: 'Next.js · Tailwind', live: 'https://tortfolio-art.vercel.app', code: 'https://github.com/tonni19/tortfolio' },
  { name: 'Nestly', what: 'Shared student housing, verified: itemised rent, flatmate matching, mess bills and a second-hand marketplace.', meta: 'Next.js 16 · Supabase · with SpicyFalcon619', live: 'https://nestly-core.vercel.app', code: 'https://github.com/SpicyFalcon619/nestly-core' },
  { name: 'AppleDHD', what: 'A hand-drawn personal planner: calendar, tasks, goals, cycle, budget and notes, kept on your device.', meta: 'Next.js · Capacitor · web, Android, iOS', live: 'https://appledhd.vercel.app/', code: null },
  { name: 'UIUNest', what: 'The first version of Nestly: housing and flatmate matching for UIU students.', meta: 'HTML · JS · Leaflet', live: null, code: 'https://github.com/tonni19/UIUNest' },
];

/**
 * Social and professional profiles, shown in the contact section and footer.
 * A profile with url: null stays hidden until you add its link.
 */
export const socials: { label: string; url: string | null; icon: string }[] = [
  { label: 'GitHub', url: site.github, icon: 'github' },
  { label: 'LinkedIn', url: null, icon: 'users' },
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
