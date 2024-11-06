import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { default as autoprefixer } from 'autoprefixer';
import { esbuildPluginFilePathExtensions as extensionsPlugin } from 'esbuild-plugin-file-path-extensions';
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
    extensionsPlugin({
      esm: true,
      esmExtension: 'js',
    }),
  ],
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.{stories,test}.{ts,tsx}'],
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: true,
  treeshake: true,
});
