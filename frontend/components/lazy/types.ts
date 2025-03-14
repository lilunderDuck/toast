import type { Component, lazy } from "solid-js"

type LazyFn<Props extends {} = {}> = typeof lazy<Component<Props>>
export type LazyComponent<Props extends {}> = Parameters<LazyFn<Props>>[0]

type AwaitedLazyComponent<C extends LazyComponent<any>> = Awaited<ReturnType<C>>["default"]
export type LazyComponentProps<C extends LazyComponent<any>> = Parameters<
  AwaitedLazyComponent<C>
>[0]

export type SomeLazyLoadedComponent<T extends {}> = ReturnType<typeof lazy<Component<T>>>
export type LazyLoadedComponentProps<T extends Component> = Omit<Parameters<T>[0], 'close$'>