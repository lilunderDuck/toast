import { Accessor, createSignal, Setter } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
// ...
import type { GalleryLocalStorage } from "./GalleryDataProvider"

export interface IPageUtils {
  focusNext$(): void
  focusPrevious$(): void
  pageIndexName$(index: number): `page-${number}`
  currentPage$: Accessor<number>
  totalPage$: Accessor<number>
  setTotalPage$: Setter<number>
}

export function createPageUtils(galleryId: number, wrappedLocalStorage: GalleryLocalStorage): IPageUtils {
  const FIRST_PAGE = 0
  const initialPage = wrappedLocalStorage.get$(`gallery-${galleryId}-currentPage`) ?? FIRST_PAGE
  const [currentPage, setCurrentPage] = createSignal(initialPage)
  const [totalPage, setTotalPage] = createSignal(0)

  const getLastPage = () => totalPage() - 1

  const pageName: IPageUtils["pageIndexName$"] = (index) => {
    return `page-${index}` as const
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

    wrappedLocalStorage.set$(`gallery-${galleryId}-currentPage`, pageIndex)
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

  if (initialPage !== FIRST_PAGE) {
    focus(initialPage)
  }

  return {
    currentPage$: currentPage,
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