import { DEBUG_ASSERT, DEBUG_INFO_LABEL, DEBUG_WARN_LABEL } from "macro-def"
import { createContext, createSignal, onMount, ParentProps, useContext, type Accessor } from "solid-js"
import { useDocumentEventListener, usePersistedSignal } from "~/hooks"
import { GALLERY_IN_EXTERNAL_MODE } from "./constants"
import { Gallery_getEntryByPath } from "~/wailsjs/go/gallery/Exports"
import type { gallery } from "~/wailsjs/go/models"
import { toast, useZoomAndPanContext } from "~/components"
import type { AnyNoArgsFunction } from "~/utils"
import { GalleryReduceModeToast } from "../components"

interface IGalleryContext {
  entries$: Accessor<gallery.GalleryItemData[]>

  goToNextItem$(): void
  goToPrevItem$(): void
  currentItem$: Accessor<gallery.GalleryItemData | undefined>

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
  const [currentItemIndex, setCurrentItemIndex] = usePersistedSignal(localStorage, isExternal ? props.directory$! : `gallery_${props.galleryId$}`, 0)

  DEBUG_INFO_LABEL("gallery", "previously saved gallery item index is:", currentItemIndex())

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
    setShouldDisableNextBtn(currentItemIndex() + 1 === entries().length)
    setShouldDisablePrevBtn(currentItemIndex() === 0)
  }

  onMount(async() => {
    DEBUG_INFO_LABEL("gallery", "start fetching...")
    if (isExternal) {
      DEBUG_INFO_LABEL("gallery", "you've said the magic word, opening gallery in external mode...")
      DEBUG_ASSERT(props.directory$, "gallery opened in external mode requires an additional prop: directory$. Currently, it is ", typeof props.directory$)

      const entries = await Gallery_getEntryByPath(props.directory$!)
      setEntries(entries)
    }

    const currentItem = currentItemIndex() + 1
    const isInBound = currentItem <= entries().length && currentItem > 0
    if (!isInBound) {
      DEBUG_WARN_LABEL("gallery", "item that previously saved is not in bound, setting it back to 0 (the first item in the gallery)")
      setCurrentItemIndex(0)
    }
    
    updateButtonsState()
    updateCurrentItem()
  })

  const toggleReducedMode = () => {
    setAllControlsHidden(prev => !prev)

    toast.custom(() => <GalleryReduceModeToast isInReduceMode$={allControlsHidden()} />, {
      position: ToastPosition.BOTTOM_CENTER
    })
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