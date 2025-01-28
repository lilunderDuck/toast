import { 
  // there's no method to copy directory from Deno namespace,
  // so I have to use this from node's.
  cp as copyDirectory 
} from "node:fs/promises"

import { SERVER_OUTPUT_DIRECTORY } from "../../../vite-stuff.ts"
import type { CompressedLibaryData, LibaryData } from "../../../src/api/misc/libaryUsed.ts"
import { bson_readFile, bson_writeFile, fetchNpmData } from "../utils/index.ts"

const LIBARY_USED_FILE_PATH = './src/public/libUsed.bin' as const

export async function fetchPackageDatasIfNeeds() {
  console.log('Generating a list of libary that is used in the app')

  let outputData: [LibaryData[], boolean]
  try {
    // try to read the existing built file from [LIBARY_USED_FILE_PATH]
    const data = await bson_readFile(LIBARY_USED_FILE_PATH)
    if (!data) {
      throw ''
    }
    
    outputData = [data, false]

    console.log('|  Already existed, if you want to rebuild this file, delete this file by following this file path here:', LIBARY_USED_FILE_PATH)
  } catch (error) {
    // if the file not exist, rebuild it
    console.log('|  This gonna take a long time, so grab yourself a drink!')
    outputData = [await fetchNpmData(), true]
  }

  return outputData
}

async function writeToDefinedDest(someData: LibaryData[]) {
  const compressed = []
  for (const packageData of someData) {
    const { type, name, version, author, homepageUrl, description } = packageData
    compressed.push([type, name, version, author, homepageUrl, description] as CompressedLibaryData)
  }

  // save the file, so later on when you run this script
  // it won't need to rebuild the file again.
  // you really don't want to wait 1 minute each time you start up/build the server.
  try {
    await bson_writeFile(LIBARY_USED_FILE_PATH, compressed)
  } catch(error) {
    // file already exist
  }
}

export async function manuallyCopyPublicFolder() {
  const [outputData, shouldCreateNewFile] = await fetchPackageDatasIfNeeds()
  if (shouldCreateNewFile) await writeToDefinedDest(outputData)
  
  const createDirectory = Deno.mkdir
  try {
    await createDirectory(SERVER_OUTPUT_DIRECTORY)
  } catch (error) {
    // ... nothing ...
    // if there's an error, it's just an indication that the directory is already existed.
  }

  // make sure to copy all of the thing to the built output directory
  try {
    await copyDirectory('./src/public', SERVER_OUTPUT_DIRECTORY)
  } catch (error) {
    // ...
  }
}