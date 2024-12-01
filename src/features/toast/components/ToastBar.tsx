import { createEffect, Match, Switch, Component, ParentProps } from 'solid-js'
// ...
import { 
  getToastYDirection,
  resolveValue, 
  type ToastBarProps
} from '../util'
import { Error, Loader, Success } from '.'
// ...
import { mergeClassname } from '~/utils'
import { FlexCenterY } from '~/components'
// ...
import stylex from '@stylexjs/stylex'

function animateToastOnVisible(thisToast: HTMLDivElement, direction: 1 | -1) {
  thisToast.animate(
    [
      { transform: `translate3d(0,${direction * -200}%,0) scale(.6)`, opacity: 0.5 },
      { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
    ],
    {
      duration: 350,
      fill: 'forwards',
      easing: 'cubic-bezier(.21,1.02,.73,1)'
    }
  )
}

function animateToastOnHide(thisToast: HTMLDivElement, direction: 1 | -1) {
  thisToast.animate(
    [
      { transform: 'translate3d(0,0,-1px) scale(1)', opacity: 1 },
      { transform: `translate3d(0,${direction * -150}%,-1px) scale(.4)`, opacity: 0 },
    ],
    {
      duration: 400,
      fill: 'forwards',
      easing: 'cubic-bezier(.06,.71,.55,1)'
    }
  )
}

const style = stylex.create({
  toastBar: {
    display: 'flex',
    alignItems: 'center',
    color: '#363636',
    background: 'white',
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
  },
  iconContainer: {
    flexShrink: 0,
    minWidth: 20,
    minHeight: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
})

function IconContainer(props: ParentProps) {
  return (
    <div {...props} {...stylex.attrs(style.iconContainer)} />
  )
}

export const ToastBar: Component<ToastBarProps> = (props) => {
  let el: HTMLDivElement | undefined;

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
      class={mergeClassname(props.toast, stylex.attrs(style.toastBar))}
    >
      <IconContainer>
        <Switch>
          <Match when={props.toast.icon}>
            {props.toast.icon}
          </Match>
          <Match when={props.toast.type === 'loading'}>
            <Loader {...props.toast.iconTheme} />
          </Match>
          <Match when={props.toast.type === 'success'}>
            <Success {...props.toast.iconTheme} />
          </Match>
          <Match when={props.toast.type === 'error'}>
            <Error {...props.toast.iconTheme} />
          </Match>
        </Switch>
      </IconContainer>

      <FlexCenterY {...stylex.attrs(style.messageContainer)} {...props.toast.ariaProps}>
        {resolveValue(props.toast.message, props.toast)}
      </FlexCenterY>
    </div>
  )
}
