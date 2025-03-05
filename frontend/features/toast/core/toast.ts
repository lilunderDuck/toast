import { createRoot, createSignal } from 'solid-js'
import type { 
  IToasterProps,
  Message, 
  ToastType, 
  Toast, 
  ToastHandler,
  Renderable,
  ValueOrFunction,
  ToastOptions, 
} from '../util/toast'
import { 
  defaultToasterOptions, 
  defaultToastOptions, 
  defaultTimeouts 
} from './defaults'
import { 
  ActionType, 
  generateID, 
  resolveValue 
} from '../util'
import { dispatch, store } from './store'
import { mergeObjects } from '~/utils'

export const [defaultOpts, setDefaultOpts] = createSignal<IToasterProps>(defaultToasterOptions)

export const createToast = (message: Message, type: ToastType = 'blank', options: ToastOptions): Toast => {
  const toastPosition = 
    options.position || 
    defaultOpts().toastOptions?.position || 
    defaultOpts().position || 
    defaultToastOptions.position
  // ...

  const toastDuration = 
    options.duration || 
    defaultOpts().toastOptions?.duration || 
    defaultTimeouts[type]
  // ...

  const toastStyle = mergeObjects(
    defaultToastOptions.style,
    defaultOpts().toastOptions?.style,
    options.style
  )

  return mergeObjects(
    defaultToastOptions,
    defaultOpts().toastOptions,
    options,
    {
      type,
      message,
      pauseDuration: 0,
      createdAt: Date.now(),
      visible: true,
      id: options.id || generateID(),
      paused: false,
      style: toastStyle,
      duration: toastDuration,
      position: toastPosition,
    }
  )
}

function createToastCreator(type?: ToastType): ToastHandler {
  return (message: Message, options: ToastOptions = {}) => (
    createRoot(() => {
      const existingToast = store.toasts.find((t) => t.id === options.id) as Toast
      const toast = createToast(message, type, { ...existingToast, duration: undefined, ...options })
      dispatch({ type: ActionType.UPSERT_TOAST, toast })
      return toast.id
    })
  )
}

export const toast = (message: Message, opts?: ToastOptions) => createToastCreator('blank')(message, opts)

toast.error = createToastCreator('error')
toast.success = createToastCreator('success')
toast.loading = createToastCreator('loading')
toast.custom = createToastCreator('custom')

toast.dismiss = (toastId?: string) => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId,
  })
}

toast.promise = <T>(
  promise: Promise<T>,
  msgs: {
    loading: Renderable
    success: ValueOrFunction<Renderable, T>
    error: ValueOrFunction<Renderable, any>
  },
  opts?: ToastOptions
) => {
  const id = toast.loading(msgs.loading, { ...opts })

  promise
    .then((p) => {
      toast.success(resolveValue(msgs.success, p), {
        id,
        ...opts,
      })
      return p
    })
    .catch((e) => {
      toast.error(resolveValue(msgs.error, e), {
        id,
        ...opts,
      })
    })

  return promise
}

toast.remove = (toastId?: string) => {
  dispatch({
    type: ActionType.REMOVE_TOAST,
    toastId,
  })
}