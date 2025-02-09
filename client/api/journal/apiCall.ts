import { fetchIt } from "~/utils"
import { JOURNAL_GROUP_ROUTE, JOURNAL_ROUTE } from "./route"
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
  const route = `${JOURNAL_ROUTE}/${currentGroupId}?type=${type}` as const
  return await fetchIt('POST', route, data) as IJournalData
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return fetchIt('DELETE', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`)
}

export async function api_getAllJournals(currentGroupId: number) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}`) as IJournalData[]
}

export async function api_getJournal(
  currentGroupId: number, 
  someJournalId: number,
) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`) as IJournalData
}

export function api_saveJournalContent(
  currentGroupId: number, 
  someJournalId: number, 
  data: JournalContentData
) {
  return fetchIt('PATCH', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`, {
    data: data
  })
}

export async function api_getJournalContent(
  currentGroupId: number, 
  someJournalId: number
) {
  return await fetchIt('GET', `${JOURNAL_ROUTE}/${currentGroupId}/${someJournalId}`) as JournalContentData
}

export async function api_getJournalVirturalFileTree(
  currentGroupId: number
) {
  const data = await fetchIt('GET', `${JOURNAL_GROUP_ROUTE}/${currentGroupId}/vir-tree`) as string
  return JSON.parse(data) as VirFileTree.ClientData["list"]
}

export async function api_updateJournalVirturalFileTree(
  currentGroupId: number,
  data: VirFileTree.Tree
) {
  return await fetchIt('PATCH', `${JOURNAL_GROUP_ROUTE}/${currentGroupId}`, {
    tree: data
  })
}

type Group<T extends number | undefined> = T extends undefined ? IJournalGroupData[] : IJournalGroupData

export async function api_getGroup<T extends number | undefined>(id?: T): Promise<Group<T>> {
  const route = `${JOURNAL_GROUP_ROUTE}${id ? '/' : ''}${id ?? ''}` as const
  return await fetchIt('GET', route) as Group<T>
}

export async function api_createGroup(data: JournalGroupSchema) {
  return await fetchIt('POST', JOURNAL_GROUP_ROUTE, data) as IJournalGroupData
} 

export async function api_updateGroup(id: number, data: JournalGroupSchema) {
  return await fetchIt('PATCH', `${JOURNAL_GROUP_ROUTE}/${id}`, data) as IJournalGroupData
}