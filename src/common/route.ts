// import type { ParamKeys, ParamKeyToRecord } from "hono/types"
// import type { Simplify, UnionToIntersection } from "hono/utils/types"

const API_ROUTE_BASE_PATH = '/duck'

/**Constructs an API route by combining a base path with a provided path segment.
 * @param path some random path, it must start with a slash - `/`
 * @returns a string representing the constructed api route url
 */
export function apiRoute<const T extends string | number>(path: T = '' as T) {
  return `${API_ROUTE_BASE_PATH}${path}` as const
}

// might use this, but I will leave this for now
// export type PathParamToNicelyParamObject<T extends string | number> = Simplify<
//   UnionToIntersection<
//     ParamKeyToRecord<ParamKeys<T>>
//   >
// >