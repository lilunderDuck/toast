import { Accessor, createContext, createEffect, createSignal, ParentProps, Signal, useContext } from "solid-js"
import { imgZoomPanLog } from "../debug"

interface IZoomAndPanContext {
  changeDisplayImage$(newImageUrl: string): void
  zoom$(): void
  unzoom$(): void
  internal$: {
    zoomScale$: Accessor<number>
    displayImageUrl$: Accessor<string>
    imagePosition$: Signal<{ x: number, y: number }>
  }
}

const Context = createContext<IZoomAndPanContext>()

export function ZoomAndPanProvider(props: ParentProps) {
  const [scale, setScale] = createSignal(1)
  const [displayImageUrl, setDisplayImageUrl] = createSignal('')
  const [imagePosition, setImagePosition] = createSignal({
    x: null as unknown as number,
    y: null as unknown as number
  })

  //debug-start
  createEffect(() => {
    imgZoomPanLog.log("Image scale changed to:", scale())
  })
  createEffect(() => {
    imgZoomPanLog.log("Display image changed to", displayImageUrl() === '' ? '[nothing]' : displayImageUrl())
  })
  //debug-end
  
  const STEP = 0.5
  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 })
    //debug-start
    imgZoomPanLog.log("Image position reset")
    //debug-end
  }

  return (
    <Context.Provider value={{
      zoom$() {
        setScale(prev => prev + STEP)
      },
      unzoom$() {
        setScale(prev => {
          if (prev <= 0) {
            return 0 // stop scaling
          }
          
          return prev - STEP
        })

        if (scale() <= 1) {
          resetImagePosition()
        }
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