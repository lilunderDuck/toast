import { JOURNALS_FOLDER } from "~/server"

export function buildJournalGroupPath<const T extends string>(groupId: T) {
  return `${JOURNALS_FOLDER}/${groupId}` as const
}