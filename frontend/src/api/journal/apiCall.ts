import { 
  JournalGroup_Create,
  JournalGroup_Delete,
  JournalGroup_Get,
  JournalGroup_GetAll,
  JournalGroup_GetVirTreeData,
  JournalGroup_Update,
  Journal_Create,
  Journal_Delete,
  Journal_Get,
  Journal_Update,
} from "~/wailsjs/go/backend/App"
// ...
import { 
  type IJournalData, 
  type IJournalGroupData, 
  type JournalContentData, 
  type JournalGroupSchema, 
  type JournalSchema, 
  JournalType 
} from "./stuff"
import type { VirFileTree } from "./virtural-tree"
export async function api_createJournal(currentGroupId: number, data: JournalSchema, type: JournalType) {
  return await Journal_Create(currentGroupId, data, type) as IJournalData
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return await Journal_Delete(currentGroupId, someJournalId)
}

export async function api_getJournal(currentGroupId: number, someJournalId: number) {
  return await Journal_Get(currentGroupId, someJournalId) as IJournalData
}

export function api_saveJournalContent(currentGroupId: number, someJournalId: number, data: JournalContentData) {
  return Journal_Update(currentGroupId, someJournalId, {
    data
  })
}

export async function api_getJournalVirturalFileTree(currentGroupId: number) {
  const data = await JournalGroup_GetVirTreeData(currentGroupId)
  return data as VirFileTree.ClientData["list"]
}

export async function api_updateJournalVirturalFileTree(currentGroupId: number, data: VirFileTree.Tree) {
  return JournalGroup_Update(currentGroupId, {
    tree: data
  })
}

type Group<T extends number | undefined> = T extends undefined ? IJournalGroupData[] : IJournalGroupData

export async function api_getGroup<T extends number | undefined>(id?: T): Promise<Group<T>> {
  if (!id) {
    return await JournalGroup_GetAll() as Group<undefined>
  }

  return await JournalGroup_Get(id) as Group<number>
}

export async function api_createGroup(data: JournalGroupSchema) {
  return await JournalGroup_Create(data) as IJournalGroupData
} 

export async function api_updateGroup(id: number, data: JournalGroupSchema) {
  return await JournalGroup_Update(id, data) as IJournalGroupData
}