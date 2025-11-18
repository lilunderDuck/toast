import { type Accessor, createContext, createSignal, onCleanup, type ParentProps, type Setter, type Signal, useContext } from "solid-js"
import { type LocalEmbedAttribute } from "../extension"
import { useFullscreen } from "~/hooks"
import { ASSETS_SERVER_URL } from "~/api"
import { BrowserOpenURL } from "~/wailsjs/runtime/runtime"
import { SaveLocalEmbed } from "~/wailsjs/go/editor/Exports"
import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"

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
  const { attrs$, updateAttribute$ } = useSolidNodeView<LocalEmbedAttribute>()
  const [rootRef, setRootRef] = createSignal() as Signal<Ref<"div">>
  const { isFullscreen$, toggle$ } = useFullscreen(rootRef)

  const isEmpty = () => attrs$().name == ""
  const getEmbedUrl = () => `${ASSETS_SERVER_URL}/local-assets/embed/${attrs$().name}` as const

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