// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import path from 'path';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://PabloGonz68.github.io',
  vite: {
     resolve: {
      alias: {
        '@': path.resolve('./src'), // 👈 esto permite usar "@/components/..."
      },
    },
      plugins: [tailwindcss()],
	},

  integrations: [react()],
});