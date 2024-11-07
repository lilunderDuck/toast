import type { ArrayElement } from "~/api"

export function getRandomNumber(bound: number) {
  return Math.floor(Math.random() * bound)
}

export function getRandomElement<T extends any[]>(fromArray: T): ArrayElement<T> {
  return fromArray[getRandomNumber(fromArray.length)]
}