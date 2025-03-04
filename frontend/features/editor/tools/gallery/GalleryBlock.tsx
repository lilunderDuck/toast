import { getRandomNumberFrom } from "~/common"
// ...
import { IBlockSetting, useEditorContext } from "../../provider"
import { GalleryDataProvider } from "./data"
import { GallerySideView } from "./ui"

export interface IGalleryBlockData {
  images: string[]
  id: number
} 

export function createGalleryBlock(): IBlockSetting<IGalleryBlockData> {
  return {
    displayName$: "Gallery",
    get defaultValue$() {
      return {
        images: [],
        id: getRandomNumberFrom(1, 999_999_999)
      }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()

      return (
        <GalleryDataProvider dataIn$={props.dataIn$} onChange$={(data) => {
          blocks$.saveBlockData$(props.blockId$, data)
        }}>
          <GallerySideView />
        </GalleryDataProvider>
      )
    }
  }
}