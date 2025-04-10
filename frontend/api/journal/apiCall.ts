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

export async function api_createJournal(currentGroupId: number, data: JournalSchema, type: JournalType) {
  return await __callBackendApi('POST', `/duck/journal/${currentGroupId}`, {
    ...data,
    type
  })
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return await __callBackendApi('DELETE', `/duck/journal/${currentGroupId}/${someJournalId}`)
}

export async function api_getJournal(currentGroupId: number, someJournalId: number) {
  return (await __callBackendApi('GET', `/duck/journal/${currentGroupId}/${someJournalId}`))!
}

export async function api_getAllJournal(currentGroupId: number) {
  return (await __callBackendApi('GET', `/duck/journal/${currentGroupId}`))!
}

export async function api_updateJournal(currentGroupId: number, someJournalId: number, data: Partial<IJournalData>) {
  return (await __callBackendApi('PATCH', `/duck/journal/${currentGroupId}/${someJournalId}`, {
    name: data.name,
  }))!
}

export async function api_saveJournalContent(currentGroupId: number, someJournalId: number, data: JournalContentData) {
  if (!someJournalId) {
    // debug-start
    apiCallLog.log("Refused to save journal content. The requested journal id is", someJournalId)
    // debug-end
    return 
  }

  (await __callBackendApi('PATCH', `/duck/journal/${currentGroupId}/${someJournalId}`, {
    data: data,
  }))!
}

export async function api_getJournalVirturalFileTree(currentGroupId: number) {
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

export async function api_createGroup(data: JournalGroupSchema) {
  return (await __callBackendApi('POST', `/duck/journal-group`, data))!
} 

export async function api_updateGroup(id: number, data: JournalGroupSchema) {
  return (await __callBackendApi('PATCH', `/duck/journal-group/${id}`, data))!
}