export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS'

/**HTTP response status codes indicate whether a 
 * specific HTTP request has been successfully completed. 
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#successful_responses
 */
export const enum HttpStatusCode {
  Okey = 200,
  /**aka. `Created` */
  DuckCreated = 201,

  // Client side error
  /**aka. `Bad Request` */
  BadDuck = 400,
  Unauthorized = 401,
  ForbiddenDuck = 403,
  DuckNotFound = 404,
  /**aka. `Method Not Allowed` */
  DuckNotAllowed = 405,
  /**aka. `Too Many Requests` */
  TooManyDuck = 429,

  // Server side error
  /**aka. `Internal Server Error` */
  DuckInternalError = 500,
  DuckNotImplemented = 501,
}