import { readFile } from "./fs"

export type FileInfo<T> = {
  path: string
  content: T
  fileName: string
}

const isJsCssOrHtmlFiles = (it: string) => it.endsWith('.js') || it.endsWith('.css') || it.endsWith('.html')

export function categorizeFileType(basePath: string, allFiles: string[]) {
  console.log('categorizing...')
  const fileInfo: FileInfo<string>[] = []
  for (const filePath of allFiles) {
    if (!isJsCssOrHtmlFiles(filePath)) continue
    const fullPath = `${basePath}/${filePath}` as const
    try {
      const content = readFile(fullPath) as string
      fileInfo.push({
        path: fullPath,
        content,
        fileName: fullPath.split('/').pop()!
      })
    } catch(e) {
      // do nothing
    }
  }

  return fileInfo
}