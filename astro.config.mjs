// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Hosted on GitHub Pages from the "SNT" repo: https://tonni19.github.io/SNT/
  // If the repo is renamed, change `base` to match; every internal link follows (src/lib/url.ts).
  site: 'https://tonni19.github.io',
  base: '/SNT',
  devToolbar: { enabled: false },
  server: { port: 4321, host: '127.0.0.1' },
  image: {
    // artwork is linked from the art portfolio and resized here at build time
    domains: ['tortfolio-art.vercel.app'],
  },
});
