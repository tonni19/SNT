#!/usr/bin/env node
/**
 * Rebuild src/content/art.json from the Tortfolio repo, so this site never
 * keeps its own copies of the artwork.
 *
 *   npm run sync-art                      (expects ../tortfolio next to this folder)
 *   npm run sync-art -- path/to/tortfolio
 *
 * Reads Tortfolio's lib/media.generated.ts (every piece, its file and size) and
 * lib/artworks.ts (titles). Images are linked from the live art site and
 * optimised by Astro at build time. Your choices in art.json survive a sync:
 * `featured` and `hidden` are kept per piece.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const repo = resolve(process.argv[2] || join('..', 'tortfolio'));
const mediaFile = join(repo, 'lib', 'media.generated.ts');
const detailsFile = join(repo, 'lib', 'artworks.ts');
if (!existsSync(mediaFile)) {
  console.error(`Can't find ${mediaFile}. Clone tortfolio next to this folder, or pass its path.`);
  process.exit(1);
}

// MEDIA is written as JSON inside the TS file
const mediaSrc = readFileSync(mediaFile, 'utf8');
const start = mediaSrc.indexOf('[', mediaSrc.indexOf('=', mediaSrc.indexOf('export const MEDIA')));
const end = mediaSrc.indexOf('];', start) + 1;
const MEDIA = JSON.parse(mediaSrc.slice(start, end));

// titles: "category/slug": { title: "..." }
const titles = {};
const detailsSrc = existsSync(detailsFile) ? readFileSync(detailsFile, 'utf8') : '';
for (const m of detailsSrc.matchAll(/"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{\s*title:\s*"([^"]+)"/g)) titles[m[1]] = m[2];

const CATEGORIES = ['portrait', 'game-characters', 'comic', 'animation', 'custom', 'wallpaper'];
const outFile = join('src', 'content', 'art.json');
const previous = existsSync(outFile) ? JSON.parse(readFileSync(outFile, 'utf8')) : [];
const keep = Object.fromEntries(previous.map((p) => [p.media, p]));

const niceTitle = (slug) => slug.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const out = MEDIA
  .filter((m) => CATEGORIES.includes(m.category))
  .map((m, order) => {
    const was = keep[m.id] || {};
    return {
      id: m.id.replace('/', '--'),
      media: m.id,
      title: titles[m.id] || niceTitle(m.slug),
      category: m.category,
      path: `/art/${m.category}/${m.slug}`,
      image: m.kind === 'image' ? m.src : (m.poster || m.src),
      width: m.width,
      height: m.height,
      featured: was.featured ?? false,
      hidden: was.hidden ?? false,
      order,
    };
  });

writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
const featured = out.filter((p) => p.featured).length;
console.log(`art.json: ${out.length} pieces from ${repo} (${featured} featured). Set "featured": true or "hidden": true per piece.`);
