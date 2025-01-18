import crypto from 'node:crypto'
// ...
import { JOURNALS_FOLDER } from "~/server"
import type { IJournalData, JournalVituralFileTree } from "~/api/journal"

export function buildJournalGroupPath<const T extends string>(groupId: T) {
  return `${JOURNALS_FOLDER}/${groupId}` as const
}

export function buildJournalPath(groupId: string, journalId: string) {
  return `${buildJournalGroupPath(groupId)}/${journalId}.dat` as const
}

export function isJournalData(data: JournalVituralFileTree.Data): data is IJournalData {
  return 'data' in data
}

/**Generates a random 5-byte hexadecimal string for use as an ID.
 * @returns A random hexadecimal string.
 */
export function createId() {
  return crypto.randomBytes(5).toString('hex')
}