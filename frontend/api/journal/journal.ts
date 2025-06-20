import { __throw, apiCallLog } from "~/features/debug"
import { __callBackendApi } from "../call"
import { IJournalData, JournalContentData, JournalSchema, JournalType } from "./stuff"
import { macro_urlBuilder } from "macro_def"

export async function api_createJournal(currentGroupId: number, data: JournalSchema, type: JournalType): Promise<IJournalData> {
  return await __callBackendApi('POST', macro_urlBuilder(`/duck/journal/${currentGroupId}`, {
    type: type
  }), {
    ...data
  })
}

export async function api_deleteJournal(currentGroupId: number, someJournalId: number) {
  return await __callBackendApi('DELETE', `/duck/journal/${currentGroupId}/${someJournalId}`)
}

// can't think of a way to get the correct journal by just the journalId
export async function api_getJournal(currentGroupId: number, someJournalId: number, type: JournalType): Promise<IJournalData> {
  return await __callBackendApi('GET', macro_urlBuilder(`/duck/journal/${currentGroupId}/${someJournalId}`, {
    type: type
  }))
}

export async function api_getAllJournal(currentGroupId: number): Promise<Record<string, IJournalData>> {
  return await __callBackendApi('GET', `/duck/journal/${currentGroupId}`)
}

export async function api_updateJournal(currentGroupId: number, someJournalId: number, data: Partial<IJournalData>): Promise<IJournalData> {
  return await __callBackendApi('PATCH', `/duck/journal/${currentGroupId}/${someJournalId}`, {
    name: data.name,
  })
}

export async function api_saveJournalContent(currentGroupId: number, someJournalId: number, data: JournalContentData) {
  if (!someJournalId) {
    isDevMode && apiCallLog.log("Refused to save journal content. The requested journal id is", someJournalId)
    return 
  }

  await __callBackendApi('PATCH', `/duck/journal/${currentGroupId}/${someJournalId}`, {
    data: data
  })
}