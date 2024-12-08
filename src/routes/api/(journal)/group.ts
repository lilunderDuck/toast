import { validator } from 'hono/validator'
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  journalGroupFormSchema 
} from "~/api/journal"
import { 
  createJournalGroup, 
  getAllJournalGroups,
  getJournalGroup, 
  isJournalGroupExist, 
  updateJournalGroup, 
} from "~/features/journal-data"
import { canHaveIdOrNot, mustHaveAnId, validate } from "~/server/utils"
import { duck } from "~/entry-server"
import { isEmptyObject } from '~/common'
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
    const data = await getJournalGroup(query.id)

    if (!data) {
      return context.status(404)
    }
    
    return context.json(data, 200)
  }
  
  return context.json(await getAllJournalGroups(), 200)
})

duck.post(JOURNAL_GROUP_ROUTE, validator('json', (value, context) => {
  if (validate(journalGroupFormSchema, value)) {
    return value
  }

  return context.text('invalid input, oops', 400)
}), async (context) => {
  const data = context.req.valid('json')

  return context.json(await createJournalGroup(data), 201)
})

duck.patch(JOURNAL_GROUP_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnId, value)) {
    return value
  }

  return context.text('invalid input, oops', 400)
}), validator('json', (value, context) => {
  if (validate(journalGroupFormSchema, value)) {
    return value
  }

  return context.text('invalid input, oops', 400)
}), async (context) => {
  const query = context.req.valid('query')
  const data = context.req.valid('json')

  if (!await isJournalGroupExist(query.id)) {
    return context.status(404)
  }

  return context.json(await updateJournalGroup(query.id, data), 200)
})