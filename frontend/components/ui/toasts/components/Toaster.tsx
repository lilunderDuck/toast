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
import { css } from 'molcss'

const toaster = css`
  position: fixed;
  z-index: 9999;
  top: 16px;
  bottom: 16px;
  left: 16px;
  right: 16px;
  pointer-events: none;
  user-select: none;
`

export function Toaster(props: IToasterProps) {
  createEffect(() => {
    mergeContainerOptions(props)
  })

  createEffect(() => {
    const timers = createTimers()
    onCleanup(() => {
      if (!timers) return
      timers.forEach((timer) => timer && clearTimeout(timer))
    })
  })

  return (
    <Portal>
      <div class={toaster}>
        <For each={store.toasts$}>
          {(toast) => <ToastContainer toast$={toast as Toast} />}
        </For>
      </div>
    </Portal>
  )
}