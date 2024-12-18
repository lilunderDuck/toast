import { validator } from "hono/validator"
import { object, string } from "valibot"
// ...
import { JOURNAL_CONTENT_ROUTE, JournalApi } from "~/api/journal"
import { duck } from "~/entry-server"
import { validate } from "~/server"
import { journalData } from "~/features/journal-data"

const mustHaveIdAndJournalId = object({
  id: string(),
  journal: string(),
})

duck.get(JOURNAL_CONTENT_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveIdAndJournalId, value)) {
    return value
  }

  return context.text('Invalid', 400)
}), async(context) => {
  const query = context.req.valid('query')

  const something = await journalData.$getContent(query.id, query.journal)

  return context.json(something, 200)
})

duck.post(JOURNAL_CONTENT_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveIdAndJournalId, value)) {
    return value
  }

  return context.text('Invalid', 400)
}), validator('json', (value) => {
  return value
}), async(context) => {
  const query = context.req.valid('query')
  const data = context.req.valid('json') as JournalApi.JournalContentData

  await journalData.$update(query.id, query.journal, {
    data
  })

  return context.text('okay', 201)
})