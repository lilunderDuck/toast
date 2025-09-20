import type { IToasterProps, ToastOptions, ToastTimeouts } from '../util/toast'

export const defaultTimeouts: ToastTimeouts = {
  [ToastType.BLANK]: 4000,
  [ToastType.ERROR]: 4000,
  [ToastType.SUCCESS]: 2000,
  [ToastType.LOADING]: Infinity,
  [ToastType.CUSTOM]: 4000,
};

export const defaultToastOptions: Required<ToastOptions> = {
  id: '',
  icon: '',
  unmountDelay: 500,
  duration: 3000,
  class: '',
  style: {},
  position: ToastPosition.TOP_RIGHT,
  iconTheme: {},
};

export const defaultToasterOptions: IToasterProps = {
  position: ToastPosition.TOP_RIGHT,
  toastOptions: defaultToastOptions,
  gutter: 8,
  containerStyle: {},
  containerClassName: '',
}