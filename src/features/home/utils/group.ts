import { IJournalGroupData, JOURNAL_GROUP_ROUTE, JournalGroupSchema } from "~/api/journal"
import { fetchIt } from "~/utils"

type Group<T extends string | undefined> = T extends undefined ? IJournalGroupData[] : IJournalGroupData

export async function api_getGroup<T extends string | undefined>(id?: T): Promise<Group<T>> {
  return await fetchIt('GET', JOURNAL_GROUP_ROUTE, id) as Group<T>
}

export async function api_createGroup(data: JournalGroupSchema) {
  return await fetchIt('POST', JOURNAL_GROUP_ROUTE, data) as IJournalGroupData
} 

export async function api_updateGroup(id: string, data: JournalGroupSchema) {
  return await fetchIt('PATCH', `${JOURNAL_GROUP_ROUTE}/${id}`, data) as IJournalGroupData
}