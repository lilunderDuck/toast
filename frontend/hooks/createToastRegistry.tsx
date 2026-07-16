import { DEBUG_INFO_LABEL } from "macro-def"

export interface IBaseLazyToast {}

type AwaitedDefaultFn<T extends ToastComponentImport<any, any>> = Awaited<T>["default"]

export interface IToastRegistry<Registry extends DeferredRegister> {
  show$<ToastKey extends keyof Registry>(
    toast: ToastKey, 
    // please forgive me
    stuff?: Parameters<AwaitedDefaultFn<Registry[ToastKey]>>[0]
  ): ReturnType<AwaitedDefaultFn<Registry[ToastKey]>>
}

// thankfully typescript doesn't have this weird "? extends SomeClass" syntax,
// when I read that one for the first time, I read: 
// "SomeClass needs to extend... question mark????"

type DeferredRegister = Record<string | number, ToastComponentImport<IBaseLazyToast, any>>

export type ToastComponentImport<T extends IBaseLazyToast, R extends any> = Promise<{
  default(props: T): R
}>

export function createToastRegistry<T extends DeferredRegister>(registry: T) {
  DEBUG_INFO_LABEL('toast registry', "REGISTERING", registry)
  // ^ in reality, it does not register to somewhere, it just exist here, until the component unloads.
  DEBUG_INFO_LABEL('toast registry', "FREEZEING DATA")
  return {
    async show$(toast, stuff) {
      const thisToastImport = registry[toast]
      DEBUG_INFO_LABEL('toast registry', "showing toast:", toast)
      return (await thisToastImport).default(stuff!)
    }
  } as IToastRegistry<T>
}