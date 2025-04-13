// ...
import { __callBackendApi } from "../call"
import { LibaryUsedData, SplashTextData } from "./stuff"

export async function api_getSplashText(): Promise<SplashTextData> {
  return {
    text: "test"
  }
}

export async function api_getLibariesUsed(): Promise<LibaryUsedData> {
  // return await apiCall('Misc_GetLibariesUsedList')
}

export async function api_openFileDialog() {
  return await __callBackendApi("GET", "/bridge/openFileDialog")
}