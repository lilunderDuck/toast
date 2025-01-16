import { getRandomElement } from "~/common"
import { INTERNAL_DATA_FOLDER, readFile } from "~/server"

let text = ''
export async function getSplashTextRandomly() {
  const splashTextRawData = await readFile(`${INTERNAL_DATA_FOLDER}/splash_text.json`, {
    encoding: 'utf-8'
  }) as string

  while (true) {
    const newText = getRandomElement<string[]>(JSON.parse(splashTextRawData))
    if (text !== newText) {
      text = newText
      break
    }
  }

  if (text.startsWith('https://')) {
    const response = await fetch(text)
    text = await response.text()
  }

  return text
}