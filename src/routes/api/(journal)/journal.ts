import { validator } from "hono/validator"
// ...
import { JOURNAL_ROUTE, JournalApi, journalFormSchema } from "~/api/journal"
import { duck } from "~/entry-server"
import { isThisDirectoryExist, validateIfValid } from "~/server"
import { 
  buildJournalGroupPath, 
  getAllJournalData, 
  journalCategoryData, 
  journalData
} from "~/features/data/journal"
// ...

import { object, string } from "valibot"

/**`GET /duck/journal/:groupId`
 * Gets all journals data from `groupId`.
 * 
 * Returns an 404 - not found if the requested `groupId` could not be found.
 */
duck.get(`${JOURNAL_ROUTE}/:groupId`, async (context) => {
  const { groupId } = context.req.param()

  const path = buildJournalGroupPath(groupId)
  if (!await isThisDirectoryExist(path)) {
    return context.text('not found', 404)
  }

  return context.json(await getAllJournalData(groupId), 200)
})

const mustHaveAType = object({
  type: string()
})

/**`POST /duck/journal/:groupId?type=...`
 * Creates a new journal based on given `type` query on `groupId`.
 * 
 * A `400 - bad request` will be returned if the `type` query or the data
 * being posted is invalid
 */
duck.post(`${JOURNAL_ROUTE}/:groupId`, validator('query', (value, context) => {
  return validateIfValid(mustHaveAType, value, context)
}), validator('json', (value, context) => {
  return validateIfValid(journalFormSchema, value, context)
}), async (context) => {
  const body = context.req.valid('json')
  const query = context.req.valid('query')
  const { groupId } = context.req.param()

  let newData
  if (query.type === 'journal') {
    newData = await journalData.$create(groupId, body)
  }
  else {
    newData = await journalCategoryData.$create(groupId, body)
  }
  
  return context.json(newData, 200)
})

/**`DELETE /duck/journal/:groupId/:journalId`
 * Deletes a `journalId` from `groupId`
 */
duck.delete(`${JOURNAL_ROUTE}/:groupId/:journalId`, async (context) => {
  const { groupId, journalId } = context.req.param()

  await journalData.$delete(groupId, journalId)
  
  return context.text('okay', 200)
})

/**`GET /duck/journal/:groupId/:journalId`
 * Gets the journal data based on `journalId` from `groupId`
 */
duck.get(`${JOURNAL_ROUTE}/:groupId/:journalId`, async(context) => {
  const { groupId, journalId } = context.req.param()

  const something = await journalData.$getContent(groupId, journalId)

  return context.json(something, 200)
})

/**`PATCH /duck/journal/:groupId/:journalId`
 * Updates `journalId` data from `groupId`
 */
duck.patch(`${JOURNAL_ROUTE}/:groupId/:journalId`, validator('json', (value) => {
  return value as JournalApi.JournalContentData
}), async(context) => {
  const { groupId, journalId } = context.req.param()
  const data = context.req.valid('json') 

  await journalData.$update(groupId, journalId, {
    data
  })

  return context.text('okay', 201)
})