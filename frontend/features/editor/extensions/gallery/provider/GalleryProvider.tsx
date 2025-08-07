import { createContext, type ParentProps, type Accessor, useContext, createSignal, onMount } from "solid-js"
// ...
import { useNodeState } from "~/features/editor/utils"
import { createStorage, sleep } from "~/utils"
import { ASSETS_SERVER_URL } from "~/api"
import { editor } from "~/wailsjs/go/models"
// ...
import { GallerySessionStorage } from "./data"

export interface IGalleryContext {
  data$: Accessor<editor.GalleryData | null>
  next$(): void
  previous$(): void
  currentIndex$: Accessor<number>
  currentItem$: Accessor<editor.GalleryItem>
  getDisplayUrl$(fileName: string): string
}

const Context = createContext<IGalleryContext>()

interface IGalleryProviderProps {
  // ...
}

export function GalleryProvider(props: ParentProps<IGalleryProviderProps>) {
  const { data$ } = useNodeState()
  const [data, setData] = createSignal<editor.GalleryData>(null)
  const wrappedSessionStorage: GallerySessionStorage = createStorage(sessionStorage, 'gallery$')

  const getCurrentGroupId = () => 0 // dummy code
  const CURRENT_INDEX_STORAGE_KEY = `${getCurrentGroupId()}.${data()?.id ?? 0}.currIndex` as const

  let currentIndex = 0
  const [currentItem, setCurrentItem] = createSignal<editor.GalleryItem>()

  const fetchDataIfExist = async () => {
    await sleep(1000)
    const items = ['e1-1', 'e1-2', 'e1-3', 'e1-4', 'e1-5', 'e1-6', 'e1-7', 'e1-8', 'e1-9', 'e1-10', 'e1-11', 'e1-12'/*, 'e2-1', 'e2-2', 'e2-3', 'e2-4', 'e2-5', 'e2-6', 'e2-7', 'e2-8', 'e2-9', 'e2-10', 'e2-11', 'e2-12', 'e2-13', 'e3-1'*/].map((it, index) => ({
      type: 1,
      addedDate: 0,
      // name: `e1-${index + 1}.mp4`
      name: `${it}.webm`
    }))
    const existingData: editor.GalleryData = {
      id: 0,
      items,
      created: 0,
      name: "test",
      basePath: "F:/archive/Place to Place"
    }
    
    const lastCurrentIndex = wrappedSessionStorage.get$(CURRENT_INDEX_STORAGE_KEY)
    if (lastCurrentIndex) {
      currentIndex = lastCurrentIndex
    }
    
    setData(existingData)
    updateCurrentItem()

    console.log("data fetched:", existingData)
  }

  onMount(fetchDataIfExist)

  const next = () => {
    if (currentIndex !== data().items.length) {
      currentIndex += 1
    }

    updateCurrentItem()
  }
  
  const previous = () => {
    if (currentIndex !== 0) {
      currentIndex -= 1
    }

    updateCurrentItem()
  }
  
  const updateCurrentItem = () => {
    console.log("current item index:", currentIndex, "current item data:", data().items[currentIndex], "data:", data())
    setCurrentItem(null)
    setCurrentItem(data().items[currentIndex])
    wrappedSessionStorage.set$(CURRENT_INDEX_STORAGE_KEY, currentIndex)
  }

  const getDisplayUrl = (fileName: string) => {
    if (data().basePath) {
      const escapedFileName = encodeURIComponent(`${data().basePath}/${fileName}`)
      return `${ASSETS_SERVER_URL}/preview?path=${escapedFileName}` as const
    }

    return `${ASSETS_SERVER_URL}/local-assets/${getCurrentGroupId()}/gallery/${data().id}/${encodeURIComponent(fileName)}` as const
  }

  return (
    <Context.Provider value={{
      data$: data,
      currentIndex$: () => currentIndex,
      next$: next,
      previous$: previous,
      currentItem$: currentItem,
      getDisplayUrl$: getDisplayUrl
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryContext() {
  return useContext(Context)!
}