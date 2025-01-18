import type { 
  CompressedJournalGroupData, 
  IJournalGroupData 
} from "~/api/journal"
import { 
  buildJournalGroupPath, 
  createCacheStorage, 
  createFileHandler, 
  ICache, 
  IFileCompression, 
  type IFileHandler, 
  readAndUpdatePreviousIfNeeds, 
  type Updater 
} from "../utils"
import { 
  bson_readFile, 
  bson_writeFile, 
  CACHE_FOLDER, 
  createDirectoryIfNotExist
} from "~/server"

interface IJournalGroupFileHandler extends IFileHandler, IFileCompression<IJournalGroupData, CompressedJournalGroupData> {
  /**Writes or updates the metadata file for a specific journal group to disk.
   *
   * @param groupId   The ID of the journal group.
   * @param data             The data to write or a function that updates the existing data.
   * If you pass a function into this, it will merge the previous data with the new one.
   * @returns A `Promise` that resolves when the write operation is complete.
   */
  write$(groupId: string, data: Updater<IJournalGroupData>): Promise<void>

  /**Reads the metadata file for a specific journal group from disk.
   *
   * @param groupId The ID of the journal group.
   * @returns A Promise that resolves to the metadata object or `null` if the file doesn't exist.
   */
  read$(groupId: string): Promise<IJournalGroupData>
  delete$(groupId: string): Promise<void>
  create$(groupId: string): Promise<void>
}

export const journalGroupCache = await createCacheStorage<IJournalGroupData>(CACHE_FOLDER, 'groups')

/**The filename used for storing metadata within journal groups. */
export const META_FILE_NAME = `meta.dat`

/**This contains some file system operations to mess with journal groups data. */
export const journalGroupFileHandler = createFileHandler<IJournalGroupFileHandler>(() => {
  const write: IJournalGroupFileHandler["write$"] = async(groupId, data) => {
    const groupPath = buildJournalGroupPath(groupId)
    const newData = await readAndUpdatePreviousIfNeeds(data, read, groupId) 
    const compressed = compress(newData)
    
    return bson_writeFile(`${groupPath}/${META_FILE_NAME}`, compressed)
  }

  const read: IJournalGroupFileHandler["read$"] = async(groupId) => {
    const groupPath = buildJournalGroupPath(groupId)
    const data = await bson_readFile<CompressedJournalGroupData>(`${groupPath}/${META_FILE_NAME}`)

    return decompress(data!)
  }

  const deleteThisFile: IJournalGroupFileHandler["delete$"] = async(groupId) => {
    // ...
  }

  const compress: IJournalGroupFileHandler["compress$"] = (incomingData) => {
    const { id, created, modified, name, entries, tree, description, icon: __currentlyUnsupported } = incomingData
    return {
      0: [id, created, modified, name, description, entries, tree]
    } as CompressedJournalGroupData
  }

  const decompress: IJournalGroupFileHandler["decompress$"] = (compressedData) => {
    const [id, created, modified, name, description, entries, tree] = compressedData[0]
    return {
      id: id, 
      created: created, 
      modified: modified, 
      name: name,
      description: description, 
      entries: entries, 
      tree: tree 
    } as IJournalGroupData
  }

  const create$: IJournalGroupFileHandler["create$"] = async(groupId) => {
    const whereToCreate = buildJournalGroupPath(groupId)
  
    await createDirectoryIfNotExist(whereToCreate)
  }

  return {
    write$: write,
    read$: read,
    delete$: deleteThisFile,
    create$: create$,
    compress$: compress,
    decompress$: decompress
  }
})