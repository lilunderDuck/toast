import { validator } from "hono/validator"
// ...
import { JOURNAL_CONTENT_ROUTE } from "~/api"
import { duck } from "~/entry-server"
import { isThisDirectoryExist, mustHaveAnId, validate } from "~/server"
import { buildJournalGroupPath, getAllJournals } from "~/server/features/journal"

duck.get(JOURNAL_CONTENT_ROUTE, validator('query', (value, context) => {
  if (validate(mustHaveAnId, value)) {
    return value
  }

  return context.text('Invalid', 400)
}), async (context) => {
  const query = context.req.valid('query')

  const path = buildJournalGroupPath(query.id)
  if (!await isThisDirectoryExist(path)) {
    return context.text('not found', 404)
  }

  return context.json(await getAllJournals(query.id), 200)
})