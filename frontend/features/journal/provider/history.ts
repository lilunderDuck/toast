import type { notes } from "~/wailsjs/go/models";
import type { JournalLocalStorage } from "./JournalProvider";

export interface IHistoryManager {
  getLastOpened$(): notes.NoteData | null
  setLastOpened$(data: notes.NoteData): void
}

export function createHistoryManager(localStorage: JournalLocalStorage): IHistoryManager {
  return {
    getLastOpened$() {
      return localStorage.get$("last_opened$")
    },
    setLastOpened$(data) {
      return localStorage.set$("last_opened$", data)
    }
  }
}