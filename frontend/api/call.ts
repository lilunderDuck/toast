import { apiCallLog } from "~/features/debug"
import * as appBinding from "~/wailsjs/go/backend/App"

type ApiFn = typeof appBinding

export function apiCall<T extends keyof ApiFn>(fnName: T, ...additionalArguments: Parameters<ApiFn[T]>) {
  const fn = appBinding[fnName]
  //debug-start
  if (!fn) {
    apiCallLog.error("Could not call", fnName, ", binding function not exist.\n\nFunction list:", appBinding)
    throw new Error(`panic ${Object.values(appBinding)}`)
  }
  //debug-end
  
  apiCallLog.log(fnName)
  //@ts-ignore - should work without any worries
  return fn(...additionalArguments) as ReturnType<ApiFn[T]>
}