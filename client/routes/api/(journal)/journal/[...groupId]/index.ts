import { validator } from "hono/validator"
import { object, string } from "valibot"
import { 
  JOURNAL_ROUTE, 
  JournalFileType, 
  journalFormSchema 
} from "client/api/journal"
import { duck } from "client/entry-server"
import { 
  buildJournalGroupPath, 
  getAllJournalData, 
  journalCategoryData, 
  journalData 
} from "client/features/data/journal"
import { 
  isThisDirectoryExist, 
  validate, 
  validateIfValid 
} from "client/server"

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
  if (validate(mustHaveAType, value)) {
    const { type } = value
    const isNotAnNumber = isNaN(parseInt(type))
    if (isNotAnNumber) {
      return context.text('not an number', 400)
    }

    return value as unknown as { type: number }
  }

  return context.text('invalid data', 400)
}), validator('json', (value, context) => {
  return validateIfValid(journalFormSchema, value, context)
}), async (context) => {
  const body = context.req.valid('json')
  const query = context.req.valid('query')
  const { groupId } = context.req.param()

  let newData
  if (query.type === JournalFileType.journal) {
    newData = await journalData.create$(groupId, body)
  }
  else {
    newData = await journalCategoryData.create$(groupId, body)
  }
  
  return context.json(newData, 200)
})