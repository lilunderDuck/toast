import { Image_SaveImage } from "~/wailsjs/go/backend/App";

export async function api_saveImage(currentGroupId: number, targetFile: File) {
  const imageContent = new Uint8Array(await targetFile.arrayBuffer()).toString()

  return await Image_SaveImage(currentGroupId, targetFile.name, `[${imageContent}]`)
}

export function getImagePath(currentGroupId: number, fileName: string) {
  return `/data/journals/${currentGroupId}/image/${fileName}` as const
}