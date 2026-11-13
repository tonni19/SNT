/**
 * MNEMOS-87 · site data
 * The things that rarely change: identity, rooms, dialogue, profile, the GRiD
 * file list, timeline, memo notes. Things that grow over time (art, UI/UX case
 * studies, research, achievements) live in src/content/ instead.
 * A field set to null renders as a black "redacted" bar on purpose.
 */

export const site = {
  name: 'Sadia Noman Tonni',
  handle: 'TONNI',
  role: 'art · game assets · ui/ux · ai × hci research',
  email: 'sadiatonni1916@gmail.com',
  artPortfolio: 'https://tortfolio-art.vercel.app',
  github: 'https://github.com/tonni19',
};

/**
 * The rooms, top to bottom. `id` matches the section id on the page.
 * lcd: four characters for the LCD clock. icon: a Lucide icon from Icons.astro.
 */
export const sections = [
  { id: 'home',         lcd: 'HOME', title: 'Home',                     nav: 'Home',         label: 'Run',      status: 'AWAKE',       icon: 'house' },
  { id: 'work',         lcd: 'WORK', title: 'Work & Tools',             nav: 'Work',         label: 'Files',    status: 'WORKING',     icon: 'folder' },
  { id: 'uiux',         lcd: 'UIUX', title: 'UI/UX Lab',                nav: 'UI/UX',        label: 'Lab',      status: 'SKETCHING',   icon: 'layout' },
  { id: 'art',          lcd: 'ART',  title: 'Art',                      nav: 'Art',          label: 'Channels', status: 'DRAWING',     icon: 'palette' },
  { id: 'research',     lcd: 'RSCH', title: 'Research',                 nav: 'Research',     label: 'Papers',   status: 'THINKING',    icon: 'flask' },
  { id: 'achievements', lcd: 'EVNT', title: 'Achievements & Events',    nav: 'Achievements', label: 'Log',      status: 'COMPETING',   icon: 'trophy' },
  { id: 'profile',      lcd: 'PRFL', title: 'Profile',                  nav: 'Profile',      label: 'Profile',  status: 'OBSERVED',    icon: 'user' },
  { id: 'timeline',     lcd: 'LOGS', title: 'Timeline',                 nav: 'Timeline',     label: 'Tapes',    status: 'REMEMBERING', icon: 'cassette-tape' },
  { id: 'contact',      lcd: 'CALL', title: 'Contact',                  nav: 'Contact',      label: 'Com',      status: 'LISTENING',   icon: 'phone' },
] as const;

export const dialogue = [
  'Salutations.',
  "I'm Tonni. You found my little room. It's always 1:44 am in here.",
  'I draw, design interfaces, build the worlds my drawings live in, and study how people and machines understand each other.',
  'Where do you want to go?',
];

export const profile = {
  status: 'AWAKE',
  fields: [
    ['Name', 'Sadia Noman Tonni'],
    ['Alias', 'Tortilla (art)'],
    ['Studies', 'United International University'],
    ['Based in', null],
    ['Hobby', 'drawing in the dark'],
    ['Fear', 'unsaved files'],
    ['Height', '? ft. ?'],
  ] as [string, string | null][],
  about: [
    "I like the moment before a project exists, when it's just a weird idea on a sticky note.",
    'As Tortilla I draw characters, game art, comics and hand-drawn animation. As a builder I turn ideas into things people actually use, like a hand-drawn planner and a student housing platform.',
    "In research I work on AI × HCI. Most recently: what people can and can't tell about the rules an AI uses to reuse its memories.",
  ],
  whisper: 'it remembers every visitor.',
  tags: ['character design', 'game art', 'comics', 'animation', 'UI/UX', 'Next.js', 'HCI', 'AI memory', 'worldbuilding'],
};

/** level: 1 to 10 segments */
export const interests = [
  { name: 'Project Ideation', level: 9, note: 'notebooks full of half-born worlds' },
  { name: 'Game Dev · Asset Creation', level: 9, note: 'characters, game art, hand-drawn animation' },
  { name: 'UI / UX Design', level: 8, note: 'interfaces with a pulse' },
  { name: 'AI & HCI Research', level: 8, note: 'how humans read machines' },
];

/**
 * Work & tools: the GRiD-style file list.
 * kind: GAME | ASSET | UI | RESEARCH | ART | IDEA | TOOL (tabs only show kinds that have files)
 * url: a full address, "#room" to jump to a room on this page, or null for "coming soon".
 */
export const files = [
  { name: 'Tortfolio', ext: 'LNK', kind: 'ART', label: 'Room', device: 'Web', subject: 'Illustration', title: 'Tortfolio, my art portfolio', status: 'online', url: '#art',
    desc: 'My art as Tortilla: character design, game art, comics, wallpapers and hand-drawn animation. Opens the Art room.' },
  { name: 'MemoryPreview', ext: 'RES', kind: 'RESEARCH', label: 'Paper', device: 'Node · Python · LaTeX', subject: 'AI × HCI', title: 'What a Memory Preview Cannot Tell You', status: 'ACM IUI 2027 poster', url: '/research/iui-2027-memory-preview/',
    desc: 'Ambiguity in AI memory permissions: which rules a preview cannot tell apart, which follow-up requests resolve them, and a pilot survey. With Nafis Fuad Shahid.' },
  { name: 'AppleDHD', ext: 'APP', kind: 'UI', label: 'Run', device: 'Next.js · Capacitor', subject: 'Product · UI', title: 'A hand-drawn personal planner', status: 'live · web, Android, iOS', url: 'https://appledhd.vercel.app/',
    desc: 'Calendar, tasks, goals, cycle, budget and notes over my own artwork. Everything stays on your device.' },
  { name: 'UIUNest', ext: 'WEB', kind: 'UI', label: 'Run', device: 'HTML · JS · Leaflet', subject: 'Platform · UX', title: 'Student housing for UIU', status: 'built', url: 'https://github.com/tonni19/UIUNest',
    desc: 'Verified housing, flatmate compatibility matching, an exchange marketplace, mess bills and an admin dashboard in one app.' },
  { name: 'Tortfolio_src', ext: 'WEB', kind: 'UI', label: 'Source', device: 'Next.js · Tailwind', subject: 'Web · Art', title: 'The art portfolio, as code', status: 'deployed', url: 'https://github.com/tonni19/tortfolio',
    desc: 'Static Next.js site with a media pipeline, a comic reader, a reel player and day/night themes.' },
  { name: 'Mnemos87', ext: 'UI', kind: 'UI', label: 'Source', device: 'Astro · TypeScript', subject: 'Interface', title: 'This website', status: 'you are inside it', url: null,
    desc: 'A retro OS as a personal archive. Every object on the desk is a working control.' },
  { name: 'dont_open', ext: '???', kind: 'IDEA', label: 'Locked', device: 'Bubble Memory', subject: '???', title: null, status: 'locked', locked: true, url: null,
    desc: 'This file requires a password.' },

  // tools: from my repos and my art portfolio
  { name: 'ClipStudio', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Tablet', subject: 'Drawing', title: 'Illustration, comics, animation', status: 'daily', desc: 'Most of my portraits, comics and wallpapers.' },
  { name: 'Procreate', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'iPad', subject: 'Drawing', title: 'Painting on the go', status: 'often', desc: 'Portraits and commission sketches.' },
  { name: 'Aseprite', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Desktop', subject: 'Pixel art', title: 'Sprites and game assets', status: 'game jams', desc: 'Game characters and sprites.' },
  { name: 'Callipeg', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'iPad', subject: 'Animation', title: 'Hand-drawn animation', status: 'often', desc: 'Frame-by-frame loops and shorts.' },
  { name: 'NextJS', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Web', subject: 'Framework', title: 'Sites & apps', status: 'often', desc: 'AppleDHD, Tortfolio.' },
  { name: 'TypeScript', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Web', subject: 'Language', title: 'Typed front-ends', status: 'often', desc: 'Most of my web projects, and this site.' },
  { name: 'Tailwind', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Web', subject: 'Styling', title: 'UI systems', status: 'often', desc: "Tortfolio's styling." },
  { name: 'Capacitor', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Mobile', subject: 'Native', title: 'Web to Android and iOS', status: 'sometimes', desc: 'Shipping AppleDHD as a phone app.' },
  { name: 'Python', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Desktop', subject: 'Research', title: 'Analysis & figures', status: 'research', desc: 'Analysis scripts and paper figures.' },
  { name: 'LaTeX', ext: 'EXE', kind: 'TOOL', label: 'Run', device: 'Desktop', subject: 'Writing', title: 'Papers', status: 'research', desc: 'The IUI 2027 poster paper.' },
];

/** oldest first */
export const timeline = [
  { year: '2026.05', title: 'AppleDHD begins', tag: 'UI', text: 'A planner drawn by hand, built with Next.js and wrapped for Android and iOS.' },
  { year: '2026.06', title: 'UIUNest', tag: 'UI', text: 'A housing and flatmate platform for UIU students, landlords and admins.' },
  { year: '2026.07', title: 'IUT ICT Fest game jam', tag: 'GAME', text: 'A Small Journey: a boy who stomps on ants wakes up as one. Made in a week with team Phat_Cat in Godot 4.' },
  { year: '2026.09', title: 'Tortfolio goes live', tag: 'ART', text: "A home for Tortilla's characters, comics and hand-drawn animation." },
  { year: '2026.11', title: 'Poster paper for ACM IUI 2027', tag: 'RESEARCH', text: 'What a memory preview cannot tell you: ambiguity in AI memory permissions.' },
  { year: '2026.11', title: 'Built this room', tag: 'NOW', text: 'Moved everything I make into one archive. You are reading it.' },
  { year: '????', title: '[ tape is blank past this point ]', tag: '???', text: '', blank: true },
];

/** Contact channels. "@email" and "@art" are filled in from `site`. */
export const links = [
  { label: 'EMAIL', url: 'mailto:@email', note: 'fastest', icon: 'mail', nice: 'Email' },
  { label: 'GITHUB', url: 'https://github.com/tonni19', note: 'tonni19', icon: 'github', nice: 'GitHub' },
  { label: 'ART PORTFOLIO', url: '@art', note: 'as Tortilla', icon: 'palette', nice: 'Art portfolio' },
  { label: 'APPLEDHD', url: 'https://appledhd.vercel.app/', note: 'try the planner', icon: 'external-link', nice: 'AppleDHD' },
];

export const memo: Record<string, [string, boolean][]> = {
  home: [['Wake up', true], ['Look around', true], ["Don't open the folder", false]],
  work: [['Sort the files', true], ['Feed the pet', false], ['Draw new icons', false]],
  uiux: [['Pick a product', true], ['Take it apart', false], ['Rebuild it better', false]],
  art: [['Change the channel', false], ['Sharpen the pencil', true], ["Don't draw the hallway", false]],
  research: [['Upload to arXiv', false], ['Update Scholar', false], ['Sleep', false]],
  achievements: [['Log the next event', false], ['Write the verdict', false], ['Be honest', true]],
  profile: [['Update profile', true], ['Remember my name', true], ['Drink water', false]],
  timeline: [['Rewind the tapes', true], ['Find tape ????', false], ["Don't watch alone", false]],
  contact: [['Check messages', true], ['Call back', false], ['Leave the room', false]],
};
export const dreadMemo = 'WHO WROTE THIS';

/** Art portfolio categories (each has its own page on the art site). */
export const artCategories = [
  { id: 'portrait', title: 'Portraits', path: '/work/portrait' },
  { id: 'game-characters', title: 'Game characters', path: '/work/game-characters' },
  { id: 'comic', title: 'Comics', path: '/work/comic' },
  { id: 'animation', title: 'Animation', path: '/work/animation' },
  { id: 'custom', title: 'Custom & commissions', path: '/work/custom' },
  { id: 'wallpaper', title: 'Wallpapers', path: '/work/wallpaper' },
] as const;

/** What the UI/UX lab will hold. Each shelf fills from src/content/uiux by `type`. */
export const uiuxShelves = [
  { type: 'analysis', title: 'Product analyses', blurb: 'Taking real product websites apart: what works, what doesn’t, and why.' },
  { type: 'case-study', title: 'Case studies', blurb: 'My own projects from problem to shipped interface.' },
  { type: 'recreation', title: 'Recreations', blurb: 'Rebuilding products I admire, and what I would change.' },
] as const;

/** Shipped interfaces that already exist (shown in the lab while case studies are written). */
export const shipped = [
  { title: 'AppleDHD', what: 'Hand-drawn personal planner · web, Android, iOS', url: 'https://appledhd.vercel.app/', repo: null },
  { title: 'UIUNest', what: 'Student housing and flatmate platform', url: null, repo: 'https://github.com/tonni19/UIUNest' },
  { title: 'Tortfolio', what: 'My art portfolio: comic reader, reel player, day/night themes', url: 'https://tortfolio-art.vercel.app', repo: 'https://github.com/tonni19/tortfolio' },
];
