import { IBlockSetting, useEditorContext } from "../provider"
import { Image, IImageData } from "../common/image"

export function createImageBlock(): IBlockSetting<IImageData> {
  return {
    displayName$: "Image",
    get defaultValue$() {
      return { imgName: '' }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()

      return (
        <Image 
          dataIn$={props.dataIn$} 
          onChange$={(newData) => blocks$.saveBlockData$(props.blockId$, newData)}
        />
      )
    }
  }
}