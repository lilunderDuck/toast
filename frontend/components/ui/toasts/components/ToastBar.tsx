import { createEffect } from 'solid-js'
// ...
import { css } from 'molcss'
// ...
import { 
  getToastYDirection,
  resolveValue, 
  type ToastBarProps,
  animateToastOnVisible,
  animateToastOnHide
} from '../util'
import { ToastIconContainer } from './ToastIconContainer'
// ...
import type { Ref } from '~/utils'

const toastBar = css`
  display: flex;
  align-items: center;
  color: var(--text);
  background: var(--surface1);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 4px;
  line-height: 1.3;
  will-change: transform;
`

const messageContainer = css`
  flex: 1 1 auto;
  margin: 4px 10px;
  white-space: pre-line;
  display: flex;
  align-items: center;
`

export function ToastBar(props: ToastBarProps) {
  let el!: Ref<"div">

  createEffect(() => {
    if (!el) return
    const direction = getToastYDirection(props.toast, props.position)
    if (props.toast.visible) {
      return animateToastOnVisible(el, direction)
    }

    animateToastOnHide(el, direction)
  })

  return (
    <div
      ref={el}
      class={`${props.toast.class} ${toastBar}`}
    >
      <ToastIconContainer {...props.toast} theme={props.toast.iconTheme} />

      <div class={messageContainer}>
        {resolveValue(props.toast.message, props.toast)}
      </div>
    </div>
  )
}