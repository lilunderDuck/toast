import { type Accessor, type AccessorArray, createEffect, createMemo, createSignal, on, onCleanup, onMount, type OnOptions } from "solid-js"
import type { Arrayable, Fn, MaybeAccessor, MaybeElement } from "./types"
import { isObject } from "~/utils"

export type WatchDeps<S> = AccessorArray<S> | Accessor<S> | S
export type WatchCallback<S, Next extends Prev = any, Prev = Next> = (
  input: S,
  prevInput: S | undefined,
  prev: Prev
) => void | Next | Promise<void | Next>

/**
 * Change mutable object to Accessors.
 *
 * @see https://solidjs-use.github.io/solidjs-use/shared/toAccessors
 */
export function toAccessors<T extends object = {}>(props: T, defaultProps?: T): Record<keyof T, Accessor<T[keyof T]>> {
  const obj: any = {}
  ;(Object.keys(props) as Array<keyof T>).forEach(key => {
    obj[key] = createMemo(() => props[key] ?? defaultProps?.[key])
  })
  return obj
}

function toAccessor<T>(v: T | undefined | null | Accessor<T | null | undefined>) {
  if (v === undefined || typeof v !== "function") {
    return createSignal(v)[0]
  }
  return v
}

/**
 * Shorthand for `createEffect(on()))` and return stop handler.
 *
 * @see https://solidjs-use.github.io/solidjs-use/shared/watch
 */
export function watch<S, Next extends Prev, Prev = Next>(
  deps: WatchDeps<S>,
  fn: WatchCallback<S, Next, Prev>,
  options?: OnOptions
) {
  const [isWatch, setIsWatch] = createSignal(true)

  createEffect(
    on(
      getAccessors(deps),
      (input, prevInput, prev) => {
        if (isWatch()) {
          fn(input, prevInput, prev as any)
        }
      },
      options as any
    )
  )

  const stop = () => {
    setIsWatch(false)
  }
  return stop
}

function getAccessors<S>(deps: WatchDeps<S>): AccessorArray<S> | Accessor<S> {
  if (Array.isArray(deps)) return deps
  if (isObject(deps)) {
    return Object.values(toAccessors(deps)) as AccessorArray<S>
  }
  // @ts-ignore
  if (typeof deps === "function") return deps
  return () => deps
}

interface InferEventTarget<Events> {
  addEventListener: (event: Events, fn?: any, options?: any) => any
  removeEventListener: (event: Events, fn?: any, options?: any) => any
}

export type WindowEventName = keyof WindowEventMap
export type DocumentEventName = keyof DocumentEventMap

export type GeneralEventListener<E = Event> = (evt: E) => void

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 1: Omitted Window target
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useEventListener
 */
export function useEventListener<E extends keyof WindowEventMap>(
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 2: Explicitly Window target
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useEventListener
 */
export function useEventListener<E extends keyof WindowEventMap>(
  target: Window,
  event: Arrayable<E>,
  listener: Arrayable<(this: Window, ev: WindowEventMap[E]) => any>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 3: Explicitly Document target
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useEventListener
 */
export function useEventListener<E extends keyof DocumentEventMap>(
  target: DocumentOrShadowRoot,
  event: Arrayable<E>,
  listener: Arrayable<(this: Document, ev: DocumentEventMap[E]) => any>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 4: Explicitly HTMLElement target
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useEventListener
 */
export function useEventListener<E extends keyof HTMLElementEventMap>(
  target: MaybeAccessor<HTMLElement | null | undefined>,
  event: Arrayable<E>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[E]) => any,
  options?: boolean | AddEventListenerOptions
): () => void

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 5: Custom event target with event type infer
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useEventListener
 */
export function useEventListener<Names extends string, EventType = Event>(
  target: InferEventTarget<Names>,
  event: Arrayable<Names>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions>
): Fn

/**
 * Register using addEventListener on mounted, and removeEventListener automatically on unmounted.
 *
 * Overload 6: Custom event target fallback
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useEventListener
 */
export function useEventListener<EventType = Event>(
  target: MaybeAccessor<EventTarget | null | undefined>,
  event: Arrayable<string>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: MaybeAccessor<boolean | AddEventListenerOptions>
): Fn

export function useEventListener(...args: any[]) {
  let target: MaybeAccessor<EventTarget> | undefined
  let events: Arrayable<string>
  let listeners: Arrayable<Function>
  let options: MaybeAccessor<boolean | AddEventListenerOptions> | undefined

  if (typeof args[0] === "string" || Array.isArray(args[0])) { // arg: target
    [events, listeners, options] = args
    target = window
  } else {
    [target, events, listeners, options] = args
  }

  if (!target) return console.warn("target element not found")

  if (!Array.isArray(events)) events = [events]
  if (!Array.isArray(listeners)) listeners = [listeners]

  const cleanups: Function[] = []
  const cleanup = () => {
    for (const listener of cleanups) {
      listener()
    }
    cleanups.length = 0
  }

  const register = (el: any, event: string, listener: any, options: any) => {
    console.log("Register event: ", event, options)
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  const stopWatch = watch(
    [toAccessor(target as unknown as MaybeElement), toAccessor(options)],
    ([el, options]) => {
      cleanup()
      if (!el) return

      cleanups.push(
        ...events.flatMap(event => {
          return (listeners as Function[]).map(listener => register(el, event, listener, options))
        })
      )
    }
  )

  const stop = () => {
    stopWatch()
    cleanup()
    console.log(`Remove event: ${events}`)
  }

  onCleanup(stop)

  return stop
}