import { LIBARY_USED_ROUTE } from "~/api/misc"
import { duck } from "~/entry-server"
import { getListOfLibaryUsed } from "~/features/data/misc"

duck.get(LIBARY_USED_ROUTE, async(context) => {
  const text = await getListOfLibaryUsed()
  
  return context.json(text, 200)
})