import { type Accessor, createContext, createSignal, onCleanup, type ParentProps, type Setter, useContext } from "solid-js"
import { type LocalEmbedAttribute } from "../extension"
import { useNodeState } from "~/features/editor/utils"
import { useFullscreen } from "~/hooks"
import { ASSETS_SERVER_URL } from "~/api"
import { BrowserOpenURL } from "~/wailsjs/runtime/runtime"
import { SaveLocalEmbed } from "~/wailsjs/go/editor/EditorExport"

interface ILocalEmbedContext {
  setRootRef$: Setter<Ref<"div">>
  isFullscreen$: Accessor<boolean>
  getEmbedUrl$: () => string
  isEmpty$: () => boolean
  openInBrowser$(): void
  openInFullscreen$(): void
  upload$(htmlFilePath: string): void
  reload$(): void
}

const Context = createContext<ILocalEmbedContext>()

export function LocalEmbedProvider(props: ParentProps) {
  const { data$, updateAttribute$ } = useNodeState<LocalEmbedAttribute>()
  const [rootRef, setRootRef] = createSignal<Ref<"div">>()
  const { isFullscreen$, toggle$ } = useFullscreen(rootRef)

  const isEmpty = () => data$().name == ""
  const getEmbedUrl = () => `${ASSETS_SERVER_URL}/local-assets/embed/${data$().name}` as const

  let iframeRef!: Ref<"iframe">
  onCleanup(() => {
    // @ts-ignore
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
      async upload$(htmlFilePath) {
        const entry = await SaveLocalEmbed(htmlFilePath)
        updateAttribute$("name", entry)
      },
      reload$() {
        if (!iframeRef) {
          iframeRef = rootRef()?.querySelector("iframe")!
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