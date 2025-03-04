import { lazy } from "solid-js"
// ...
import { IBlockSetting, useEditorContext } from "../../provider"
import { IImageData } from "./Image"
import { ImageDataProvider } from "./ImageDataProvider"

export function createImageBlock(): IBlockSetting<IImageData> {
  const ImageInput = lazy(() => import('./ImageInput'))

  return {
    displayName$: "Image",
    get defaultValue$() {
      return { imgName: '' }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()

      return (
        <ImageDataProvider 
          dataIn$={props.dataIn$} 
          onChange$={(newData) => blocks$.saveBlockData$(props.blockId$, newData)}
        >
          <ImageInput />
        </ImageDataProvider>
      )
    }
  }
}