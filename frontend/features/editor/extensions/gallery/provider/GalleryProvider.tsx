import { createContext, type ParentProps, type Accessor, useContext, createSignal, onMount, type Setter } from "solid-js"
import { createStore } from "solid-js/store"
// ...
import { createOrGetData } from "~/features/editor/utils"
import { createStorage } from "~/utils"
import { ASSETS_SERVER_URL } from "~/api"
import { useJournalContext } from "~/features/journal"
import type { gallery } from "~/wailsjs/go/models"
import { CreateGallery, GetGallery, UpdateGallery, UploadToGallery } from "~/wailsjs/go/gallery/Exports"
// ...
import type { GallerySessionStorage } from "./data"
import { DEFAULT_GALLERY_ID, type GalleryAttribute } from "../extension"
import { useSolidNodeView } from "~/libs/solid-tiptap-renderer"

export interface IGalleryContext {
  /**Gets the current gallery data. */
  data$: () => gallery.GalleryData
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
  currentItem$: Accessor<gallery.GalleryItem | undefined>
  /**Gets the display url of an item in the gallery.
   * @param fileName The file name of the gallery item to get the URL for.
   * @returns 
   * - If gallery data contains `basePath` prop (because it supports saving gallery content
   * somewhere else), this function returns `http://localhost:8000/preview?path=[fileName]`
   * - Otherwise, always `http://localhost:8000/local-assets/media/[galleryId]/[fileName]`
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
  const { attrs$ } = useSolidNodeView<GalleryAttribute>()
  const { sessionStorage$ } = useJournalContext()
  const [galleryData, setGalleryData] = createStore<gallery.GalleryData>({} as gallery.GalleryData)

  const [isNextButtonDisabled, setIsNextButtonDisabled] = createSignal(false)
  const [isPrevButtonDisabled, setIsPrevButtonDisabled] = createSignal(false)
  const [isFullscreen, setIsFullscreen] = createSignal(false)

  const wrappedSessionStorage: GallerySessionStorage = createStorage(sessionStorage, 'gallery$')

  const getCurrentGalleryId = () => galleryData!.id ?? attrs$().id 
  const getCurrentGroupId = () => sessionStorage$.get$("journal_data$").groupId$
  const CURRENT_INDEX_STORAGE_KEY = `${getCurrentGroupId()}.${getCurrentGalleryId()}.currIndex` as const

  // Tracks current item displayed in both default view and fullscreen view
  const [currentIndex, setCurrentIndex] = createSignal(
    wrappedSessionStorage.get$(CURRENT_INDEX_STORAGE_KEY) ?? 0
  )
  const [currentItem, setCurrentItem] = createSignal<gallery.GalleryItem>()

  onMount(async() => {
    const data = await createOrGetData<gallery.GalleryData>(
      attrs$().id === DEFAULT_GALLERY_ID,
      () => CreateGallery(),
      () => GetGallery(getCurrentGalleryId())
    )

    setGalleryData(data)
    updateCurrentItem()
  })

  const next = () => {
    // keep incrementing until it reaches the last gallery item
    if (currentIndex() !== galleryData.items.length) {
      setCurrentIndex(prev => prev + 1)
      updateCurrentItem()
      setIsNextButtonDisabled(false)
      return
    }

    setIsNextButtonDisabled(true)
  }
  
  const previous = () => {
    // keep decrementing until it reaches the first gallery item
    if (currentIndex() !== 0) {
      setCurrentIndex(prev => prev - 1)
      updateCurrentItem()
      setIsPrevButtonDisabled(false)
      return
    }

    setIsPrevButtonDisabled(true)
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

    return `${ASSETS_SERVER_URL}/local-assets/media/gallery/${galleryData.id}/${encodeURIComponent(fileName)}` as const
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
        const galleryItem = await UploadToGallery(getCurrentGalleryId(), filePath)
        if (galleryData.items.length === 0) {
          setCurrentItem(galleryItem)
        }

        setGalleryData("items", galleryData.items.length, galleryItem)
        await UpdateGallery(getCurrentGalleryId(), galleryData)
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryContext() {
  return useContext(Context)!
}