import { Accessor, createSignal } from "solid-js";

export type ToggleState = [Accessor<boolean>, () => void]

export function useToggleState(initialValue: boolean = false) {
  const [toggle, setIsToggle] = createSignal(initialValue)
  return [toggle, () => setIsToggle(prev => !prev)] as const
}