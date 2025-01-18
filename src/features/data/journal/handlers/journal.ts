import { type CompressedJournalData, type IJournalData } from "~/api/journal"
import { IFileCompression, IFileHandler, type Updater, buildJournalPath, createFileHandler, readAndUpdatePreviousIfNeeds } from "../utils"
import { bson_readFile, bson_writeFile, deleteFile } from "~/server"

interface IJournalFileHandler extends IFileHandler, IFileCompression<IJournalData, CompressedJournalData> {
  write$(groupId: string, journalId: string, data: Updater<IJournalData>): Promise<void>
  read$(groupId: string, journalId: string): Promise<IJournalData>
  delete$(groupId: string, journalId: string): Promise<void>
}

export const journalFileHandler = createFileHandler<IJournalFileHandler>(() => {
  const write: IJournalFileHandler["write$"] = async(groupId, journalId, data) => {
    const path = buildJournalPath(groupId, journalId)
    const dataToWrite = await readAndUpdatePreviousIfNeeds(data, read, groupId, journalId)
    const compressedData = compress(dataToWrite)

    await bson_writeFile<CompressedJournalData>(path, compressedData)
  }

  const read: IJournalFileHandler["read$"] = async(groupId, journalId) => {
    const path = buildJournalPath(groupId, journalId)
    const compressedData = await bson_readFile<CompressedJournalData>(path)

    return decompress(compressedData!)
  }

  const deleteThisFile: IJournalFileHandler["delete$"] = async(groupId, journalId) => {
    const path = buildJournalPath(groupId, journalId)

    await deleteFile(path)
  }

  const compress: IJournalFileHandler["compress$"] = (incomingData) => {
    const {type, id, created, modified, name, data} = incomingData
    return {
      0: [type, id, created, modified, name, data]
    } as CompressedJournalData
  }

  const decompress: IJournalFileHandler["decompress$"] = (compressedData) => {
    const [type, id, created, modified, name, data] = compressedData[0]
    return { 
      type: type, 
      id: id, 
      created: created, 
      modified: modified, 
      name: name, 
      data: data 
    }
  }

  return {
    write$: write,
    read$: read,
    delete$: deleteThisFile,
    compress$: compress,
    decompress$: decompress
  }
})