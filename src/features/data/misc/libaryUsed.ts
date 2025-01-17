import type { LibaryUsedData } from "~/api/misc"
import { INTERNAL_DATA_FOLDER, json_readFile } from "~/server"

export async function getListOfLibaryUsed() {
  return await json_readFile(`${INTERNAL_DATA_FOLDER}/npm.generated.json`) as LibaryUsedData
}