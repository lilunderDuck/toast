import { DEBUG_ASSERT, DEBUG_INFO_LABEL, DEBUG_WARN_LABEL } from "macro-def"
import { createContext, createSignal, onCleanup, onMount, ParentProps, useContext, type Accessor } from "solid-js"
// ...
import { useDocumentEventListener } from "~/hooks"
import type { gallery } from "~/wailsjs/go/models"
import { Gallery_getEntryByPath } from "~/wailsjs/go/gallery/Exports"
import { useZoomAndPanContext } from "~/components"
import type { AnyNoArgsFunction } from "~/utils"
// ...
import { GALLERY_IN_EXTERNAL_MODE } from "./constants"
import { showGalleryReduceModeToast } from "../components"
import { AppStorage_Get, AppStorage_Set } from "~/wailsjs/go/app_storage/Exports"

interface IGalleryContext {
  entries$: Accessor<gallery.GalleryItemData[]>

  goToNextItem$(): void
  goToPrevItem$(): void
  currentItem$: Accessor<gallery.GalleryItemData | undefined>
  currentItemIndex$: Accessor<number>

  shouldDisableNextBtn$: Accessor<boolean>
  shouldDisablePrevBtn$: Accessor<boolean>
  allControlsHidden$: Accessor<boolean>

  isExternal$: boolean
  directory$?: string
}

const Context = createContext<IGalleryContext>()

interface IGalleryProviderProps {
  galleryId$: string
  directory$?: string
}

export function GalleryProvider(props: ParentProps<IGalleryProviderProps>) {
  DEBUG_ASSERT(
    typeof props.galleryId$ === "string",
    "galleryId must be of type 'string', did you pass in 'undefined'?"
  )

  const [entries, setEntries] = createSignal<gallery.GalleryItemData[] /* temp */>([])
  const [shouldDisableNextBtn, setShouldDisableNextBtn] = createSignal(true)
  const [shouldDisablePrevBtn, setShouldDisablePrevBtn] = createSignal(true)
  const [currentItem, setCurrentItem] = createSignal<gallery.GalleryItemData>()
  const { zoom$, unzoom$ } = useZoomAndPanContext()
  const [allControlsHidden, setAllControlsHidden] = createSignal(false)
  
  const isExternal = props.galleryId$ === GALLERY_IN_EXTERNAL_MODE
  const [currentItemIndex, setCurrentItemIndex] = createSignal(0)

  const goToNextItem = () => {
    updateButtonsState()
    if (currentItemIndex() + 1 === entries().length) {
      return
    }

    setCurrentItemIndex(prev => prev + 1)
    updateCurrentItem()
  }

  const goToPrevItem = () => {
    updateButtonsState()
    if (currentItemIndex() === 0) {
      return
    }

    setCurrentItemIndex(prev => prev - 1)
    updateCurrentItem()
  }

  const updateCurrentItem = () => {
    const newCurrentItem = entries()[currentItemIndex()]
    if (!newCurrentItem) {
      DEBUG_WARN_LABEL("gallery", "next/prev item is undefined!")
      return
    }
    setCurrentItem(entries()[currentItemIndex()])
    DEBUG_INFO_LABEL("gallery", "current item updated to:", currentItemIndex(), entries()[currentItemIndex()])
  }

  const updateButtonsState = () => {
    setShouldDisableNextBtn(currentItemIndex() === entries().length - 1)
    setShouldDisablePrevBtn(currentItemIndex() === 0)
  }

  const GALLERY_STORAGE_KEY = isExternal ? props.directory$! : `gallery_${props.galleryId$}`

  onMount(async() => {
    DEBUG_INFO_LABEL("gallery", "fast fetching: fetch", GALLERY_STORAGE_KEY)
    if (TOAST_DEBUG) {
      if (isExternal) {
        DEBUG_INFO_LABEL("gallery", "you've said the magic word, opening gallery in external mode...")
        DEBUG_ASSERT(props.directory$, "gallery opened in external mode requires an additional prop: directory$. Currently, it is ", typeof props.directory$)
      }
    }

    const [rawLastGalleryItem, galleryEntries] = await Promise.all([
      AppStorage_Get(GALLERY_STORAGE_KEY),
      Gallery_getEntryByPath(props.directory$!)
    ])

    setEntries(galleryEntries)

    const lastGalleryItemIndex = parseInt(rawLastGalleryItem)
    if (!isNaN(lastGalleryItemIndex)) {
      const currentItem = lastGalleryItemIndex + 1
      const isInBound = currentItem <= entries().length && currentItem > 0
      if (!isInBound) {
        DEBUG_WARN_LABEL("gallery", "item that previously saved is not in bound:", currentItem, "between", 0, "and", entries().length - 1, ", setting it back to 0 (the first item in the gallery)")
        setCurrentItemIndex(0)
      } else {
        setCurrentItemIndex(lastGalleryItemIndex)
      }
    }
    
    updateButtonsState()
    updateCurrentItem()
  })

  onCleanup(() => {
    DEBUG_INFO_LABEL("gallery", "saving current item index, last item is at index", currentItemIndex(), currentItem())
    AppStorage_Set(GALLERY_STORAGE_KEY, `${currentItemIndex()}`)
  })

  const toggleReducedMode = () => {
    setAllControlsHidden(prev => !prev)
    showGalleryReduceModeToast(allControlsHidden())
  }

  const keyMapping: Record<string, AnyNoArgsFunction> = {
    "a": goToPrevItem,
    "arrowleft": goToPrevItem,
    "d": goToNextItem,
    "arrowright": goToNextItem,
    "e": zoom$,
    "q": unzoom$,
    "r": toggleReducedMode
  }

  useDocumentEventListener('keyup', (keyboardEvent) => {
    const keyPressed = keyboardEvent.key.toLowerCase()

    if (keyboardEvent.shiftKey || keyboardEvent.ctrlKey) return

    const action = keyMapping[keyPressed]
    if (!action) {
      DEBUG_INFO_LABEL("gallery", "ignored key shortcut:", keyPressed)
      return
    }

    action()
  })

  return (
    <Context.Provider value={{
      entries$: entries,
      goToNextItem$: goToNextItem,
      goToPrevItem$: goToPrevItem,
      currentItem$: currentItem,
      currentItemIndex$: currentItemIndex,
      shouldDisableNextBtn$: shouldDisableNextBtn,
      shouldDisablePrevBtn$: shouldDisablePrevBtn,
      allControlsHidden$: allControlsHidden,
      isExternal$: isExternal,
      directory$: props.directory$,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGalleryContext() {
  return useContext(Context)!
}