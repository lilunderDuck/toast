import { Context } from "hono"
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

/**Validates any `incomingData` based on `schema`, if `incomingData` is invalid,
 * returns a `400 - bad request` with a `messageIfInvalid` if provides.
 * 
 * @example
 * ```
 * import { Hono } from 'hono'
 * import { validator } from 'hono/validator'
 * import { object, string } from "valibot"
 * 
 * const app = new Hono()
 * 
 * const querySchema = object({
 *   id: string()
 * })
 * 
 * // GET /duck?id=...
 * app.get('/duck', validator('query', (value, context) => {
 *   return validateIfValid(querySchema, value, context)
 * }), (context) => {
 *   const query = context.req.valid('query')
 *   // ... do something ...
 *   return context.text('okay', 200)
 * })
 * 
 * Deno.serve(duck.fetch)
 * ```
 * @param schema 
 * @param incomingData 
 * @param honoContext 
 * @param messageIfInvalid 
 * @returns 
 */
export function validateIfValid<
  T extends AnySchema
>(schema: T | undefined, incomingData: any, honoContext: Context, messageIfInvalid = 'invalid query') {
  if (validate(schema, incomingData)) {
    return incomingData
  }

  return honoContext.text(messageIfInvalid, 400)
}