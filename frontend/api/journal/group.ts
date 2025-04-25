import { 
  type IJournalGroupData, 
  type JournalGroupSchema, 
} from "./stuff"
import { __callBackendApi } from "../call"
import { __throw } from "~/features/debug"

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