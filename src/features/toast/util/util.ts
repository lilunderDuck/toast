import { setDefaultOpts, defaultOpts, store, dispatch, defaultToasterOptions } from '../core'
import type { 
  IToasterProps, 
  Toast, 
  ToastPosition 
} from './toast'
import { ActionType } from './store'
import stylex from '@stylexjs/stylex'
import { NO_STYLE, StylexStylesAttribute } from '~/utils'

export const generateID = (() => {
  let count = 0
  return () => String(++count)
})()

export function mergeContainerOptions(props: IToasterProps) {
  setDefaultOpts((s) => ({
    containerClassName: props.containerClassName ?? s.containerClassName,
    containerStyle: props.containerStyle ?? s.containerStyle,
    gutter: props.gutter ?? s.gutter,
    position: props.position ?? s.position,
    toastOptions: {
      ...props.toastOptions,
    },
  }))
}

const style = stylex.create({
  baseToastStyle: {
    left: 0,
    right: 0,
    display: 'flex',
    position: 'absolute',
    transition: `all 230ms cubic-bezier(.21,1.02,.73,1)`
  },
  top: {
    top: 0, 
    marginTop: `var(--offset)`
  },
  bottom: {
    bottom: 0, 
    marginBottom: `var(--offset)`
  },
  centered: {
    justifyContent: 'center'
  },
  right: {
    justifyContent: 'flex-end'
  }
})

export function getToastWrapperStyles(position: ToastPosition): StylexStylesAttribute {
  const isOnTop = position.includes('top')
  const isCentered = position.includes('center')
  const isRighted = position.includes('right')
  
  const computedStyle = stylex.attrs(
    style.baseToastStyle,
    isOnTop ? style.top : style.bottom,
    isCentered ? style.centered : (
      isRighted ? style.right : NO_STYLE
    )
  )

  return computedStyle
}

export const updateToastHeight = (ref: Ref<"div">, toast: Toast) => {
  const boundingRect = ref.getBoundingClientRect()
  if (boundingRect.height !== toast.height) {
    dispatch({
      type: ActionType.UPDATE_TOAST,
      toast: { id: toast.id, height: boundingRect.height },
    })
  }
}

export const getWrapperYAxisOffset = (toast: Toast, position: ToastPosition): number => {
  const { toasts } = store
  const gutter = defaultOpts().gutter || defaultToasterOptions.gutter || 8
  const relevantToasts = toasts.filter((t) => (t.position || position) === position && t.height)
  const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id)
  const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible).length
  const offset = relevantToasts.slice(0, toastsBefore).reduce((acc, t) => acc + gutter + (t.height || 0), 0)
  return offset
}

export const getToastYDirection = (toast: Toast, defaultPos: ToastPosition) => {
  const position = toast.position || defaultPos
  const top = position.includes('top')
  return top ? 1 : -1
}
