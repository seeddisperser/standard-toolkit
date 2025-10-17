import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@components/button': resolve(
        __dirname,
        '../design-toolkit/components/src/components/button',
      ),
      '@components/text-field': resolve(
        __dirname,
        '../design-toolkit/components/src/components/text-field',
      ),
      '@components/chip': resolve(
        __dirname,
        '../design-toolkit/components/src/components/chip',
      ),
      '@/lib/utils': resolve(
        __dirname,
        '../design-toolkit/components/src/lib/utils',
      ),
    },
  },
});
