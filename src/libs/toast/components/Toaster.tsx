import { createEffect, For, onCleanup } from 'solid-js'
import { Portal } from 'solid-js/web'
// ...
import { 
  mergeContainerOptions,
  type IToasterProps, 
  type Toast
} from '../util'
import { store, createTimers } from '../util'
import { ToastContainer } from './ToastContainer'
// ...
import stylex from '@stylexjs/stylex'

const style = stylex.create({
  toaster: {
    position: 'fixed',
    zIndex: 9999,
    top: 16,
    bottom: 16,
    left: 16,
    right: 16,
    pointerEvents: 'none',
    userSelect: 'none'
  }
})

export function Toaster(props: IToasterProps) {
  createEffect(() => {
    mergeContainerOptions(props)
  });

  createEffect(() => {
    const timers = createTimers()
    onCleanup(() => {
      if (!timers) return
      timers.forEach((timer) => timer && clearTimeout(timer))
    })
  })

  return (
    <Portal>
      <div {...stylex.attrs(style.toaster)}>
        <For each={store.toasts}>
          {(toast) => <ToastContainer toast={toast as Toast} />}
        </For>
      </div>
    </Portal>
  )
}
