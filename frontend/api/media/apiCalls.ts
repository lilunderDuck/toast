import { 
  Image_SaveImage, 
  Image_DeleteImage, 
  Image_DeleteGalleryImage, 
  Image_SaveGalleryImage 
} from "~/wailsjs/go/backend/App"

async function saveMediaFile(filePath: string, targetDest: string) {
  return await fetch(`http://localhost:8080/upload?requestedFile=${filePath}&dest=${targetDest}`, {
    method: "POST"
  }).then(it => it.text())
}

export async function api_saveImage(currentGroupId: number, targetFile: File) {
  const imageContent = new Uint8Array(await targetFile.arrayBuffer()).toString()

  return await Image_SaveImage(currentGroupId, targetFile.name, `[${imageContent}]`)
}

export function api_deleteImage(currentGroupId: number, fileName: string) {
  return Image_DeleteImage(currentGroupId, fileName) 
}

export async function api_saveGalleryImage(currentGroupId: number, galleryId: number, targetFile: File) {
  const imageContent = new Uint8Array(await targetFile.arrayBuffer()).toString()

  return await Image_SaveGalleryImage(currentGroupId, galleryId, targetFile.name, `[${imageContent}]`)
}

export function api_deleteGalleryImage(currentGroupId: number, galleryId: number, fileName: string) {
  return Image_DeleteGalleryImage(currentGroupId, galleryId, fileName) 
}

export function api_saveVideo(currentGroupId: number, targetFilePath: string) {
  return saveMediaFile(targetFilePath, `/journals/${currentGroupId}/vid`)
}