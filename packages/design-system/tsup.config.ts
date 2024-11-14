import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { esbuildPluginFilePathExtensions as extensionsPlugin } from 'esbuild-plugin-file-path-extensions';
import lodashPlugin from 'esbuild-plugin-lodash';
import { defineConfig } from 'tsup';

export default defineConfig({
  esbuildPlugins: [
    vanillaExtractPlugin({
      outputCss: false,
    }),
    // Must go after VE
    lodashPlugin(),
    extensionsPlugin({
      esm: true,
      esmExtension: 'js',
    }),
  ],
  entry: ['src/**/*.{ts,tsx}', '!src/**/*.{stories,test}.{ts,tsx}'],
  dts: true,
  format: 'esm',
  sourcemap: true,
  treeshake: true,
});
