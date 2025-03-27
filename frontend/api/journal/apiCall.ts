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
  return await apiCall('Journal_Create', currentGroupId, data, type) as IJournalData
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return await apiCall('Journal_Delete', currentGroupId, someJournalId)
}

export async function api_getJournal(currentGroupId: number, someJournalId: number) {
  return await apiCall('Journal_Get', currentGroupId, someJournalId) as IJournalData
}

export function api_saveJournalContent(currentGroupId: number, someJournalId: number, data: JournalContentData) {
  return apiCall('Journal_Update', currentGroupId, someJournalId, {
    data
  })
}

export async function api_getJournalVirturalFileTree(currentGroupId: number) {
  const data = await apiCall('JournalGroup_GetVirTreeData', currentGroupId)
  return data/*<- missing type*/
}

export async function api_updateJournalVirturalFileTree(currentGroupId: number, data: any[]/*<- missing type*/) {
  return apiCall('JournalGroup_Update', currentGroupId, {
    tree: data
  })
}

type Group<T extends number | undefined> = T extends undefined ? IJournalGroupData[] : IJournalGroupData

export async function api_getGroup<T extends number | undefined>(id?: T): Promise<Group<T>> {
  if (!id) {
    return await apiCall('JournalGroup_GetAll') as Group<undefined>
  }

  return await apiCall('JournalGroup_Get', id) as Group<number>
}

export async function api_createGroup(data: JournalGroupSchema) {
  return await apiCall('JournalGroup_Create', data) as IJournalGroupData
} 

export async function api_updateGroup(id: number, data: JournalGroupSchema) {
  return await apiCall('JournalGroup_Update', id, data) as IJournalGroupData
}