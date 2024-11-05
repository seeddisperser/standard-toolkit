import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { default as autoprefixer } from 'autoprefixer';
import lodashPlugin from 'esbuild-plugin-lodash';
import { default as postcss } from 'postcss';
import { defineConfig } from 'tsup';

async function processCss(css: string) {
  return await postcss([autoprefixer]).process(css, {
    from: undefined /* suppress source map warning */,
  }).css;
}

export default defineConfig({
  esbuildPlugins: [
    vanillaExtractPlugin({
      processCss,
    }),
    lodashPlugin(), // Must go after VE
  ],
  entry: ['src/*.ts'],
  dts: true,
  format: 'esm',
  sourcemap: true,
  splitting: true,
  treeshake: true,
});
