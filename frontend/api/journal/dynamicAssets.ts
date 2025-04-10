const SERVER_URL = "http://localhost:8080" as const
const DYNAMIC_ROUTE = `${SERVER_URL}/dynamic/journals` as const

export const enum JournalAssetsType {
  image = "image",
  video = "video"
}

export function getAssetsFromJournal(type: JournalAssetsType, journalId: number, fileName: string) {
  return `${DYNAMIC_ROUTE}/${journalId}/${type}/${fileName}` as const
}