/* ==========================================================================
   MNEMOS-87 · CONTENT FILE
   Everything you'll want to edit lives here. No build step: save & refresh.
   Fields set to null render as a black "redacted" bar on purpose.
   ========================================================================== */

window.SITE = {
  // ---- identity ----------------------------------------------------------
  name: "Sadia Noman Tonni",
  handle: "TONNI",            // short name shown on the phone, dialogue and boot screen
  role: "art · game assets · ui/ux · ai × hci research",
  email: "hello@example.com", // TODO: your public contact email (used by the contact form)
  artPortfolio: "https://tortfolio-art.vercel.app/",
  github: "https://github.com/tonni19",

  // ---- home dialogue (click / ↵ to advance) -----------------------------
  dialogue: [
    "Salutations.",
    "I'm Tonni. You found my little room. It's always 1:44 am in here.",
    "I draw, build the worlds my drawings live in, and study how people and machines understand each other.",
    "Where do you want to go?"
  ],

  // ---- profile -----------------------------------------------------------
  profile: {
    status: "AWAKE",
    fields: [
      ["Name",     "Sadia Noman Tonni"],
      ["Alias",    "Tortilla (art)"],
      ["Studies",  "United International University"],
      ["Based in", null],
      ["Hobby",    "drawing in the dark"],
      ["Fear",     "unsaved files"],
      ["Height",   "? ft. ?"]
    ],
    about: [
      "I like the moment before a project exists, when it's just a weird idea on a sticky note.",
      "As Tortilla I draw characters, game art, comics and hand-drawn animation. As a builder I turn ideas into things people actually use, like a hand-drawn planner and a student housing platform.",
      "In research I work on AI × HCI. Most recently: what people can and can't tell about the rules an AI uses to reuse its memories."
    ],
    whisper: "it remembers every visitor.",
    tags: ["character design", "game art", "comics", "animation", "UI/UX", "Next.js", "HCI", "AI memory", "worldbuilding"]
  },

  // level: 1–10 segments
  interests: [
    { name: "Project Ideation",          level: 9, note: "notebooks full of half-born worlds" },
    { name: "Game Dev · Asset Creation", level: 9, note: "characters, game art, hand-drawn animation" },
    { name: "UI / UX Design",            level: 8, note: "interfaces with a pulse" },
    { name: "AI & HCI Research",         level: 8, note: "how humans read machines" }
  ],

  // ---- work & tools: GRiD-style file list -------------------------------
  // kind: GAME | ASSET | UI | RESEARCH | ART | IDEA | TOOL   (tabs only show kinds that have files)
  // label: the right-hand column text (like "Run", "Font" on the GRiD)
  // url: "@art" = art portfolio, null = "coming soon"
  files: [
    { name: "Tortfolio",       ext: "LNK", kind: "ART",      label: "Link",
      device: "Web", subject: "Illustration", title: "Tortfolio, my art portfolio",
      status: "online", url: "@art",
      desc: "My art as Tortilla: character design, game art, comics, wallpapers and hand-drawn animation." },
    { name: "MemoryPreview",   ext: "RES", kind: "RESEARCH", label: "Paper",
      device: "Node · Python · LaTeX", subject: "AI × HCI", title: "What a Memory Preview Cannot Tell You",
      status: "ACM IUI 2027 poster", url: "https://github.com/tonni19/memory-preview-ambiguity",
      desc: "Ambiguity in AI memory permissions: which rules a preview can't tell apart, which follow-up requests resolve them, and a pilot survey. With Nafis Fuad Shahid." },
    { name: "AppleDHD",        ext: "APP", kind: "UI",       label: "Run",
      device: "Next.js · Capacitor", subject: "Product · UI", title: "A hand-drawn personal planner",
      status: "live · web, Android, iOS", url: "https://appledhd.vercel.app/",
      desc: "Calendar, tasks, goals, cycle, budget and notes over my own artwork. Everything stays on your device." },
    { name: "UIUNest",         ext: "WEB", kind: "UI",       label: "Run",
      device: "HTML · JS · Leaflet", subject: "Platform · UX", title: "Student housing for UIU",
      status: "built", url: "https://github.com/tonni19/UIUNest",
      desc: "Verified housing, flatmate compatibility matching, an exchange marketplace, mess bills and an admin dashboard in one app." },
    { name: "Tortfolio_src",   ext: "WEB", kind: "UI",       label: "Profile",
      device: "Next.js · Tailwind", subject: "Web · Art", title: "The portfolio, as code",
      status: "deployed", url: "https://github.com/tonni19/tortfolio",
      desc: "Static Next.js site with a media pipeline, a comic reader, a reel player and day/night themes." },
    { name: "Mnemos87",        ext: "UI",  kind: "UI",       label: "Profile",
      device: "HTML · CSS · JS", subject: "Interface", title: "This website",
      status: "you are inside it", url: null,
      desc: "A retro OS as a personal archive. Every object on the desk is a working control." },
    { name: "dont_open",       ext: "???", kind: "IDEA",     label: "Locked",
      device: "Bubble Memory", subject: "???", title: null,
      status: "locked", locked: true, url: null,
      desc: "This file requires a password." },

    // tools: taken from the repos above. Add your drawing / game tools here.
    { name: "NextJS",     ext: "EXE", kind: "TOOL", label: "Run", device: "Web",     subject: "Framework", title: "Sites & apps",        status: "often",    desc: "AppleDHD, Tortfolio." },
    { name: "TypeScript", ext: "EXE", kind: "TOOL", label: "Run", device: "Web",     subject: "Language",  title: "Typed front-ends",    status: "often",    desc: "Most of my web projects." },
    { name: "Tailwind",   ext: "EXE", kind: "TOOL", label: "Run", device: "Web",     subject: "Styling",   title: "UI systems",          status: "often",    desc: "Tortfolio's styling." },
    { name: "Capacitor",  ext: "EXE", kind: "TOOL", label: "Run", device: "Mobile",  subject: "Native",    title: "Web to Android and iOS", status: "sometimes", desc: "Shipping AppleDHD as a phone app." },
    { name: "Python",     ext: "EXE", kind: "TOOL", label: "Run", device: "Desktop", subject: "Research",  title: "Analysis & figures",  status: "research", desc: "Analysis scripts and paper figures." },
    { name: "LaTeX",      ext: "EXE", kind: "TOOL", label: "Run", device: "Desktop", subject: "Writing",   title: "Papers",              status: "research", desc: "The IUI 2027 poster paper." }
  ],

  // ---- timeline (oldest first). Add earlier tapes whenever you like ----
  timeline: [
    { year: "2026.05", title: "AppleDHD begins",              tag: "UI",       text: "A planner drawn by hand, built with Next.js and wrapped for Android and iOS." },
    { year: "2026.06", title: "UIUNest",                      tag: "UI",       text: "A housing and flatmate platform for UIU students, landlords and admins." },
    { year: "2026.09", title: "Tortfolio goes live",          tag: "ART",      text: "A home for Tortilla's characters, comics and hand-drawn animation." },
    { year: "2026.11", title: "Poster paper for ACM IUI 2027", tag: "RESEARCH", text: "What a memory preview cannot tell you: ambiguity in AI memory permissions." },
    { year: "2026.11", title: "Built this room",              tag: "NOW",      text: "Moved everything I make into one archive. You are reading it." },
    { year: "????",    title: "[ tape is blank past this point ]", tag: "???",  text: "", blank: true }
  ],

  // ---- art wall (Work section). Files live in assets/art/, all from the Tortfolio repo.
  //      size: "big" (2×2), "tall" (1×2), "wide" (2×1) or leave it out (1×1).
  art: [
    { src: "assets/art/cosmos.webp",           title: "Cosmos",            kind: "Portrait",       size: "big"  },
    { src: "assets/art/spearbearer.webp",      title: "Spearbearer",       kind: "Game character", size: "tall" },
    { src: "assets/art/the-hut.mp4", poster: "assets/art/the-hut-poster.webp", title: "The hut", kind: "Animation", size: "tall" },
    { src: "assets/art/grocers-stall.webp",    title: "Grocer's stall",    kind: "Game asset" },
    { src: "assets/art/umbrella-cart.webp",    title: "Umbrella cart",     kind: "Game asset" },
    { src: "assets/art/we-stay-prepared.webp", title: "We stay prepared",  kind: "Comic",          size: "tall" },
    { src: "assets/art/smoke.webp",            title: "Smoke",             kind: "Portrait",       size: "tall" },
    { src: "assets/art/ants-the-anthill.webp", title: "Ants: the anthill", kind: "Comic",          size: "wide" },
    { src: "assets/art/nimbu.webp",            title: "Nimbu",             kind: "Illustration",   size: "tall" },
    { src: "assets/art/strike.webp",           title: "Strike",            kind: "Wallpaper",      size: "tall" },
    { src: "assets/art/two-fish.webp",         title: "Two fish",          kind: "Portrait",       size: "wide" },
    { src: "assets/art/jai-jai-store.webp",    title: "Jai Jai store",     kind: "Game asset" },
    { src: "assets/art/coco.webp",             title: "Coco",              kind: "Portrait" }
  ],

  // ---- contact channels --------------------------------------------------
  links: [
    { label: "EMAIL",         url: "mailto:@email",               note: "fastest" },
    { label: "ART PORTFOLIO", url: "@art",                        note: "as Tortilla" },
    { label: "GITHUB",        url: "https://github.com/tonni19",  note: "tonni19" },
    { label: "APPLEDHD",      url: "https://appledhd.vercel.app/", note: "try the planner" }
  ],

  // ---- memo pad: changes per room ---------------------------------------
  memo: {
    home:     [["Wake up", true], ["Look around", true], ["Don't open the folder", false]],
    work:     [["Sort the files", true], ["Feed the pet", false], ["Draw new icons", false]],
    profile:  [["Update profile", true], ["Remember my name", true], ["Drink water", false]],
    timeline: [["Rewind the tapes", true], ["Find tape ????", false], ["Don't watch alone", false]],
    contact:  [["Check messages", true], ["Call back", false], ["Leave the room", false]]
  },
  dreadMemo: "WHO WROTE THIS"
};
