import { SPLASH_TEXT_ROUTE, type SplashTextData } from "client/api/misc"
import { fetchIt } from "client/utils"

export async function api_getSplashText() {
  return await fetchIt('GET', SPLASH_TEXT_ROUTE) as SplashTextData
}