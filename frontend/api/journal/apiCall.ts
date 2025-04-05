import { journal } from "~/wailsjs/go/models"
// ...
import { 
  type IJournalData, 
  type IJournalGroupData, 
  type JournalContentData, 
  type JournalGroupSchema, 
  type JournalSchema, 
  JournalType 
} from "./stuff"
import { apiCall } from "../call"

export async function api_createJournal(currentGroupId: number, data: JournalSchema, type: JournalType) {
  const newData = await apiCall('CreateJournal', currentGroupId, data)
  return newData
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return await apiCall('DeleteJournal', currentGroupId, someJournalId)
}

export async function api_getJournal(currentGroupId: number, someJournalId: number) {
  return await apiCall('GetJournal', currentGroupId, someJournalId) as IJournalData
}

export async function api_getAllJournal(currentGroupId: number) {
  return await apiCall('GetAllJournal', currentGroupId) as Record<string, IJournalData>
}

export async function api_updateJournal(currentGroupId: number, someJournalId: number, data: Partial<IJournalData>) {
  const updatedData = {
    data
  } as Partial<journal.JournalUpdateSchema>

  const newData = await apiCall('UpdateJournal', currentGroupId, someJournalId, updatedData as journal.JournalUpdateSchema)
  return newData
}

export async function api_saveJournalContent(currentGroupId: number, someJournalId: number, data: JournalContentData) {
  const updatedData = {
    data
  } as Partial<journal.JournalUpdateSchema>
  const newData = await apiCall('UpdateJournal', currentGroupId, someJournalId, updatedData as journal.JournalUpdateSchema)
  // await (await journalDb).put(JOURNAL_OBJECT_STORE, newData, someJournalId)
  return newData
}

export async function api_getJournalVirturalFileTree(currentGroupId: number) {
  return await apiCall('GetGroupVirTreeData', currentGroupId)/*<- missing type*/
}

export async function api_updateJournalVirturalFileTree(currentGroupId: number, data: any[]/*<- missing type*/) {
  const updatedData = {
    tree: data
  } as Partial<journal.JournalGroupUpdateSchema>
  return apiCall('UpdateGroup', currentGroupId, updatedData as journal.JournalGroupUpdateSchema)
}

type Group<T extends number | undefined> = T extends undefined ? IJournalGroupData[] : IJournalGroupData
export async function api_getGroup<T extends number | undefined>(id?: T): Promise<Group<T>> {
  if (!id) {
    return await apiCall('GetAllGroup') as Group<undefined>
  }

  return await apiCall('GetGroup', id) as Group<number>
}

export async function api_createGroup(data: JournalGroupSchema) {
  return await apiCall('CreateGroup', data) as IJournalGroupData
} 

export async function api_updateGroup(id: number, data: JournalGroupSchema) {
  return await apiCall('UpdateGroup', id, data) as IJournalGroupData
}