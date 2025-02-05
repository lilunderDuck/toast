import { HttpMethod } from "client/common"

/**The base path for making API requests. */
const BASE_PATH = 'http://localhost:8000'

/**Fetches data from a URL using the specified HTTP method.
 * 
 * When the data returned from the server, it will attempt to parse it as JSON and 
 * return the parsed data. If the server responds with the status of `4xx` or `5xx`, this will return `null`.
 * 
 * @note This only work if the server return **only with JSON**.
 * @template Data The type of the data expected in the response, defaults to an empty object (`{}`).
 * @template Path The path of the request, just to make you easier to guess what route
 * you gonna make by hovering this function.
 * @param method The HTTP method to use for the request (e.g., `'GET'`, `'POST'`, `'PATCH'`).
 * @param path The path of the API endpoint relative to the base URL.
 * @param body An optional object containing data to send in the request body (for `POST` and `PATCH` methods only).
 * @returns A promise that resolves to the parsed response data as the specified 
 * type (`Data`), or `null` if the request fails.
 * @see {@link HttpMethod}
 */
export async function fetchIt<
  Data extends {} = {}, 
  const Path extends string = string,
  Body = {}
>(method: HttpMethod, path: Path, body?: Body): Promise<Data | null> {
  console.groupCollapsed(`--> ${method}:`, BASE_PATH + path)
  const methodsThatAllowABody = ['POST', 'PATCH'].includes(method)

  const dataWillBeSentToServer: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (methodsThatAllowABody && body) {
    dataWillBeSentToServer.body = JSON.stringify(body)
  }

  const response = await fetch(BASE_PATH + path, dataWillBeSentToServer)

  const thisStatusCode = response.status

  if (isServerResponsesWithBadStatusCode(thisStatusCode)) {
    console.error(`<-- not okay, https://http.cat/${thisStatusCode} :(`)
    console.groupEnd()
    return null
  }

  console.log(`<-- okay, https://http.cat/${thisStatusCode} :)`)
  
  return await tryConvertingToJson(response) as Data
}

function isServerResponsesWithBadStatusCode(statusCode: number) {
  return statusCode >= 400
}

/**Attempts to parse a `Response` object as JSON and return the parsed data.
 * @param response The `Response` object to parse.
 * @returns A promise that resolves to the parsed JSON data as an object, or null if parsing fails.
 * @see https://developer.mozilla.org/docs/Web/API/Response
 */
async function tryConvertingToJson(response: Response) {
  let json: {} | null = {}
  try {
    json = await response.json()
  } catch (error) {
    console.warn(
      "can't convert into json, the server might be response with something else and not json\n",
      `| the suppressed error is:`, error
    )
    json = null
  }

  console.log('data:', json)

  console.groupEnd()
  return json
}