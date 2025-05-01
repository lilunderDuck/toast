import { __run, apiCallLog } from "../features/debug"

type MethodVerb = "GET" | "POST" | "PATCH" | "DELETE"

export async function __callBackendApi<
  M extends MethodVerb,
  const R extends string
>(
  method: M, 
  route: R, 
  whatToSend: any = null
): Promise<any> {
  isDevMode && __run(() => {
    apiCallLog.log(method, route)
    
    // a bunch or checks in case I misused this
    if (
      route.startsWith("http") ||
      route.startsWith("https")
    ) {
      apiCallLog.errorLabel(method, route, "Force stop.")
  
      throw new Error(`This function only be used to call api from the backend only.`)
    }
  
    // redirect call to my backend, only works on dev mode tho.
    // @ts-ignore - type error here but I'm lazy
    route = "http://localhost:8000" + route
  })
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  } as RequestInit
  
  if (["POST", "PATCH"].includes(method) || whatToSend !== null) {
    options.body = JSON.stringify(whatToSend)
  }

  isDevMode && apiCallLog.log("options:", options)

  // @ts-ignore
  type ApiCallResult = ApiFnMapping[R][M]["out"]
  let response: Response, result: ApiCallResult
  try {
    response = await fetch(route, options)
    result = await response.json()
  } catch (error) {
    isDevMode && apiCallLog.error(error)
    
    return null
  }

  try {
    result = JSON.parse(result as string)
  } catch (error) {
    // ignore parse error
  }

  console.assert(!(response.status >= 400), result)

  isDevMode && apiCallLog.logLabel("result", response.status, result)
  

  return result
}