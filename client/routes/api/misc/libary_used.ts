import { LIBARY_USED_ROUTE } from "client/api/misc"
import { duck } from "client/entry-server"
import { getListOfLibaryUsed } from "client/features/data/misc"

duck.get(LIBARY_USED_ROUTE, async(context) => {
  const text = await getListOfLibaryUsed()
  
  return context.json(text, 200)
})