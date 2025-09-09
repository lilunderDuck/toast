import { createContext, type ParentProps, type Accessor, useContext, createSignal, onMount, type Setter, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { useNodeState } from "~/features/editor/utils"
import { createStorage } from "~/utils"
import { ASSETS_SERVER_URL } from "~/api"
import { useJournalContext } from "~/features/journal"
import type { editor } from "~/wailsjs/go/models"
import { CreateGalleryData, GetGalleryData, UploadFileToGallery, UpdateGalleryData, DeleteGallery } from "~/wailsjs/go/editor/EditorExport"
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
   * - Otherwise, always `http://localhost:8000/local-assets/gallery/[galleryId]/[fileName]`
   */
  getDisplayUrl$(fileName: string): string
  /**Upload a single file into this gallery.
   * @param filePath The local file path of the single file to upload.
   * @returns A promise that resolves when the file upload is complete.
   */
  uploadFileToGallery$(filePath: string): Promise<void>
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
  /**Change if the gallery should go to fullscreen or not. */
  setIsFullscreen$: Setter<boolean>
  isNextButtonDisabled$: Accessor<boolean>
  isPrevButtonDisabled$: Accessor<boolean>
}

const Context = createContext<IGalleryContext>()

interface IGalleryProviderProps {
  // ...
}

export function GalleryProvider(props: ParentProps<IGalleryProviderProps>) {
  const { data$, updateAttribute$ } = useNodeState<GalleryAttribute>()
  const { sessionStorage$ } = useJournalContext()
  const [galleryData, setGalleryData] = createStore<editor.GalleryData>({} as editor.GalleryData)

  const [isNextButtonDisabled, setIsNextButtonDisabled] = createSignal(false)
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = createSignal(false)
  const [isFullscreen, setIsFullscreen] = createSignal(false)

  const wrappedSessionStorage: GallerySessionStorage = createStorage(sessionStorage, 'gallery$')

  const isNotCreated = () => data$().id === DEFAULT_GALLERY_ID
  const getCurrentGalleryId = () => galleryData!.id ?? data$().id 
  const getCurrentGroupId = () => sessionStorage$.get$("journal_data$").groupId$
  const CURRENT_INDEX_STORAGE_KEY = `${getCurrentGroupId()}.${getCurrentGalleryId()}.currIndex` as const

  // Tracks current item displayed in both default view and fullscreen view
  const [currentIndex, setCurrentIndex] = createSignal(
    wrappedSessionStorage.get$(CURRENT_INDEX_STORAGE_KEY) ?? 0
  )
  const [currentItem, setCurrentItem] = createSignal<editor.GalleryItem>()

  onMount(async() => {
    if (isNotCreated()) {
      const newData = await CreateGalleryData()
      updateAttribute$("id", newData.id)
      setGalleryData(newData)
      return
    }

    if (getCurrentGalleryId() === DEFAULT_GALLERY_ID) {
      return // don't load
    }

    const existingData = await GetGalleryData(getCurrentGalleryId())

    // setIsPrevButtonDisabled(lastCurrentIndex === 0)
    // setIsNextButtonDisabled(lastCurrentIndex === existingData.items.length - 1)
    setGalleryData(existingData)

    updateCurrentItem()
  })

  onCleanup(() => {
    // on the backend side, this function will make sure it won't delete everything
    // unless there is no gallery item
    try {
      DeleteGallery(getCurrentGalleryId())
    } catch(error) {
      console.warn("[anti-crash]", error)
    }
  })

  const next = () => {
    // keep incrementing until it reaches the last gallery item
    if (currentIndex() !== galleryData.items.length) {
      setCurrentIndex(prev => prev + 1)
      // currentIndex += 1
      updateCurrentItem()
      // setIsNextButtonDisabled(false)
      return
    }

    // setIsNextButtonDisabled(true)
  }
  
  const previous = () => {
    // keep decrementing until it reaches the first gallery item
    if (currentIndex() !== 0) {
      setCurrentIndex(prev => prev - 1)
      updateCurrentItem()
      // setIsPrevButtonDisabled(false)
      return
    }

    // setIsPrevButtonDisabled(true)
  }
  
  const updateCurrentItem = () => {
    // @ts-ignore - reupdate current item
    setCurrentItem(null)
    // setting current item here is not enough to trigger an update,
    // so we need the line above.
    setCurrentItem(galleryData.items[currentIndex()])
    wrappedSessionStorage.set$(CURRENT_INDEX_STORAGE_KEY, currentIndex())
  }

  const getDisplayUrl = (fileName: string) => {
    if (galleryData.basePath) {
      const escapedFileName = encodeURIComponent(`${galleryData.basePath}/${fileName}`)
      return `${ASSETS_SERVER_URL}/preview?path=${escapedFileName}` as const
    }

    return `${ASSETS_SERVER_URL}/local-assets/gallery/${galleryData.id}/${encodeURIComponent(fileName)}` as const
  }

  return (
    <Context.Provider value={{
      data$: () => galleryData,
      currentIndex$: currentIndex,
      next$: next,
      isFullscreen$: isFullscreen,
      setIsFullscreen$: setIsFullscreen,
      previous$: previous,
      currentItem$: currentItem,
      getDisplayUrl$: getDisplayUrl,
      isNextButtonDisabled$: isNextButtonDisabled,
      isPrevButtonDisabled$: isPrevButtonDisabled,
      async uploadMultipleFile$() {
        // const 
        // todo
      },
      async uploadFileToGallery$(filePath) {
        const galleryItem = await UploadFileToGallery(getCurrentGalleryId(), filePath)
        if (galleryData.items.length === 0) {
          setCurrentItem(galleryItem)
        }

        setGalleryData("items", galleryData.items.length, galleryItem)
        await UpdateGalleryData(getCurrentGalleryId(), galleryData)
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryContext() {
  return useContext(Context)!
}