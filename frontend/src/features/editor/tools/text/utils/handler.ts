import { Setter } from "solid-js"

type Handler = (input: any) => void
export function handle(fn: AnyFunction, signal: Setter<any>): Handler {
  return (input) => {
    fn(input)
    signal(input)
  }
}