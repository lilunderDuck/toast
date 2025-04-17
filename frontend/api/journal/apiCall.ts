import { 
  type IJournalData, 
  type IJournalGroupData, 
  type JournalContentData, 
  type JournalGroupSchema, 
  type JournalSchema, 
  JournalType 
} from "./stuff"
import { __callBackendApi } from "../call"
import { apiCallLog } from "~/features/debug"

export async function api_createJournal(currentGroupId: number, data: JournalSchema, type: JournalType): Promise<IJournalData> {
  return await __callBackendApi('POST', `/duck/journal/${currentGroupId}`, {
    ...data,
    type
  })
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return await __callBackendApi('DELETE', `/duck/journal/${currentGroupId}/${someJournalId}`)
}

export async function api_getJournal(currentGroupId: number, someJournalId: number): Promise<IJournalData> {
  return (await __callBackendApi('GET', `/duck/journal/${currentGroupId}/${someJournalId}`))!
}

export async function api_getAllJournal(currentGroupId: number): Promise<Record<string, IJournalData>> {
  return (await __callBackendApi('GET', `/duck/journal/${currentGroupId}`))!
}

export async function api_updateJournal(currentGroupId: number, someJournalId: number, data: Partial<IJournalData>): Promise<IJournalData> {
  return (await __callBackendApi('PATCH', `/duck/journal/${currentGroupId}/${someJournalId}`, {
    name: data.name,
  }))!
}

export async function api_saveJournalContent(currentGroupId: number, someJournalId: number, data: JournalContentData) {
  if (!someJournalId) {
    isDevMode && apiCallLog.log("Refused to save journal content. The requested journal id is", someJournalId)
    
    return 
  }

  (await __callBackendApi('PATCH', `/duck/journal/${currentGroupId}/${someJournalId}`, {
    data: data,
  }))!
}

export async function api_getJournalVirturalFileTree(currentGroupId: number): Promise<any[]> {
  return (await __callBackendApi('GET', `/duck/journal-group/${currentGroupId}/tree`))! as any[]/*<- missing type*/
}

export async function api_updateJournalVirturalFileTree(currentGroupId: number, data: any[]/*<- missing type*/) {
  return (await __callBackendApi('PATCH', `/duck/journal-group/${currentGroupId}/tree`, data))!
}

type Group<T extends number | undefined> = T extends undefined ? IJournalGroupData[] : IJournalGroupData
export async function api_getGroup<T extends number | undefined>(id?: T): Promise<Group<T>> {
  if (!id) {
    return await __callBackendApi('GET', `/duck/journal-group`) as Group<undefined>
  }

  return await __callBackendApi('GET', `/duck/journal-group/${id}`) as Group<number>
}

export async function api_createGroup(data: JournalGroupSchema): Promise<IJournalGroupData> {
  return (await __callBackendApi('POST', `/duck/journal-group`, data))!
} 

export async function api_updateGroup(id: number, data: JournalGroupSchema): Promise<IJournalGroupData> {
  return (await __callBackendApi('PATCH', `/duck/journal-group/${id}`, data))!
}