import { fetchIt } from "~/utils"
// ...
import { SPLASH_TEXT_ROUTE } from "./route"
import { SplashTextData } from "./splashText"

export async function api_getSplashText() {
  return await fetchIt('GET', SPLASH_TEXT_ROUTE) as SplashTextData
}