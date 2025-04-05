import { apiCallLog } from "~/features/debug"
import * as appBinding from "~/wailsjs/go/backend/App"

type ApiFn = typeof appBinding

export async function apiCall<T extends keyof ApiFn>(fnName: T, ...additionalArguments: Parameters<ApiFn[T]>) {
  const fn = appBinding[fnName]
  //debug-start
  if (!fn) {
    apiCallLog.error("Could not call", fnName, ", binding function not exist.\n\nFunction list:", appBinding)
    throw new Error(`panic ${Object.values(appBinding)}`)
  }
  
  apiCallLog.logLabel("call", fnName, ...additionalArguments)
  //debug-end

  //@ts-ignore - should work without any worries
  const theReturnType = await fn(...additionalArguments) as ReturnType<ApiFn[T]>

  //debug-start
  apiCallLog.logLabel("result", fnName, theReturnType)
  //debug-end
  return theReturnType
}