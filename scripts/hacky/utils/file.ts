import { readFile } from "./fs"

export type FileInfo<T> = {
  path: string
  content: T
  fileName: string
}

const isJsCssOrHtmlFiles = (it: string) => it.endsWith('.js') || it.endsWith('.css') || it.endsWith('.html')

export function categorizeFileType(basePath: string, allFiles: string[]) {
  const mapIt = <T>(filePath: string): FileInfo<T> => {
    const fullPath = `${basePath}/${filePath}` as const
    const content = readFile(fullPath, isJsCssOrHtmlFiles(fullPath) ? undefined : 'default') as T
    return {
      path: fullPath,
      content,
      fileName: fullPath.split('/').pop()!
    }
  }

  return allFiles.map(it => mapIt(it)) as FileInfo<string>[]
}