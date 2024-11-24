import { validator } from "hono/validator"
// ...
import { JOURNAL_ROUTE, journalFormSchema } from "~/api"
import { duck } from "~/entry-server"
import { mustHaveAnId, validate } from "~/server"
import { createJournal, deleteJournal } from "~/features/journal-data"
// ...
import "./auto-save"
import "./content"
import { object, string } from "valibot"

const mustHaveAnIdAndJournalId = object({
  id: string(),
  journal: string()
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