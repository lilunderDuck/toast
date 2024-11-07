import type { JSONContent } from "@tiptap/core"
import { JournalData } from "~/api"

export function createEditorCacheStorage() {
  const $cache = new Map<string, JSONContent>()

  return {
    $currentJournal: null as unknown as JournalData,
    $cache,
    $saveAll() {
      console.log(Object.entries($cache))
    }
  }
}