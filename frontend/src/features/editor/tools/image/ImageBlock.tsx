import { IBlockSetting } from "../../provider"
import { IImageData } from "./Image"
import { ImageInput } from "./ImageInput"

export function createImageBlock(): IBlockSetting<IImageData> {
  return {
    displayName$: "Image",
    get defaultValue$() {
      return { imgName: '' }
    },
    blockComponent$(props) {
      return (
        <ImageInput />
      )
    }
  }
}