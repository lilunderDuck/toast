import { Accessor, createContext, createSignal, ParentProps, useContext } from "solid-js"
import { IImageData } from "./Image"
import { editorLog } from "~/features/debug"

interface IImageDataContext {
  data$: Accessor<IImageData>
  update$(someData: Partial<IImageData>): void
}

const Context = createContext<IImageDataContext>()

interface IImageDataProviderProps {
  dataIn$: IImageData
  onChange$(newData: IImageData): void
}

export function ImageDataProvider(props: ParentProps<IImageDataProviderProps>) {
  const [data, setData] = createSignal(props.dataIn$)
  return (
    <Context.Provider value={{
      data$: data, 
      update$(someData) {
        setData(prev => ({
          ...prev,
          ...someData
        }))

        props.onChange$(data())
        editorLog.logLabel("image", "new image data updated:", data())
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useImageDataContext() {
  return useContext(Context)!
}