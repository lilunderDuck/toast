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

  const jsFiles = allFiles
    .filter(it => it.endsWith('.js'))
    .map(mapIt<string>)
  // 

  const cssFiles = allFiles
    .filter(it => it.endsWith('.css'))
    .map(mapIt<string>)
  // 

  const htmlFiles = allFiles
    .filter(it => it.endsWith('.html'))
    .map(mapIt<string>)
  // 

  // const others = allFiles
  //   .filter(it => !isJsCssOrHtmlFiles(it))
  //   .map(mapIt<Buffer>)
  // 

  console.log('Categolized', jsFiles.length, 'js files and', cssFiles.length, 'css files')

  return {
    jsFiles,
    cssFiles,
    htmlFiles,
    // others
  }
}