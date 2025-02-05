import { validator } from "hono/validator"
// ...
import { JOURNAL_GROUP_ROUTE, journalGroupFormSchema } from "client/api/journal"
import { duck } from "client/entry-server"
import { journalGroupData } from "client/features/data/journal"
import { validateIfValid } from "client/server"

/**POST /duck/journal-group/ */
duck.post(JOURNAL_GROUP_ROUTE, validator('json', (value, context) => {
  return validateIfValid(journalGroupFormSchema, value, context)
}), async (context) => {
  const data = context.req.valid('json')
  const newGroup = await journalGroupData.create$(data)

  return context.json(newGroup, 201)
})

/**GET /duck/journal-group/ */
duck.get(JOURNAL_GROUP_ROUTE, async (context) => {
  return context.json(await journalGroupData.getAll$(), 200)
})