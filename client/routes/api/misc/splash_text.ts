import { SPLASH_TEXT_ROUTE, type SplashTextData } from "client/api/misc"
import { duck } from "client/entry-server"
import { getSplashTextRandomly } from "client/features/data/misc"

duck.get(SPLASH_TEXT_ROUTE, async(context) => {
  const text = await getSplashTextRandomly()
  
  return context.json({
    text
  } as SplashTextData, 200)
})