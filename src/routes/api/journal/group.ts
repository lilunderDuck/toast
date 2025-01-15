import { validator } from 'hono/validator'
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  journalGroupFormSchema 
} from "~/api/journal"
import { 
  journalGroupData
} from "~/features/data/journal"
import { validateIfValid } from "~/server/utils"
import { duck } from "~/entry-server"
// ...

/**GET /duck/journal/group/:groupId? */
duck.get(`${JOURNAL_GROUP_ROUTE}/:groupId?`, async (context) => {
  const { groupId } = context.req.param()

  if (groupId) {
    const data = await journalGroupData.$get(groupId)

    if (!data) {
      return context.text('not found', 404)
    }
    
    return context.json(data, 200)
  }
  
  return context.json(await journalGroupData.$getAll(), 200)
})

/**POST /duck/journal/group/ */
duck.post(JOURNAL_GROUP_ROUTE, validator('json', (value, context) => {
  return validateIfValid(journalGroupFormSchema, value, context)
}), async (context) => {
  const data = context.req.valid('json')
  const newGroup = await journalGroupData.$create(data)

  return context.json(newGroup, 201)
})

/**PATCH /duck/journal/group/:groupId */
duck.patch(`${JOURNAL_GROUP_ROUTE}/:groupId`, validator('json', (value) => {
  return value // insecure? yes, I know
}), async (context) => {
  const { groupId } = context.req.param()
  const data = context.req.valid('json')

  if (!await journalGroupData.$isExist(groupId)) {
    return context.status(404)
  }

  const updated = await journalGroupData.$update(groupId, data)
  return context.json(updated, 200)
})