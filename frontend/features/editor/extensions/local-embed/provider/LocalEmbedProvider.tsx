import { Accessor, createContext, createSignal, onCleanup, ParentProps, Setter, useContext } from "solid-js"
import { LocalEmbedAttribute } from "../extension"
import { useNodeState } from "~/features/editor/utils"
import { useFullscreen } from "~/hooks"
import { ASSETS_SERVER_URL } from "~/api"
import { BrowserOpenURL } from "~/wailsjs/runtime/runtime"

interface ILocalEmbedContext {
  setRootRef$: Setter<Ref<"div">>
  isFullscreen$: Accessor<boolean>
  getEmbedUrl$: () => string
  isEmpty$: () => boolean
  openInBrowser$(): void
  openInFullscreen$(): void
  upload$(): void
  reload$(): void
}

const Context = createContext<ILocalEmbedContext>()

export function LocalEmbedProvider(props: ParentProps) {
  const { data$, updateAttribute$ } = useNodeState<LocalEmbedAttribute>()
  const [rootRef, setRootRef] = createSignal<Ref<"div">>()
  const { isFullscreen$, toggle$ } = useFullscreen(rootRef)

  const isEmpty = () => data$().name == ""
  const getEmbedUrl = () => `${ASSETS_SERVER_URL}/embed/${data$().name}` as const

  let iframeRef: Ref<"iframe">
  onCleanup(() => {
    iframeRef = null
  })

  return (
    <Context.Provider value={{
      setRootRef$: setRootRef,
      openInBrowser$() {
        BrowserOpenURL(getEmbedUrl())
      },
      openInFullscreen$() {
        toggle$()
      },
      isEmpty$: isEmpty,
      isFullscreen$: isFullscreen$,
      upload$() {
        // 
      },
      reload$() {
        if (!iframeRef) {
          iframeRef = rootRef().querySelector("iframe")
        }

        iframeRef.src = `${getEmbedUrl()}?v=${Math.random()}`
      },
      getEmbedUrl$: getEmbedUrl
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useLocalEmbedContext() {
  return useContext(Context)!
}