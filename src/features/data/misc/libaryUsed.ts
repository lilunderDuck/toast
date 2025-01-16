import type { OverSimpifiedNpmRegistryData } from "~/api/misc"
import { INTERNAL_DATA_FOLDER, readFile } from "~/server"

export async function getListOfLibaryUsed() {
  const splashTextRawData = await readFile(`${INTERNAL_DATA_FOLDER}/npm.generated.json`, {
    encoding: 'utf-8'
  }) as string

  return JSON.parse(splashTextRawData) as OverSimpifiedNpmRegistryData[]
}