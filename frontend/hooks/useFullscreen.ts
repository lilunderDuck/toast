/**Original implementation is from https://github.com/logaretm/vue-use-web by Abdelrahman Awad.
 * 
 * Solid-js implementation is from https://github.com/solidjs-use/solidjs-use/blob/66d98a33c283ce44ee6271784c4cf577410be41d/packages/core/src/useFullscreen/index.ts#L162
 */
import { type Accessor, createMemo, createSignal, onCleanup } from 'solid-js'
import { type ConfigurableDocument } from './types'
import { useEventListener } from './useEventListener'

export interface UseFullscreenOptions extends ConfigurableDocument {
  /**
   * Automatically exit fullscreen when component is unmounted
   *
   * @default true
   */
  autoExit?: boolean
}

const FULL_SCREEN_ATTRIBUTE_NAME = "currently-in-fullscreen"

/**Reactive Fullscreen API.
 *
 * @see https://solidjs-use.github.io/solidjs-use/core/useFullscreen
 */
export function useFullscreen<
  T extends keyof HTMLElementTagNameMap
>(target?: Accessor<Ref<T>>, options: UseFullscreenOptions = {}) {
  const { document = window.document, autoExit = true } = options

  const targetAccessor = createMemo(target)
  const [isFullscreen, setIsFullscreen] = createSignal(false)

  const isCurrentElementFullScreen = (): boolean => {
    return document.fullscreenElement === targetAccessor()
  }

  const isElementFullScreen = () => document.fullscreenEnabled

  async function exit() {
    if (!isFullscreen()) return
    targetAccessor().removeAttribute(FULL_SCREEN_ATTRIBUTE_NAME)

    await document.exitFullscreen()
    setIsFullscreen(false)
  }

  async function enter() {
    if (isElementFullScreen()) await exit()

    const target = targetAccessor()
    target.setAttribute(FULL_SCREEN_ATTRIBUTE_NAME, "")
    await target.requestFullscreen()
    setIsFullscreen(true)
  }

  async function toggle() {
    await (isFullscreen() ? exit() : enter())
  }

  const handlerCallback = () => {
    const isElementFullScreenValue = isElementFullScreen()
    if (!isElementFullScreenValue || (isElementFullScreenValue && isCurrentElementFullScreen()))
      setIsFullscreen(isElementFullScreenValue)
  }

  // fix: press ESC to escape fullscreen does not update the "isFullscreen" state 
  useEventListener(document, "fullscreenchange", (event) => {
    if (document.fullscreenElement) return

    console.log("force reset")
    if ((event.target as HTMLElement).hasAttribute(FULL_SCREEN_ATTRIBUTE_NAME)) {
      setIsFullscreen(false) // force update state
      exit() // clean up other stuff
    }
  }, false)
  useEventListener(targetAccessor, "fullscreenchange", handlerCallback, false)

  if (autoExit) onCleanup(exit)

  return {
    isFullscreen$: isFullscreen,
    enter$: enter,
    exit$: exit as () => Promise<void>,
    toggle$: toggle
  }
}

export type FullscreenHandler = ReturnType<typeof useFullscreen>