// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Set this to the deployed address once the site is live (used for canonical URLs).
  // site: 'https://your-domain.example',
  devToolbar: { enabled: false },
  server: { port: 4321, host: '127.0.0.1' },
  image: {
    // artwork is linked from the art portfolio and resized here at build time
    domains: ['tortfolio-art.vercel.app'],
  },
});
