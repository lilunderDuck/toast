/**This folder contains helper functions that shared accoss both the server and client.
 * 
 * These functions must not contain specific api like:
 * - node's only apis
 * - browser's only apis
 * 
 * And it must work between the server and client.
 */

export * from "./route"
export * from "./https"
export * from './array'
export * from './random'
export * from './objects'