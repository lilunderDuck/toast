import { copyFileSync } from "node:fs"
import { mangleProps } from "../tools"
import {
  createDir,
  type FileInfo,
  writeFile,
} from "../utils"

type OptimizedFileInfo = FileInfo & {
  optimized: string
}

export function copyOthersFiles<const T extends string>(to: T, fileTypes: FileInfo[]) {
  for (const file of fileTypes) {
    copyFileSync(file.path, `${to}/${file.fileName}`)
  }
}

export function manglePropsManually(fileTypes: FileInfo[]) {
  const optimizedInfo = []
  const optimizedFiles: OptimizedFileInfo[] = []

  for (const file of fileTypes) {
    const content = mangleProps(file.content as string)
    const originalLength = file.content.length
    optimizedInfo.push({
      "file name": file.fileName,
      "original size": file.content.length,
      "optimized size": content.length,
      "delta": originalLength - content.length,
    })

    optimizedFiles.push({
      ...file,
      optimized: content,
    })
  }

  console.table(optimizedInfo)

  return optimizedFiles
}

export function createOutputDirectory<const T extends string>(to: T) {
  createDir(to)
}

export function writeAllProcessedFile<const T extends string>(to: T, optimizedFiles: OptimizedFileInfo[]) {
  console.log("\nDone, now writing the files...")
  for (const someFiles of optimizedFiles) {
    writeFile(`${to}/${someFiles.fileName}`, someFiles.optimized)
  }

  console.log(
    "\nNeat! But you still have to check if it's working or not tho...",
  )
}