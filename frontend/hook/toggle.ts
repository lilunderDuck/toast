import { createSignal } from "solid-js";

export function useToggleState(initialValue: boolean = false) {
  const [toggle, setIsToggle] = createSignal(initialValue)
  return [toggle, () => setIsToggle(prev => !prev)] as const
}