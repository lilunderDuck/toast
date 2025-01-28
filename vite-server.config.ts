import { type BuildOptions, defineConfig, type InlineConfig } from 'vite'
// ...
import { VitePluginNode as nodePlugin } from 'vite-plugin-node'
// ...
import {
  getEsbuildConfig, 
  getAliasPath, 
  OUTPUT_DIRECTORY, 
  SERVER_OUTPUT_DIRECTORY
} from './vite-stuff'
import tsconfig from './tsconfig.json'

const config = (devMode: boolean): InlineConfig => {
  const enableSourceMapInDev: BuildOptions = devMode ? {
    sourcemap: true
  } : {}

  return {
    plugins: [
      // @ts-ignore
      nodePlugin({
        adapter: () => {},
        appPath: './src/entry-server.ts',
      }),
    ],
    resolve: {
      alias: getAliasPath(tsconfig, __dirname)
    },
    ...getEsbuildConfig(devMode),
    server: {
      port: 8000
    },
    cacheDir: OUTPUT_DIRECTORY,
    // bundle everything
    ssr: {
      noExternal: ['hono', 'hast-util-from-html', 'valibot', 'bson']
    },
    build: {
      assetsDir: SERVER_OUTPUT_DIRECTORY,
      target: 'esnext',
      outDir: SERVER_OUTPUT_DIRECTORY,
      minify: !devMode,
      rollupOptions: {
        treeshake: true
      }
    },
    ...enableSourceMapInDev
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const devMode = mode === 'development'
  
  return config(devMode)
})