import { validator } from "hono/validator"
// ...
import { JOURNAL_ROUTE, journalFormSchema } from "~/api/journal"
import { duck } from "~/entry-server"
import { isThisDirectoryExist, mustHaveAnId, validate } from "~/server"
import { 
  buildJournalGroupPath, 
  getAllJournalData, 
  journalCategoryData, 
  journalData
} from "~/features/data/journal"
// ...

import { object, string } from "valibot"

const mustHaveAnIdAndJournalId = object({
  id: string(),
  journal: string()
})

const mustHaveAnIdAndType = object({
  id: string(),
  type: string()
})

duck.get(JOURNAL_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnId, value)) {
    return value
  }

  return context.text('invalid query', 400)
}), async (context) => {
  const query = context.req.valid('query')

  const path = buildJournalGroupPath(query.id)
  if (!await isThisDirectoryExist(path)) {
    return context.text('not found', 404)
  }

  return context.json(await getAllJournalData(query.id), 200)
})

duck.post(JOURNAL_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnIdAndType, value)) {
    return value
  }

  return context.text('invalid query', 400)
}), validator('json', (value, context) => {
  if (validate(journalFormSchema, value)) {
    return value
  }

  return context.text('invalid data', 400)
}), async (context) => {
  const body = context.req.valid('json')
  const query = context.req.valid('query')

  let newData
  if (query.type === 'journal') {
    newData = await journalData.$create(query.id, body)
  }
  else {
    newData = await journalCategoryData.$create(query.id, body)
  }
  
  return context.json(newData, 200)
})

duck.delete(JOURNAL_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnIdAndJournalId, value)) {
    return value
  }

  return context.text('invalid query', 400)
}), async (context) => {
  const query = context.req.valid('query')

  journalData.$delete(query.id, query.journal)
  
  return context.text('okay', 200)
})