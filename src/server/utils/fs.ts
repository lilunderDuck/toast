import fs from 'node:fs/promises'

type fs_readFile = typeof fs['readFile']
type fs_writeFile = typeof fs['writeFile']

type ReadFileOptions = Parameters<fs_readFile>[1]
/**Reads a file from some `filePath`, returns `null` if `filePath` is not found
 * @param filePath  the file path
 * @param options   file reading options. You can set the encoding like so
 * ```
 * await readFile('/some/path.txt', {
 *   encoding: 'utf-8'
 * })
 * ```
 * @returns the file data or `null` if it could not find the given path
 */
export async function readFile<
  const T extends string
>(filePath: T, options?: ReadFileOptions) {
  console.log(`[files]\t\t read: ${filePath} with options:`, JSON.stringify(options))
  try {
    return await fs.readFile(filePath, options)
  } catch(error) {
    console.error('[files]\t\t Cannot read this file', filePath, ', the rest of the error is\n', error)
    return null
  }
}

/**Deletes a file from `filePath`, that it.
 * 
 * If there's any error while deleting the file, then it just log the error out
 * without crashing the program.
 * @param filePath 
 */
export async function deleteFile<const T extends string>(filePath: T) {
  console.log(`[files]\t\t delete: ${filePath}`)
  try {
    await fs.unlink(filePath)
  } catch(error) {
    console.error(error)
  }
}

type SomeDataType = Parameters<fs_writeFile>[1]
type WriteFileOptions = Parameters<fs_writeFile>[2]
/**Writes some `data` to `filePath`. In the process, it creates a new file
 * if that file currently does not exist.
 * @param filePath 
 * @param data 
 * @param options   
 * @returns 
 */
export function writeFile<
  const T extends string, 
  U extends SomeDataType
>(filePath: T, data: U, options?: WriteFileOptions) {
  console.log(`[files]\t\t write: ${filePath}`)
  return fs.writeFile(filePath, data, options)
}

/**The name is obvious :)
 * 
 * Example:
 * ```
 * // create a folder
 * createDirectoryIfNotExist('/some-folder')
 * 
 * // recursively create a folder
 * createDirectoryIfNotExist('/path/to/some/where')
 * ```
 * @param filePath 
 * @returns 
 */
export async function createDirectoryIfNotExist<
  const T extends string
>(filePath: T) {
  console.log('[files]\t\t creating', filePath, 'if it\'s not exist')
  if (!await isThisDirectoryExist(filePath)) {
    console.log('[files]\t\t | creating a new one')
    return await fs.mkdir(filePath, {
      recursive: true
    })
  }

  console.log('[files]\t\t we don\'t need to create', filePath)
}

export async function isThisDirectoryExist<
  const T extends string
>(filePath: T) {
  try {
    console.log(`[files]\t\t instant check: check ${filePath} is exist or not`)
    await fs.access(filePath, fs.constants.F_OK)
    console.log(`[files]\t\t | okay: looking good`)
    return true
  } catch(error) {
    console.log('[files]\t\t | well, it does not exist')
    return false
  }
}

export async function deleteDirectory<
  const T extends string
>(filePath: T) {
  try {
    await fs.unlink(filePath)
  } catch (e) {
    console.log('[files]\t\t |', e)
  }
}

export function getEverythingFromDir<const T extends string>(filePath: T, recursive?: boolean) {
  return fs.readdir(filePath, {
    recursive
  })
}