import { validator } from 'hono/validator'
// ...
import { 
  JOURNAL_GROUP_ROUTE
} from "client/api/journal"
import { 
  journalGroupData
} from "client/features/data/journal"
import { duck } from "client/entry-server"

/**GET /duck/journal-group/:groupId? */
duck.get(`${JOURNAL_GROUP_ROUTE}/:groupId`, async (context) => {
  const { groupId } = context.req.param()

  const data = await journalGroupData.get$(groupId)

  if (!data) {
    return context.text('not found', 404)
  }

  return context.json(data, 200)
})

/**PATCH /duck/journal-group/:groupId */
duck.patch(`${JOURNAL_GROUP_ROUTE}/:groupId`, validator('json', (value) => {
  return value // insecure? yes, I know
}), async (context) => {
  const { groupId } = context.req.param()
  const data = context.req.valid('json')

  if (!await journalGroupData.isExist$(groupId)) {
    return context.status(404)
  }

  const updated = await journalGroupData.update$(groupId, data)
  return context.json(updated, 200)
})