import { getFilenameFromUrl, trimFileExtension } from "~/utils"

export async function getThisVideoSubtitlePath(originalFilePath: string) {
  // eg: /path/to/video.mp4
  const thisVideoPath = originalFilePath
  const thisVideoFilename = getFilenameFromUrl(thisVideoPath)
  // /path/to/video.mp4 -> video.mp4
  const basePath = thisVideoPath.replace(thisVideoFilename, "")

  let subtitleFilePaths: { name$: string, lang$: string }[] = []

  const filename = trimFileExtension(thisVideoFilename)
  const config = await getSubtitleConfig(basePath, filename)
  if (config) {
    for (const subtitleFilename of config) {
      subtitleFilePaths.push({
        name$: `${basePath}${subtitleFilename}.vtt`,
        lang$: subtitleFilename.replace(trimFileExtension(subtitleFilename), "")
      })
    }
  }

  const defaultSubtitle = await getSubtitleFileNextToThisVideo(basePath, filename)
  if (defaultSubtitle) {
    subtitleFilePaths.push({
      name$: defaultSubtitle,
      lang$: 'en'
    })
  }

  return subtitleFilePaths
}

async function getSubtitleFileNextToThisVideo(basePath: string, fileName: string) {
  // /path/to/video.mp4 -> /path/to/
  const subtitleFilePath = `${basePath}${fileName}.vtt` as const
  // /path/to/ + video.mp4 -> video + .vtt -> /path/to/video.vtt
  const response = await fetch(subtitleFilePath)

  if (response.status >= 400) {
    return console.log("a subtitle file could not be found next to", fileName, ". If you want to add English subtitle, place a subtitle file next to", subtitleFilePath, `with the name ${fileName}.vtt and try to reload again`)
  }

  return subtitleFilePath
}

async function getSubtitleConfig(basePath: string, fileName: string): Promise<void | string[]> {
  const subtitleVideoSubtitleConfig = `${basePath}${fileName}.json`
  const response = await fetch(subtitleVideoSubtitleConfig)

  if (response.status >= 400) {
    return console.log("a video config could not be found next to", fileName, ". If you want to add multiple subtitle to this video, pleace a config file next to", subtitleVideoSubtitleConfig, `with the name ${fileName}.json and try again`)
  }

  try {
    const data = await response.json()
    if (Array.isArray(data)) {
      return console.warn("Invalid format")
    }

    return data
  } catch (error) {
    return console.warn("Invalid format", error)
  }
}