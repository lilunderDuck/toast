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
} from '../toast'
import { 
  defaultToasterOptions, 
  defaultToastOptions, 
  defaultTimeouts 
} from './defaults'
import { 
  ActionType, 
  generateID, 
  resolveValue 
} from '..'
import { dispatch, store } from './store'

export const [defaultOpts, setDefaultOpts] = createSignal<IToasterProps>(defaultToasterOptions)

export const createToast = (message: Message, type: ToastType = 'blank', options: ToastOptions): Toast => ({
  ...defaultToastOptions,
  ...defaultOpts().toastOptions,
  ...options,
  type,
  message,
  pauseDuration: 0,
  createdAt: Date.now(),
  visible: true,
  id: options.id || generateID(),
  paused: false,
  style: {
    ...defaultToastOptions.style,
    ...defaultOpts().toastOptions?.style,
    ...options.style,
  },
  duration: options.duration || defaultOpts().toastOptions?.duration || defaultTimeouts[type],
  position:
    options.position || defaultOpts().toastOptions?.position || defaultOpts().position || defaultToastOptions.position,
})

const createToastCreator = (type?: ToastType): ToastHandler => (message: Message, options: ToastOptions = {}) => {
  return createRoot(() => {
    const existingToast = store.toasts.find((t) => t.id === options.id) as Toast
    const toast = createToast(message, type, { ...existingToast, duration: undefined, ...options })
    dispatch({ type: ActionType.UPSERT_TOAST, toast })
    return toast.id
  })
}

const toast = (message: Message, opts?: ToastOptions) => createToastCreator('blank')(message, opts)

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

export { toast }
