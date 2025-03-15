// ...
import { 
  Misc_GetLibariesUsedList, 
  Misc_GetRandomSplashText 
} from "~/wailsjs/go/backend/App"
// ...
import { LibaryUsedData, SplashTextData } from "./stuff"

export async function api_getSplashText(): Promise<SplashTextData> {
  return {
    text: await Misc_GetRandomSplashText()
  }
}

export async function api_getLibariesUsed(): Promise<LibaryUsedData> {
  return Misc_GetLibariesUsedList()
}