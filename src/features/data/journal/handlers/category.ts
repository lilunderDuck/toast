import { 
  type CompressedJournalCategoryData, 
  type IJournalCategoryData
} from "~/api/journal"
import { 
  type IFileCompression,
  type IFileHandler, 
  type Updater, 
  buildJournalPath, 
  createFileHandler, 
  readAndUpdatePreviousIfNeeds 
} from "../utils"
import { bson_readFile, bson_writeFile, deleteFile } from "~/server"

interface IJournalCategoryFileHandler extends IFileHandler, IFileCompression<IJournalCategoryData, CompressedJournalCategoryData> {
  write$(groupId: string, journalId: string, data: Updater<IJournalCategoryData>): Promise<void>
  read$(groupId: string, journalId: string): Promise<IJournalCategoryData>
  delete$(groupId: string, journalId: string): Promise<void>
}

export const journalCategoryFileHandler = createFileHandler<IJournalCategoryFileHandler>(() => {
  const write$: IJournalCategoryFileHandler["write$"] = async(groupId, journalId, data) => {
    const path = buildJournalPath(groupId, journalId)
    const dataToWrite = await readAndUpdatePreviousIfNeeds(data, read$, groupId, journalId)
    const compressedData = compress$(dataToWrite)

    await bson_writeFile<CompressedJournalCategoryData>(path, compressedData)
  }

  const read$: IJournalCategoryFileHandler["read$"] = async(groupId, journalId) => {
    const path = buildJournalPath(groupId, journalId)
    const compressedData = await bson_readFile<CompressedJournalCategoryData>(path)

    return decompress$(compressedData!)
  }

  const delete$: IJournalCategoryFileHandler["delete$"] = async(groupId, journalId) => {
    const path = buildJournalPath(groupId, journalId)

    await deleteFile(path)
  }

  const compress$: IJournalCategoryFileHandler["compress$"] = (incomingData) => {
    const { type, id, created, modified, name } = incomingData
    return [type, id, created, modified, name] as CompressedJournalCategoryData
  }

  const decompress$: IJournalCategoryFileHandler["decompress$"] = (compressedData) => {
    const [type, id, created, modified, name] = compressedData
    return { 
      type: type, 
      id: id, 
      created: created, 
      modified: modified, 
      name: name 
    }
  }

  return {
    write$: write$,
    read$: read$,
    delete$: delete$,
    compress$: compress$,
    decompress$: decompress$
  }
})