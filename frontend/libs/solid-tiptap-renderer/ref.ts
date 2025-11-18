export type Ref<V> = [() => V | null, (value: V) => void]

export function createRef<V>(): Ref<V> {
  let ref: V | null = null

  return [
    () => ref,
    (value) => {
      ref = value
    }
  ]
}