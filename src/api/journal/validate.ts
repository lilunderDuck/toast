import type { JSONContent } from '@tiptap/core'
import {
  object,
  optional,
  string,
  type InferOutput
} from 'valibot'

export const journalGroupFormSchema = object({
  name: string(),
  description: optional(string()),
  icon: optional(string()),
})

export const journalFormSchema = object({
  name: string(),
  icon: optional(string()),
})

export const journalCategoryFormSchema = object({
  name: string(),
  icon: optional(string()),
})

export type JournalGroup = InferOutput<typeof journalGroupFormSchema>
export type Journal = InferOutput<typeof journalFormSchema>
export type JournalCategory = InferOutput<typeof journalCategoryFormSchema>

export type JournalGroupData = JournalGroup & {
  id: string
  created: Date
  modified?: Date
  entries: number
}

export type JournalData = Journal & {
  id: string
  created: Date
  modified?: Date
  data?: JSONContent
}