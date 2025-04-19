import type { CreatedAndModifiedDate, UniqueId } from "./commonTypes"

export type JournalGroupSchema = {
  name: string
  description?: string
  icon?: string
}

export interface IJournalGroupData extends Omit<JournalGroupSchema, "icon">, UniqueId, CreatedAndModifiedDate {
  hasIcon: boolean
}