import { createContext, type ParentProps, type Accessor, useContext, createSignal, onMount, type Setter } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { createStorage } from "~/utils"
import { ASSETS_SERVER_URL } from "~/api"
import { useJournalContext } from "~/features/journal"
import type { editor } from "~/wailsjs/go/models"
import { CreateGalleryData, GetGalleryData, UploadOneFile, UpdateGalleryData } from "~/wailsjs/go/editor/EditorExport"
// ...
import type { GallerySessionStorage } from "./data"
import { DEFAULT_GALLERY_ID, type GalleryAttribute } from "../extension"

export interface IGalleryContext {
  /**Gets the current gallery data. */
  data$: () => editor.GalleryData
  /**Navigates to the next item in the gallery and updates the current index and item state. */
  next$(): void
  /**Navigates to the previous item in the gallery and updates the current index and item state. */
  previous$(): void
  /**Gets the current index of the gallery item. 
   * @default () => 0 // the first item in the gallery or the last gallery item user accessed
   */
  currentIndex$: Accessor<number>
  /**Gets the currently displayed gallery item. 
   * 
   * Usually the current item is the first item in a gallery item, 
   * or the last gallery item user accessed, but sometimes it returns `undefined` 
   * if the gallery is loading.
   */
  currentItem$: Accessor<editor.GalleryItem | undefined>
  /**Gets the display url of an item in the gallery.
   * @param fileName The file name of the gallery item to get the URL for.
   * @returns 
   * - If gallery data contains `basePath` prop (because it supports saving gallery content
   * somewhere else), this function returns `http://localhost:8000/preview?path=[fileName]`
   * - Otherwise, always `http://localhost:8000/local-assets/[groupId]/gallery/[galleryId]/[fileName]`
   */
  getDisplayUrl$(fileName: string): string
  /**Upload a single file into this gallery.
   * @param filePath The local file path of the single file to upload.
   * @returns A promise that resolves when the file upload is complete.
   */
  uploadOneFile$(filePath: string): Promise<void>
  /**
   * @todo
   * @param dirPath The local directory path containing multiple files to upload.
   * @returns A promise that resolves when all files in the directory have been uploaded.
   */
  uploadMultipleFile$(dirPath: string): Promise<void>
  /**Whenever the gallery is on fullscreen or not.
   * @default () => false
   */
  isFullscreen$: Accessor<boolean>
  /**A internal setter method to change if the gallery should go to fullscreen or not.
   * @private
   */
  _setIsFullscreen$: Setter<boolean>
}

const Context = createContext<IGalleryContext>()

interface IGalleryProviderProps {
  // ...
}

export function GalleryProvider(props: ParentProps<IGalleryProviderProps>) {
  const { data$, updateAttribute$ } = useNodeState<GalleryAttribute>()
  const { sessionStorage$ } = useJournalContext()
  const [galleryData, setGalleryData] = createStore<editor.GalleryData>({} as editor.GalleryData)
  const [isFullscreen, setIsFullscreen] = createSignal(false)

  const wrappedSessionStorage: GallerySessionStorage = createStorage(sessionStorage, 'gallery$')

  const isNotCreated = () => data$().id === DEFAULT_GALLERY_ID
  const getCurrentGalleryId = () => galleryData!.id ?? data$().id 
  const getCurrentGroupId = () => sessionStorage$.get$("journal_data$").groupId$
  const CURRENT_INDEX_STORAGE_KEY = `${getCurrentGroupId()}.${getCurrentGalleryId()}.currIndex` as const

  // Tracks current item displayed in both default view and fullscreen view
  let currentIndex = 0
  const [currentItem, setCurrentItem] = createSignal<editor.GalleryItem>()

  const loadGallery = async () => {
    if (getCurrentGalleryId() === DEFAULT_GALLERY_ID) {
      return // don't load
    }

    const existingData = await GetGalleryData(getCurrentGroupId(), getCurrentGalleryId())

    const lastCurrentIndex = wrappedSessionStorage.get$(CURRENT_INDEX_STORAGE_KEY)
    if (lastCurrentIndex) {
      currentIndex = lastCurrentIndex
    }
    
    setGalleryData(existingData)
    updateCurrentItem()
  }

  const createGallery = async() => {
    const newData = await CreateGalleryData(getCurrentGroupId())
    updateAttribute$("id", newData.id)
    setGalleryData(newData)
  }

  onMount(() => {
    isNotCreated() ? createGallery() : loadGallery()
  })

  const next = () => {
    // keep incrementing until it reaches the last gallery item
    if (currentIndex !== galleryData.items.length) {
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
    // @ts-ignore - reupdate current item
    setCurrentItem(null)
    // setting current item here is not enough to trigger an update,
    // so we need the line above.
    setCurrentItem(galleryData.items[currentIndex])
    wrappedSessionStorage.set$(CURRENT_INDEX_STORAGE_KEY, currentIndex)
  }

  const getDisplayUrl = (fileName: string) => {
    if (galleryData.basePath) {
      const escapedFileName = encodeURIComponent(`${galleryData.basePath}/${fileName}`)
      return `${ASSETS_SERVER_URL}/preview?path=${escapedFileName}` as const
    }

    return `${ASSETS_SERVER_URL}/local-assets/${getCurrentGroupId()}/gallery/${galleryData.id}/${encodeURIComponent(fileName)}` as const
  }

  return (
    <Context.Provider value={{
      data$: () => galleryData,
      currentIndex$: () => currentIndex,
      next$: next,
      isFullscreen$: isFullscreen,
      _setIsFullscreen$: setIsFullscreen,
      previous$: previous,
      currentItem$: currentItem,
      getDisplayUrl$: getDisplayUrl,
      async uploadMultipleFile$() {
        // const 
        // todo
      },
      async uploadOneFile$(filePath) {
        const galleryItem = await UploadOneFile(getCurrentGroupId(), getCurrentGalleryId(), filePath)
        if (galleryData.items.length === 0) {
          setCurrentItem(galleryItem)
        }

        setGalleryData("items", galleryData.items.length, galleryItem)
        await UpdateGalleryData(getCurrentGroupId(), getCurrentGalleryId(), galleryData)
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryContext() {
  return useContext(Context)!
}