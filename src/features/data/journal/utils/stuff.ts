import { JOURNALS_FOLDER } from "~/server"

export function buildJournalGroupPath<const T extends string>(groupId: T) {
  return `${JOURNALS_FOLDER}/${groupId}` as const
}

export function buildJournalPath(groupId: string, journalId: string) {
  return `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const
}