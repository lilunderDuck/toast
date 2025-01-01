import {
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

