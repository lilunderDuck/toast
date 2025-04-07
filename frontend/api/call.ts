import { apiCallLog } from "../features/debug"
import { IJournalData, IJournalGroupData, JournalType } from "./journal"

type MethodVerb = "GET" | "POST" | "PATCH" | "DELETE"

type ApiFnMapping = {
  [route: `GET /duck/journal/${number}`]: {
    in: null,
    out: Record<string, IJournalData>
  }
  [route: `GET /duck/journal/${number}/${number}`]: {
    in: null,
    out: IJournalData
  }
  [route: `POST /duck/journal/${number}`]: {
    in: {
      type: JournalType
      name: string
    }
    out: IJournalData
  }
  [route: `PATCH /duck/journal/${number}/${number}`]: {
    in: {
      name?: string
      data?: any[] // <- missing type
    }
    out: IJournalData
  }
  [route: `DELETE /duck/journal/${number}/${number}`]: {
    in: null
    out: null
  }

  "GET /duck/journal-group": {
    in: null
    out: IJournalGroupData[]
  }
  [route: `GET /duck/journal-group/${number}`]: {
    in: null
    out: IJournalGroupData
  }
  [route: `GET /duck/journal-group/${number}/tree`]: {
    in: null
    out: any[]
  }
  "POST /duck/journal-group": {
    in: {
      name: string
      description?: string
    }
    out: IJournalGroupData
  }
  [route: `PATCH /duck/journal-group/${number}`]: {
    in: {
      name: string
      description?: string
    }
    out: IJournalGroupData
  }
  [route: `DELETE /duck/journal-group/${number}`]: {
    in: null
    out: null
  }
}

export async function __callBackendApi<
  M extends MethodVerb,
  const R extends string
>(
  method: M, 
  route: R, 
  // @ts-ignore - forced to work
  whatToSend: ApiFnMapping[`${M} ${R}`]["in"] = null
  // @ts-ignore - also being forced to work
): Promise<ApiFnMapping[`${M} ${R}`]["out"] | null> {
  // debug-start
  apiCallLog.groupLabel(method, route)
  // a bunch or checks in case I misused this
  if (
    route.startsWith("http") ||
    route.startsWith("https")
  ) {
    apiCallLog.errorLabel(method, route, "Force stop.")
    apiCallLog.groupEndLabel()
    throw new Error(`This function only be used to call api from the backend only.`)
  }

  // redirect call to my backend, only works on dev mode tho.
  // @ts-ignore - type error here but I'm lazy
  route = "http://localhost:8000" + route
  // debug-end

  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  } as RequestInit
  
  if (["POST", "PATCH"].includes(method) || whatToSend !== null) {
    options.body = JSON.stringify(whatToSend)
  }

  // debug-start
  apiCallLog.log("options:", options)
  // debug-end

  // @ts-ignore
  type ApiCallResult = ApiFnMapping[`${M} ${R}`]["out"]
  let response: Response, result: ApiCallResult
  try {
    response = await fetch(route, options)
    result = await response.json()
  } catch (error) {
    // debug-start
    apiCallLog.error(error)
    apiCallLog.groupEndLabel()
    // debug-end
    return null
  }

  // debug-start
  if (response.status >= 400) {
    apiCallLog.errorLabel("result", response.status, result)
    apiCallLog.groupEndLabel()
    return null
  }

  apiCallLog.logLabel("result", response.status, result)
  apiCallLog.groupEndLabel()
  // debug-end

  return result
}