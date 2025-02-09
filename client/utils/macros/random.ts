export function randomHex(howMuch: number) {
  return crypto.randomUUID().replaceAll('-', '').slice(0, howMuch)
}