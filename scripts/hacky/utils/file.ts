import { readFile } from "./fs"

export type FileInfo = {
  path: string
  content: string | Buffer
  fileName: string
}

const isJsCssOrHtmlFiles = (it: string) => it.endsWith('.js') || it.endsWith('.css') || it.endsWith('.html')

export function categorizeFileType(allFiles: string[]) {
  const mapIt = (filePath: string): FileInfo => {
    const fullPath = `./out/client/${filePath}` as const
    const content = readFile(fullPath, isJsCssOrHtmlFiles(fullPath) ? undefined : 'default')
    return {
      path: fullPath,
      content,
      fileName: fullPath.split('/').pop()!
    }
  }

  const jsFiles = allFiles
    .filter(it => it.endsWith('.js'))
    .map(mapIt)
  // 

  const cssFiles = allFiles
    .filter(it => it.endsWith('.css'))
    .map(mapIt)
  // 

  const htmlFiles = allFiles
    .filter(it => it.endsWith('.html'))
    .map(mapIt)
  // 

  const others = allFiles
    .filter(it => !isJsCssOrHtmlFiles(it))
    .map(mapIt)
  // 

  console.log('Categolized', jsFiles.length, 'js files and', cssFiles.length, 'css files')

  return {
    jsFiles,
    cssFiles,
    htmlFiles,
    others
  }
}