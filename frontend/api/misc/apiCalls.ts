// ...
import { LibaryUsedData, SplashTextData } from "./stuff"
import { apiCall } from "../call"

export async function api_getSplashText(): Promise<SplashTextData> {
  return {
    text: await apiCall('Misc_GetRandomSplashText')
  }
}

export async function api_getLibariesUsed(): Promise<LibaryUsedData> {
  return await apiCall('Misc_GetLibariesUsedList')
}