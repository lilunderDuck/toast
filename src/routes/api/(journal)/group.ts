import { validator } from 'hono/validator'
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  journalGroupFormSchema 
} from "~/api/journal"
import { 
  journalGroupData
} from "~/features/data/journal"
import { canHaveIdOrNot, mustHaveAnId, validate } from "~/server/utils"
import { duck } from "~/entry-server"
import { isEmptyObject } from '~/common'
import { object } from 'valibot'
// ...

duck.get(JOURNAL_GROUP_ROUTE, validator('query', (value, context) => {
  if (isEmptyObject(value)) {
    return null
  }

  if (validate(canHaveIdOrNot, value)) {
    return value
  }

  return context.text('invalid input, oops', 400)
}), async (context) => {
  const query = context.req.valid('query')

  if (query?.id) {
    const data = await journalGroupData.$get(query.id)

    if (!data) {
      return context.text('not found', 404)
    }
    
    return context.json(data, 200)
  }
  
  return context.json(await journalGroupData.$getAll(), 200)
})

duck.post(JOURNAL_GROUP_ROUTE, validator('json', (value, context) => {
  if (validate(journalGroupFormSchema, value)) {
    return value
  }

  return context.text('invalid input, oops', 400)
}), async (context) => {
  const data = context.req.valid('json')

  return context.json(await journalGroupData.$create(data), 201)
})

duck.patch(JOURNAL_GROUP_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnId, value)) {
    return value
  }

  return context.text('invalid input, oops', 400)
}), validator('json', (value) => {
  return value // insecure? yes, I know
}), async (context) => {
  const query = context.req.valid('query')
  const data = context.req.valid('json')

  if (!await journalGroupData.$isExist(query.id)) {
    return context.status(404)
  }

  return context.json(await journalGroupData.$update(query.id, data), 200)
})