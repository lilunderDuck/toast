import { getRandomElement } from "~/common"
import { INTERNAL_DATA_FOLDER, internalCache, json_readFile } from "~/server"

export async function getSplashTextRandomly() {
  const splashTextRawData = await json_readFile<string[]>(`${INTERNAL_DATA_FOLDER}/splash_text.json`)
  console.assert(splashTextRawData, `${INTERNAL_DATA_FOLDER}/splash_text.json:`, 'file not found')

  const lastText: string = internalCache.get('splash-text')
  let newlyGeneratedText = ''
  while (true) {
    const newText = getRandomElement(splashTextRawData!)
    if (lastText !== newText) {
      newlyGeneratedText = newText
      break
    }
  }

  if (newlyGeneratedText.startsWith('https://')) {
    const response = await fetch(newlyGeneratedText)
    newlyGeneratedText = await response.text()
  }

  internalCache.set('splash-text', newlyGeneratedText)

  return newlyGeneratedText
}