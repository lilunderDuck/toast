/**
 * This script is used to run additional tasks (mainly for hacky purposes),
 * after vite build command.
 */

import { 
  // there's no method to copy directory from Deno namespace,
  // so I have to use this from node's.
  cp as copyDirectory 
} from "node:fs/promises"
// ...
import { SERVER_OUTPUT_DIRECTORY } from "../vite-stuff.ts"
import { fetchNpmData } from "./get-npm-meta/index.ts"

console.log('Running this script after build.')

const decoder = new TextDecoder()
const encoder = new TextEncoder()
const LIBARY_USED_FILE_PATH = './src/public/npm.generated.json' as const

console.log('Generating a list of libary that is used in the app')
let outputData
try {
  // try to read the existing built file from [LIBARY_USED_FILE_PATH]
  const binaryData = await Deno.readFile(LIBARY_USED_FILE_PATH)
  // ...and if it exists, do a bunch of decoding, because this is Deno.
  outputData = JSON.parse(
    decoder.decode(binaryData)
  )

  console.log('|  Already existed, if you want to rebuild this file, delete this file by following this file path here:', LIBARY_USED_FILE_PATH)
} catch (error) {
  // if the file not exist, rebuild it
  console.log('|  This gonna take a long time, so grab yourself a drink!')
  outputData = await fetchNpmData()
}

// save the file, so later on when you run this script
// it won't need to rebuild the file again.
// you really don't want to wait 1 minute each time you start up/build the server.
await Deno.writeFile(LIBARY_USED_FILE_PATH, encoder.encode(
  JSON.stringify(outputData)
))

const createDirectory = Deno.mkdir
try {
  await createDirectory(SERVER_OUTPUT_DIRECTORY)
} catch (error) {
  // ... nothing ...
  // if there's an error, it's just an indication that the directory is already existed.
}

// make sure to copy all of the thing to the built output directory
await copyDirectory('./src/public', SERVER_OUTPUT_DIRECTORY)

console.log('done')
export {} // suppress error