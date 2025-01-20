import { validator } from "hono/validator"
import { JOURNAL_ROUTE, JournalContentData } from "~/api/journal"
import { duck } from "~/entry-server"
import { journalData } from "~/features/data/journal"

/**`DELETE /duck/journal/:groupId/:journalId`
 * Deletes a `journalId` from `groupId`
 */
duck.delete(`${JOURNAL_ROUTE}/:groupId/:journalId`, async (context) => {
  const { groupId, journalId } = context.req.param()

  await journalData.delete$(groupId, journalId)
  
  return context.text('okay', 200)
})

/**`GET /duck/journal/:groupId/:journalId`
 * Gets the journal data based on `journalId` from `groupId`
 */
duck.get(`${JOURNAL_ROUTE}/:groupId/:journalId`, async(context) => {
  const { groupId, journalId } = context.req.param()

  const something = await journalData.getContent$(groupId, journalId)

  return context.json(something, 200)
})

/**`PATCH /duck/journal/:groupId/:journalId`
 * Updates `journalId` data from `groupId`
 */
duck.patch(`${JOURNAL_ROUTE}/:groupId/:journalId`, validator('json', (value) => {
  return value as JournalContentData
}), async(context) => {
  const { groupId, journalId } = context.req.param()
  const data = context.req.valid('json')

  await journalData.update$(groupId, journalId, {
    data
  })

  return context.text('okay', 201)
})