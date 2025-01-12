/// <reference types="deno" />

const VITE_APP_COMMAND = "vite --config ./vite-app.config.ts"
const VITE_SERVER_COMMAND = "vite --config ./vite-server.config.ts"
// const BUILD_SCRIPTS_COMMAND = "esbuild --bundle --minify --platform=node --external:esbuild"
const RUN_SERVER = "deno -A ./out/server/entry-server.mjs"

const DEV_APP = VITE_APP_COMMAND
const DEV_SERVER = `${VITE_SERVER_COMMAND} build --mode=development && ${RUN_SERVER}`
const BUILD_APP = `${VITE_APP_COMMAND} build`
const BUILD_SERVER = `${VITE_SERVER_COMMAND} build --mode=NOT-development`

// const BUILD_HACKY = `${BUILD_SCRIPTS_COMMAND} ./scripts/hacky/index.ts`

const commands = {
  preview:         RUN_SERVER,
  'dev:server':    DEV_SERVER,
  'dev:app':       DEV_APP,
  dev:             `${DEV_SERVER} & ${DEV_APP}`,
  "build:app":     "deno task vite:app build",
  "build:server":  `${VITE_SERVER_COMMAND} build --mode=NOT-development`,
  build: `${BUILD_SERVER} && ${BUILD_APP}`
} as const

const decoder = new TextDecoder("utf-8")
const data = await Deno.readFile('package.json')
const json = JSON.parse(decoder.decode(data))

json['scripts'] = commands

const encoder = new TextEncoder()
Deno.writeFile('package.json', encoder.encode(JSON.stringify(json, null, 2)))

// supress this error:
// 'await' expressions are only allowed at the top level of a file when that file is a module, but this file has no imports or exports. Consider adding an empty 'export {}' to make this file a module.
export {}