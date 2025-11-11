import { createSignal, type Accessor, type Setter } from "solid-js"

export type StateSlice<T> = {
  get$: Accessor<T>
  set$: Setter<T>
}

export function createStateSlice<T extends any>(initialState?: T) {
  const [state, setState] = createSignal<T | undefined>(initialState)
  return { get$: state, set$: setState } as StateSlice<T>
}