import { validator } from "hono/validator"
// ...
import { JOURNAL_ROUTE, journalFormSchema } from "~/api/journal"
import { duck } from "~/entry-server"
import { isThisDirectoryExist, mustHaveAnId, validate } from "~/server"
import { 
  buildJournalGroupPath, 
  createJournal, 
  deleteJournal, 
  getAllJournals 
} from "~/features/journal-data"
// ...

import { object, string } from "valibot"

const mustHaveAnIdAndJournalId = object({
  id: string(),
  journal: string()
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

  return context.json(await getAllJournals(query.id), 200)
})

duck.post(JOURNAL_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnId, value)) {
    return value
  }

  return context.text('invalid query', 400)
}), validator('json', (value, context) => {
  console.log(value)
  if (validate(journalFormSchema, value)) {
    return value
  }

  return context.text('invalid data', 400)
}), async (context) => {
  const body = context.req.valid('json')
  const query = context.req.valid('query')

  const newData = await createJournal(query.id, body)
  
  return context.json(newData, 200)
})

duck.delete(JOURNAL_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnIdAndJournalId, value)) {
    return value
  }

  return context.text('invalid query', 400)
}), async (context) => {
  const query = context.req.valid('query')

  deleteJournal(query.id, query.journal)
  
  return context.text('okay', 200)
})