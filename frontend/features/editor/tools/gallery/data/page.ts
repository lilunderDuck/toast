import { Accessor, createSignal, Setter } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
// ...
import type { GalleryLocalStorage } from "./GalleryDataProvider"
import { useEditorContext } from "~/features/editor/provider"

export interface IPageUtils {
  focusNext$(): void
  focusPrevious$(): void
  setCurrentPage$(index: number): void
  pageIndexName$(index: number): string
  currentPage$: Accessor<number>
  totalPage$: Accessor<number>
  setTotalPage$: Setter<number>
}

export function createPageUtils(galleryId: string, wrappedLocalStorage: GalleryLocalStorage): IPageUtils {
  const { localStorage$ } = useEditorContext()

  const STORAGE_KEY = `gallery_curr_page_${galleryId}`
  const FIRST_PAGE = 0
  const INITIAL_PAGE = localStorage$.get$(STORAGE_KEY) ?? FIRST_PAGE

  const [currentPage, setCurrentPage] = createSignal(INITIAL_PAGE)
  const [totalPage, setTotalPage] = createSignal(0)

  const getLastPage = () => totalPage() - 1
  const pageName: IPageUtils["pageIndexName$"] = (index) => {
    return `p${index}` as const
  }

  const focus = (pageIndex: number) => {
    let pageRefs = document.querySelectorAll(`#gallery-${galleryId} #${pageName(pageIndex)}`)
    for (const ref of pageRefs) {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }

    localStorage$.set$(STORAGE_KEY, pageIndex)
    isDevMode && editorLog.logLabel("gallery", "focused page/page name/element:", pageIndex, pageName(pageIndex), pageRefs)
  }

  const capDisplay = (counter: number) => {
    const lastPage = getLastPage()
    if (counter >= lastPage) {
      return lastPage
    }

    if (counter < FIRST_PAGE) {
      return FIRST_PAGE
    }

    return counter
  }

  if (INITIAL_PAGE !== FIRST_PAGE) {
    focus(INITIAL_PAGE)
  }

  return {
    currentPage$: currentPage,
    setCurrentPage$(index) {
      setCurrentPage(index)
    },
    focusNext$() {
      setCurrentPage(prev => capDisplay(prev + 1))
      focus(currentPage())
    },
    focusPrevious$() {
      setCurrentPage(prev => capDisplay(prev - 1))
      focus(currentPage())
    },
    pageIndexName$: pageName,
    totalPage$: totalPage,
    setTotalPage$: setTotalPage
  }
}