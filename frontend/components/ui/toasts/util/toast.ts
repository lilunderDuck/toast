import type { JSX } from 'solid-js';

export type Renderable = JSX.Element | string | null;

export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> = TValue | ValueFunction<TValue, TArg>;

const isFunction = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> => typeof valOrFunction === 'function';

export const resolveValue = <TValue, TArg>(
  valOrFunction: ValueOrFunction<TValue, TArg>, arg: TArg
): TValue => isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction;

export interface IconTheme {
  primary?: string;
  secondary?: string;
}

export interface Toast {
  type: ToastType;
  id: string;
  message: ValueOrFunction<Renderable, Toast>;
  icon?: Renderable;
  duration?: number;
  pauseDuration: number;
  paused: boolean;
  position?: ToastPosition;

  style?: JSX.CSSProperties;
  class?: string;

  iconTheme?: IconTheme;

  createdAt: number;
  updatedAt?: number;
  visible: boolean;
  height?: number;
  unmountDelay: number;
}

export type ToastOptions = Partial<
  Pick<
    Toast,
    'id' | 'icon' | 'duration' | 'class' | 'style' | 'position' | 'unmountDelay' | 'iconTheme'
  >
>

export type ToastTimeouts = Record<ToastType, number>

export type Message = ValueOrFunction<Renderable, Toast>;

export type ToastHandler = (message: Message, options?: ToastOptions) => string;

export interface IToasterProps {
  position?: ToastPosition;
  toastOptions?: ToastOptions;
  gutter?: number;
  containerStyle?: JSX.CSSProperties;
  containerClassName?: string;
}

export interface ToastContainerProps {
  toast: Toast;
}

export interface ToastBarProps {
  toast: Toast;
  position: ToastPosition;
}

export type IconProps = Partial<IconTheme>;