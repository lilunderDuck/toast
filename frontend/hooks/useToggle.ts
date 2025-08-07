import { createSignal } from "solid-js";

export function useToggle(defaultValue: boolean = false) {
  const [state, setState] = createSignal(defaultValue)
  return [
    state,
    () => setState(prev => !prev)
  ] as const
}