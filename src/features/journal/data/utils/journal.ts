import crypto from "node:crypto"
// ...
import type { JournalApi } from "~/api/journal"
import { mergeObjects } from "~/common"
import { bson_readFile, bson_writeFile, deleteFile } from "~/server"
// ...
import { buildJournalGroupPath, buildJournalPath } from "./stuff"

/**The filename used for storing metadata within journal groups. */
export const META_FILE_NAME = `meta.dat`

/**Generates a random 5-byte hexadecimal string for use as an ID.
 * @returns A random hexadecimal string.
 */
export function createId() {
  return crypto.randomBytes(5).toString('hex')
}

/**A type alias representing a function that can either directly 
 * provide updated data or a function to update existing data.
 *
 * @template T The type of the data being updated.
 * @param prev The updated data or a function that takes the previous data and returns the updated data.
 * @returns The updated data.
 */
type Updater<T> = T | ((prev: T) => T)

/**This contains some file system operations to mess with journal groups data. */
export const journalGroupFs = {
  /**Reads the metadata file for a specific journal group from disk.
   *
   * @param journalGroupId The ID of the journal group.
   * @returns A Promise that resolves to the metadata object or `null` if the file doesn't exist.
   */
  $readMetaFile(journalGroupId: string) {
    const whereToUpdate = buildJournalGroupPath(journalGroupId)
    return bson_readFile<JournalApi.IGroupData>(`${whereToUpdate}/${META_FILE_NAME}`)
  },
  /**Writes or updates the metadata file for a specific journal group to disk.
   *
   * @param journalGroupId   The ID of the journal group.
   * @param data             The data to write or a function that updates the existing data.
   * @returns A `Promise` that resolves when the write operation is complete.
   */
  async $writeMetaFile(
    journalGroupId: string, 
    data: Updater<JournalApi.IGroupData>
  ) {
    const whereToUpdate = buildJournalGroupPath(journalGroupId)
    const path = `${whereToUpdate}/${META_FILE_NAME}` as const
    if (typeof data === "function") {
      let previous = await this.$readMetaFile(journalGroupId)
      let overritenData = mergeObjects(previous!, data(previous!))
      return bson_writeFile(path, overritenData)
    }
    return bson_writeFile(path, data)
  },
}

/**This contains file system operations to also mess with journals file and data. */
export const journalFs = {
  /**Reads a journal file from disk.
   * @template T       Type of the journal file data.
   * @param groupId    The ID of the journal's group.
   * @param journalId  The ID of the journal.
   * @returns A `Promise` that resolves to the journal file data or an empty object if the file doesn't exist.
   */
  async $readFile<T extends JournalApi.Files>(groupId: string, journalId: string) {
    const path = buildJournalPath(groupId, journalId)
    return await bson_readFile<T>(path) ?? {} as T
  },
  /**Writes a journal file to disk.
   * @template T       Type of the journal file data.
   * @param groupId    The ID of the journal's group.
   * @param journalId  The ID of the journal.
   * @returns A `Promise` that resolves *nothing* when the write operation is complete.
   */
  async $writeFile<T extends JournalApi.Files>(groupId: string, journalId: string, data: Updater<T>) {
    const path = buildJournalPath(groupId, journalId)
    console.group(`[journal] writing`, path, 'with', data)
    if (typeof data === "function") {
      console.log(`[journal] merging the previous data with the new one.`)
      let previous = await this.$readFile<T>(groupId, journalId)
      let overritenData = mergeObjects(previous!, data(previous!))
      await bson_writeFile(path, overritenData)
    }
    else {
      await bson_writeFile(path, data)
    }

    console.groupEnd()
  },

  $deleteFile(groupId: string, journalId: string) {
    const path = buildJournalPath(groupId, journalId)
    return deleteFile(path)
  }
}
