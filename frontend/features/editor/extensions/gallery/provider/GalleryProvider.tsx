import { createContext, type ParentProps, type Accessor, useContext, createSignal, onMount } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { createStorage } from "~/utils"
import { ASSETS_SERVER_URL } from "~/api"
import { useJournalContext } from "~/features/journal"
import { editor } from "~/wailsjs/go/models"
import { CreateGalleryData, GetGalleryData, UploadOneFile } from "~/wailsjs/go/editor/EditorExport"
// ...
import { GallerySessionStorage } from "./data"
import { GalleryAttribute } from "../extension"

export interface IGalleryContext {
  data$: () => editor.GalleryData
  next$(): void
  previous$(): void
  currentIndex$: Accessor<number>
  currentItem$: Accessor<editor.GalleryItem | undefined>
  getDisplayUrl$(fileName: string): string
  uploadOneFile$(filePath: string): Promise<void>
  uploadMultipleFile$(dirPath: string): Promise<void>
}

const Context = createContext<IGalleryContext>()

interface IGalleryProviderProps {
  // ...
}

export function GalleryProvider(props: ParentProps<IGalleryProviderProps>) {
  const { data$, updateAttribute$ } = useNodeState<GalleryAttribute>()
  const { sessionStorage$ } = useJournalContext()
  const [data, setData] = createStore<editor.GalleryData>({} as editor.GalleryData)
  const wrappedSessionStorage: GallerySessionStorage = createStorage(sessionStorage, 'gallery$')

  const isNotCreated = () => data$().id === 0
  const getCurrentGalleryId = () => data?.id ?? data.id
  const getCurrentGroupId = () => sessionStorage$.get$("journal_data$").groupId$
  const CURRENT_INDEX_STORAGE_KEY = `${getCurrentGroupId()}.${getCurrentGalleryId()}.currIndex` as const

  let currentIndex = 0
  const [currentItem, setCurrentItem] = createSignal<editor.GalleryItem>()

  const loadGallery = async () => {
    const existingData = await GetGalleryData(getCurrentGroupId(), getCurrentGalleryId())

    const lastCurrentIndex = wrappedSessionStorage.get$(CURRENT_INDEX_STORAGE_KEY)
    if (lastCurrentIndex) {
      currentIndex = lastCurrentIndex
    }
    
    setData(existingData)
    updateCurrentItem()

    console.log("data fetched:", existingData)
  }

  const createGallery = async() => {
    const newData = await CreateGalleryData(getCurrentGroupId())
    updateAttribute$("id", newData.id)
    setData(newData)
    console.log("created")
  }

  onMount(() => {
    if (isNotCreated()) {
      createGallery()
      return
    }
    loadGallery()
  })

  const next = () => {
    // keep incrementing until it reaches the last gallery item
    if (currentIndex !== data.items.length) {
      currentIndex += 1
    }

    updateCurrentItem()
  }
  
  const previous = () => {
    // keep decrementing until it reaches the first gallery item
    if (currentIndex !== 0) {
      currentIndex -= 1
    }

    updateCurrentItem()
  }
  
  const updateCurrentItem = () => {
    console.log("current item index:", currentIndex, "current item data:", data.items[currentIndex], "data:", data)
    // @ts-ignore - reupdate current item
    setCurrentItem(null)
    // setting current item here is not enough to trigger an update,
    // so we need the line above.
    setCurrentItem(data.items[currentIndex])
    wrappedSessionStorage.set$(CURRENT_INDEX_STORAGE_KEY, currentIndex)
  }

  const getDisplayUrl = (fileName: string) => {
    if (data.basePath) {
      const escapedFileName = encodeURIComponent(`${data.basePath}/${fileName}`)
      return `${ASSETS_SERVER_URL}/preview?path=${escapedFileName}` as const
    }

    return `${ASSETS_SERVER_URL}/local-assets/${getCurrentGroupId()}/gallery/${data.id}/${encodeURIComponent(fileName)}` as const
  }

  return (
    <Context.Provider value={{
      data$: () => data,
      currentIndex$: () => currentIndex,
      next$: next,
      previous$: previous,
      currentItem$: currentItem,
      getDisplayUrl$: getDisplayUrl,
      async uploadMultipleFile$() {
        // const 
        // todo
      },
      async uploadOneFile$(filePath) {
        const galleryItem = await UploadOneFile(getCurrentGroupId(), getCurrentGalleryId(), filePath)
        setData("items", data.items.length, galleryItem)
        // const item = await upload
        // todo
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryContext() {
  return useContext(Context)!
}