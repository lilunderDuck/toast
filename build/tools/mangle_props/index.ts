/**This script deals with props mangling.
 * 
 * If you're just poking around or reading the code, sometime you see this:
 * ```
 * return {
 *   async fetch$() {
 *     // ...
 *   },
 *   groups$: journalGroups,
 *   // ...
 * }
 * ```
 * 
 * The reason why it named like that is I want to mangle those props manually,
 * just for the sake of reducing final build size.
 * 
 * Yeah I could use both of esbuild's [mangle props](https://esbuild.github.io/api/#mangle-props) and
 * [mangle quoted](https://esbuild.github.io/api/#mangle-quoted) (vite does have way to use esbuild stuff), 
 * but it breaks in very unexpected way for some reason lol.
 */
import { writeFile } from "node:fs/promises"
import { getRandomChar } from "./random"
import { getAllFiles, getTokens } from "./token"
import path from "node:path"


const fileData = await getAllFiles()
let propList: Set<string> | string[][] = []
for (const data of fileData) {
  propList.push(getTokens(data))
}

propList = new Set(propList.flat())

const propsToken = new Map<string, string>()
const randomGenerator = getRandomChar()
for (const propName of propList) {
  if (propName.length <= 3) {
    continue // skip
  }
  propsToken.set(propName, randomGenerator.next().value!)
}

const MANUAL_MANGLE = [
  '__vite__mapDeps',
  'indeterminate',
  'stopPropagation'
]

for (let i = 0; i < fileData.length; i++) {
  const file = fileData[i];
  let fileContent = file.content
  for (const [propName, mangledPropName] of propsToken) {
    fileContent = fileContent.replaceAll(propName, mangledPropName)
  }

  console.log(`${file.name}\t\t${file.content.length} chars\t${fileContent.length} chars\t\tratio ${file.content.length - fileContent.length}`)
}

await writeFile(path.join(import.meta.dirname, "token.json"), JSON.stringify({
  datas: fileData,
  token: Object.fromEntries(propsToken.entries())
}, null, 2))