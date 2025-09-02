import { createEffect } from 'solid-js'
import { macro_mergeClassnames } from 'macro-def'
// ...
import stylex from '@stylexjs/stylex'
// ...
import { 
  getToastYDirection,
  resolveValue, 
  type ToastBarProps,
  animateToastOnVisible,
  animateToastOnHide
} from '../util'
import { ToastIconContainer } from './ToastIconContainer'

const style = stylex.create({
  toastBar: {
    display: 'flex',
    alignItems: 'center',
    color: 'var(--gray12)',
    background: 'var(--gray5)',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
    maxWidth: '350px',
    pointerEvents: 'auto',
    padding: '8px 10px',
    borderRadius: '4px',
    lineHeight: '1.3',
    willChange: 'transform',
  },
  messageContainer: {
    flex: '1 1 auto',
    margin: '4px 10px',
    whiteSpace: 'pre-line',
    display: "flex",
    alignItems: 'center',
  }
})

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
      class={macro_mergeClassnames(props.toast.class, stylex.attrs(style.toastBar))}
    >
      <ToastIconContainer {...props.toast} theme={props.toast.iconTheme} />

      <div {...stylex.attrs(style.messageContainer)} role="status" aria-live='polite'>
        {resolveValue(props.toast.message, props.toast)}
      </div>
    </div>
  )
}