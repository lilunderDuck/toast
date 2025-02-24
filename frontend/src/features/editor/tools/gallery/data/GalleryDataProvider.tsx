import { type Accessor, createContext, createSignal, ParentProps, type Setter, useContext } from "solid-js"
// ...
import { type IGalleryBlockData } from "../GalleryBlock"
import { type IPageUtils, createPageUtils } from "./page"
import { createStorage, IStorage } from "~/utils"

export type GalleryLocalStorage = IStorage<{
  [key: `gallery-${number}-currentPage`]: number
}>

interface IGalleryDataContext {
  page$: IPageUtils
  galleryId$: number
  images$: Accessor<IGalleryBlockData["images"]>
  setImages$: Setter<IGalleryBlockData["images"]>
  addImages$(newImages: string[]): void
  localStorage$: GalleryLocalStorage
}

const Context = createContext<IGalleryDataContext>()

interface GalleryDataProviderProps {
  dataIn$: IGalleryBlockData
  onChange$(data: IGalleryBlockData): void
}

export function GalleryDataProvider(props: ParentProps<GalleryDataProviderProps>) {
  const [images, setImages] = createSignal(props.dataIn$.images)

  const galleryId = props.dataIn$.id
  const wrappedLocalStorage: GalleryLocalStorage = createStorage(localStorage)
  const pageUtils = createPageUtils(galleryId, wrappedLocalStorage)

  pageUtils.setTotalPage$(images().length === 0 ? 0 : images().length)

  return (
    <Context.Provider value={{
      galleryId$: galleryId,
      page$: pageUtils,
      images$: images, 
      setImages$: setImages,
      localStorage$: wrappedLocalStorage,
      addImages$(newImages) {
        setImages(prev => [...prev, ...newImages])
        pageUtils.setTotalPage$(images().length)
        props.onChange$({
          id: galleryId,
          images: images()
        })
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryDataContext() {
  return useContext(Context)!
}