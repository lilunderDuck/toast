import { validator } from "hono/validator"
import { object, string } from "valibot"
// ...
import { JOURNAL_AUTO_SAVE_ROUTE } from "~/api"
import { duck } from "~/entry-server"
import { validate } from "~/server"
import { updateJournal } from "~/features/journal-data"
import { OutputData } from "@editorjs/editorjs"

const mustHaveIdAndJournalId = object({
  id: string(),
  journal: string(),
})

duck.post(JOURNAL_AUTO_SAVE_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveIdAndJournalId, value)) {
    return value
  }

  return context.text('Invalid', 400)
}), validator('json', (value) => {
  return value
}), async(context) => {
  const query = context.req.valid('query')
  const data = context.req.valid('json')

  await updateJournal(query.id, query.journal, {
    data: data as OutputData
  })

  return context.text('okay', 201)
})