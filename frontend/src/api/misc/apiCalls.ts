// ...
import { Misc_GetRandomSplashText } from "~/wailsjs/go/backend/App"
import { SplashTextData } from "./splashText"

export async function api_getSplashText(): Promise<SplashTextData> {
  return {
    text: await Misc_GetRandomSplashText()
  }
}