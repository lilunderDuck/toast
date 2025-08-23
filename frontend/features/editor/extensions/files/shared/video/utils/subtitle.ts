import { getFilenameFromUrl, trimFileExtension } from "~/utils"

export async function getThisVideoSubtitlePath(originalFilePath: string) {
  console.log(originalFilePath)
  // eg: /path/to/video.mp4
  const thisVideoPath = originalFilePath
  const thisVideoFilename = getFilenameFromUrl(thisVideoPath)
  // /path/to/video.mp4 -> video.mp4
  const basePath = thisVideoPath.replace(thisVideoFilename, "")
  // /path/to/video.mp4 -> /path/to/
  const subtitleFilePath = `${basePath}${trimFileExtension(thisVideoFilename)}.vtt` as const
  // /path/to/ + video.mp4 -> video + .vtt -> /path/to/video.vtt
  const response = await fetch(subtitleFilePath, {
    method: "GET"
  })

  if (response.status >= 400) {
    return console.log("a subtitle file could not be found next to", thisVideoPath, ". Place a subtitle file next to", subtitleFilePath, "and try to reload again")
  }

  console.log("found subtitle file:", subtitleFilePath)
  return subtitleFilePath
}