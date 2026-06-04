import { type Accessor, createContext, createSignal, type ParentProps, type Signal, useContext } from "solid-js"

interface IZoomAndPanContext {
  changeDisplayImage$(newImageUrl: string): void
  zoom$(): void
  unzoom$(): void
  reset$(): void
  internal$: {
    zoomScale$: Accessor<number>
    displayImageUrl$: Accessor<string>
    imagePosition$: Signal<{ x: number, y: number }>
  }
}

const Context = createContext<IZoomAndPanContext>()

export function ZoomAndPanProvider(props: ParentProps) {
  const DEFAULT_ZOOM = 1
  const [scale, setScale] = createSignal(DEFAULT_ZOOM)
  const [displayImageUrl, setDisplayImageUrl] = createSignal('')
  const [imagePosition, setImagePosition] = createSignal({
    x: null as unknown as number,
    y: null as unknown as number
  })
  
  const STEP = 0.5
  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 })
  }

  return (
    <Context.Provider value={{
      zoom$() {
        setScale(prev => prev + STEP)
      },
      unzoom$() {
        setScale(prev => prev - STEP)

        if (scale() <= 1) {
          resetImagePosition()
        }
      },
      reset$() {
        setScale(DEFAULT_ZOOM)
        resetImagePosition()
      },
      changeDisplayImage$(newImageUrl) {
        setDisplayImageUrl(newImageUrl)
        resetImagePosition()
      },
      internal$: {
        zoomScale$: scale,
        displayImageUrl$: displayImageUrl,
        imagePosition$: [imagePosition, setImagePosition]
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useZoomAndPanContext() {
  return useContext(Context)!
}