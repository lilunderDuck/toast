import type { Component, lazy } from "solid-js"

export type SomeLazyLoadedComponent<T extends {}> = ReturnType<typeof lazy<Component<T>>>
export type LazyLoadedComponentProps<T extends Component> = Omit<Parameters<T>[0], 'close$'>w