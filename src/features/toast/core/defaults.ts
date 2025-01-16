import type { IToasterProps, ToastOptions, ToastTimeouts } from '../util/toast'

export const defaultTimeouts: ToastTimeouts = {
  blank: 4000,
  error: 4000,
  success: 2000,
  loading: Infinity,
  custom: 4000,
};

export const defaultToastOptions: Required<ToastOptions> = {
  id: '',
  icon: '',
  unmountDelay: 500,
  duration: 3000,
  class: '',
  style: {},
  position: 'top-right',
  iconTheme: {},
};

export const defaultToasterOptions: IToasterProps = {
  position: 'top-right',
  toastOptions: defaultToastOptions,
  gutter: 8,
  containerStyle: {},
  containerClassName: '',
}