import { validator } from "hono/validator"
import { JOURNAL_VIRTURAL_FILE_TREE_ROUTE } from "client/api/journal"
import { duck } from "client/entry-server"
import { journalGroupTreeCache } from "client/features/data/journal"

duck.get(`${JOURNAL_VIRTURAL_FILE_TREE_ROUTE}/:groupId`, async(context) => {
  const { groupId } = context.req.param()

  const data = await journalGroupTreeCache.get(groupId) ?? await journalGroupTreeCache.rebuild(groupId)
  if (!data) {
    return context.text('Failed to get some data', 404)
  }

  return context.json(data, 200)
})

duck.patch(`${JOURNAL_VIRTURAL_FILE_TREE_ROUTE}/:groupId`, validator('json', (value, _context) => {
  return value
}),async(context) => {
  const { groupId } = context.req.param()
  const updatedTree = context.req.valid('json')

  journalGroupTreeCache.set(groupId, undefined, updatedTree)

  return context.json('okay', 200)
})