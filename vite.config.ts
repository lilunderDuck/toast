import { 
  defineConfig, 
  type Plugin,
} from 'vite'
// ...
import solidPlugin from 'vite-plugin-solid'
import { optimizeCssModules } from 'vite-plugin-optimize-css-modules'
import { stylex as stylexPlugin } from 'vite-plugin-stylex-dev'
import { ViteImageOptimizer as imageOptimizer } from 'vite-plugin-image-optimizer'
// ...
import tsconfig from './tsconfig.json'
import { 
  BASE_OUTPUT_DIRECTORY,
  CLIENT_OUTPUT_DIRECTORY,
  getAliasPath,
  getEsbuildConfig,
  macroPlugin,
  rollupOutputOptions
} from './config'

export default defineConfig(({ command }) => {
  const devMode = command === "serve"

  return {
    plugins: [
      optimizeCssModules() as Plugin,
      solidPlugin(),
      stylexPlugin(),
      imageOptimizer() as Plugin,
      macroPlugin
    ],
    define: {
      "isDevMode": `${devMode}`,
    },
    server: {
      port: 1337
    },
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
    ...getEsbuildConfig(devMode),
    cacheDir: `${BASE_OUTPUT_DIRECTORY}/dist`,
    build: {
      outDir: CLIENT_OUTPUT_DIRECTORY,
      rollupOptions: {
        output: rollupOutputOptions
      }
    },
    publicDir: "./frontend/public"
  }
})