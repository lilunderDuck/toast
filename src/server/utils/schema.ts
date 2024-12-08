import { type BaseIssue, type BaseSchema, type InferInput, nullish, object, parse, string } from "valibot"

export const mustHaveAnId = object({
  id: string()
})

export const canHaveIdOrNot = nullish(object({
  id: string()
}))

type AnySchema = BaseSchema<unknown, unknown, BaseIssue<unknown>>

export function validate<
  T extends AnySchema
>(schema: T | undefined, incomingData: any): incomingData is InferInput<T> {
  if (!schema) {
    return true
  }

  try {
    parse(schema, incomingData)
    return true
  } catch(error) {
    console.log(error)
    return false
  }
}