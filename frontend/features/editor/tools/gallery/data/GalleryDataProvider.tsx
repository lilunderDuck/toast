import { type Accessor, createContext, createSignal, onMount, ParentProps, useContext } from "solid-js"
// ...
import { createStorage, IStorage } from "~/utils"
import { editorLog } from "~/features/debug"
import { api_getGallery, api_saveGalleryItem, IGalleryItemData } from "~/api/journal"
import { useJournalContext } from "~/features/journal"
// ...
import { type IGalleryBlockData } from "../GalleryBlock"
import { type IPageUtils, createPageUtils } from "./page"

export type GalleryLocalStorage = IStorage<{
  [key: `gallery-${string}-currentPage`]: number
}>

export interface IGalleryDataContext {
  page$: IPageUtils
  galleryId$: string
  galleryItem$: Accessor<IGalleryItemData[]>
  addGalleryItem$(newImages: string): Promise<void>
  localStorage$: GalleryLocalStorage
}

const Context = createContext<IGalleryDataContext>()

interface GalleryDataProviderProps {
  dataIn$: IGalleryBlockData
  onChange$(data: IGalleryBlockData): void
}

export function GalleryDataProvider(props: ParentProps<GalleryDataProviderProps>) {
  const { getCurrentGroup$ } = useJournalContext()
  const [images, setImages] = createSignal<IGalleryItemData[]>([])

  let galleryId = props.dataIn$.galleryId
  const wrappedLocalStorage: GalleryLocalStorage = createStorage(localStorage)
  const pageUtils = createPageUtils(galleryId, wrappedLocalStorage)

  pageUtils.setTotalPage$(images().length === 0 ? 0 : images().length)

  const currentGroup = getCurrentGroup$().id

  onMount(async() => {
    const items = await api_getGallery(currentGroup, galleryId)
    setImages(items)
    isDevMode && editorLog.logLabel("gallery", items)
  })

  // make sure to save this so we don't have any weird data desync problem 
  // under the hood.
  props.onChange$(props.dataIn$) 

  return (
    <Context.Provider value={{
      get galleryId$() {
        return galleryId
      },
      page$: pageUtils,
      get galleryItem$() {
        return images
      }, 
      localStorage$: wrappedLocalStorage,
      async addGalleryItem$(newImages) {
        // this assert exists is because in case I mess up something, 
        // it might be a reminder to me. 
        console.assert(galleryId, "galleryId should not be null or undefined")
        const file = await api_saveGalleryItem(currentGroup, galleryId, newImages)
        setImages(prev => [...prev, file]) 
        pageUtils.setTotalPage$(images().length)

        isDevMode && editorLog.logLabel("gallery", "added", newImages)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryDataContext() {
  return useContext(Context)!
}