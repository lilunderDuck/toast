/**@see https://en.wikipedia.org/wiki/Magic_number_(programming)#Debug_values */
const MAGIC_DEBUG_VALUE = 0xdeadbeef

const INITIAL_SEED = 0x41c6ce57

const 
  MAGIC_PRIME_1 = 2654435761,
  MAGIC_PRIME_2 = 1597334677,
  MAGIC_PRIME_3 = 2246822507,
  MAGIC_PRIME_4 = 3266489909
// 

export function cyrb53(str: string, seed = 0) {
  let 
    h1 = MAGIC_DEBUG_VALUE ^ seed, 
    h2 = INITIAL_SEED ^ seed
  // 

  for(let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, MAGIC_PRIME_1)
    h2 = Math.imul(h2 ^ ch, MAGIC_PRIME_2)
  }

  h1  = Math.imul(h1 ^ (h1 >>> 16), MAGIC_PRIME_3)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), MAGIC_PRIME_4)
  h2  = Math.imul(h2 ^ (h2 >>> 16), MAGIC_PRIME_3)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), MAGIC_PRIME_4)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}