/**
 * Links inside this site. The site is served from a sub-path on GitHub Pages
 * (https://tonni19.github.io/SNT/), so every internal link goes through here.
 * Change `base` in astro.config.mjs and every link follows.
 *
 *   url('/#work')                       -> /SNT/#work
 *   url('/research/my-paper/')          -> /SNT/research/my-paper/
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => `${BASE}${path.startsWith('/') ? path : `/${path}`}`;
