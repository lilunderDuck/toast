import { pluginEvent, registerEditorNode } from "."

export interface IPluginOptions {
  name: string
  on?: (eventName: PluginEvent, callBack: AnyFunction) => any
  apps?: {
    name: string
    import: Promise<{ default(): any }>
  }
}

interface ToastGlobals {
  __plugins__: IPluginOptions[]
  register(options: IPluginOptions): void
  registerEditorNode: typeof registerEditorNode
}

declare global {
  interface Window {
    readonly toast: ToastGlobals
  }

  const toast: ToastGlobals
}

// @ts-ignore
window.toast = {
  __plugins__: [],
  register(options: IPluginOptions) {
    const eventHandler = pluginEvent.on$
    this.__plugins__.push(options)
    pluginEvent.on$ = (event, fn) => {
      eventHandler(event, fn)
      options.on?.(event, fn)
    }
  },
  registerEditorNode: registerEditorNode
} as ToastGlobals