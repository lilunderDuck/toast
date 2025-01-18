import {
  type InferOutput,
  object,
  optional,
  string,
} from 'valibot'

export const journalGroupFormSchema = object({
  name: string(),
  description: optional(string()),
  icon: optional(string()),
})

export const journalFormSchema = object({
  name: string(),
})

export const journalCategoryFormSchema = object({
  name: string(),
})

export type JournalGroupSchema = InferOutput<typeof journalGroupFormSchema>
export type JournalCategorySchema = InferOutput<typeof journalCategoryFormSchema>
export type JournalSchema = InferOutput<typeof journalFormSchema>