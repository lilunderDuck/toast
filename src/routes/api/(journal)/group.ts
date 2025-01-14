import { validator } from 'hono/validator'
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  journalGroupFormSchema 
} from "~/api/journal"
import { 
  journalGroupData
} from "~/features/data/journal"
import { canHaveIdOrNot, mustHaveAnId, validateIfValid } from "~/server/utils"
import { duck } from "~/entry-server"
import { isEmptyObject } from '~/common'
// ...

duck.get(JOURNAL_GROUP_ROUTE, validator('query', (value, context) => {
  if (isEmptyObject(value)) {
    return null
  }

  return validateIfValid(canHaveIdOrNot, value, context)
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
  return validateIfValid(journalGroupFormSchema, value, context)
}), async (context) => {
  const data = context.req.valid('json')
  const newGroup = await journalGroupData.$create(data)

  return context.json(newGroup, 201)
})

duck.patch(JOURNAL_GROUP_ROUTE, validator('query', (value, context) => {
  return validateIfValid(mustHaveAnId, value, context)
}), validator('json', (value) => {
  return value // insecure? yes, I know
}), async (context) => {
  const query = context.req.valid('query')
  const data = context.req.valid('json')

  if (!await journalGroupData.$isExist(query.id)) {
    return context.status(404)
  }

  const updated = await journalGroupData.$update(query.id, data)
  return context.json(updated, 200)
})