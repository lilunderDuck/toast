import type { CompressedLibaryData, LibaryUsedData } from "~/api/misc"
import { bson_readFile, INTERNAL_DATA_FOLDER } from "~/server"

export async function getListOfLibaryUsed() {
  const data = await bson_readFile(`${INTERNAL_DATA_FOLDER}/libUsed.bin`) as CompressedLibaryData[]
  const outputData = [] as LibaryUsedData
  for (const [type, name, version, author, homepageUrl, description] of data) {
    outputData.push({
      type: type,
      name: name,
      version: version,
      author: author,
      homepageUrl: homepageUrl,
      description: description,
    })
  }

  return outputData
}