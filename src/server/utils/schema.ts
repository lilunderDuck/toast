import { Context } from "hono";
import { BaseIssue, BaseSchema, InferInput, nullish, object, parse, string } from "valibot";

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

type ParsedQueryAndBody<
  Query extends AnySchema, 
  Body extends AnySchema
> = {
  query: InferInput<Query>
  body: InferInput<Body>
} | undefined

export async function getBodyAndQuery<
  Query extends AnySchema, 
  Body extends AnySchema
>(context: Context, queryShema?: Query, bodySchema?: Body): Promise<ParsedQueryAndBody<Query, Body>> {
  const query = context.req.queries()
  let body
  console.log(JSON.stringify(context.req, null, 2))
  try {
    body = await context.req.raw.json()
  } catch(it) {
    // console.log(it)
  }

  console.log(body)


  if (!validate(queryShema, query)) {
    return void console.log('query not valid')
  }

  if (!validate(bodySchema, body)) {
    return void console.log('body not valid')
  }

  return {
    query: query,
    body
  }
}