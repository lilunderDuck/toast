import { type Accessor, createContext, createSignal, type ParentProps, type Setter, useContext } from "solid-js"

interface IZoomAndPanContext {
  zoom$(): void
  unzoom$(): void
  reset$(): void
  zoomScale$: Accessor<number>
  imageXPos$: Accessor<number>
  _setImageXPos$: Setter<number>
  imageYPos$: Accessor<number>
  _setImageYPos$: Setter<number>
}

const Context = createContext<IZoomAndPanContext>()

export function ZoomAndPanProvider(props: ParentProps) {
  const DEFAULT_ZOOM = 1
  const [scale, setScale] = createSignal(DEFAULT_ZOOM)

  const [imageXPos, setImageXPos] = createSignal(0)
  const [imageYPos, setImageYPos] = createSignal(0)
  
  const STEP = 0.5
  const resetImagePosition = () => {
    setImageXPos(0)
    setImageYPos(0)
  }

  return (
    <Context.Provider value={{
      zoom$() {
        setScale(prev => prev + STEP)
      },
      unzoom$() {
        if (scale() == 0.5) {
          return
        }

        setScale(prev => prev - STEP)

        if (scale() <= 1) {
          resetImagePosition()
        }
      },
      reset$() {
        setScale(DEFAULT_ZOOM)
        resetImagePosition()
      },
      zoomScale$: scale,
      imageXPos$: imageXPos,
      imageYPos$: imageYPos,
      _setImageXPos$: setImageXPos,
      _setImageYPos$: setImageYPos,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useZoomAndPanContext() {
  return useContext(Context)!
}