import { getRandomNumberFrom } from "~/utils"
// ...
import { IBlockSetting, useEditorContext } from "../../provider"
import { GalleryDataProvider } from "./data"
import { GalleryButtonRow, GalleryList } from "./ui"

export interface IGalleryBlockData {
  galleryId: string
}

export function createGalleryBlock(): IBlockSetting<IGalleryBlockData> {
  const randomNumber = () => getRandomNumberFrom(0, 100)
  const galleryId = `${randomNumber()}-${randomNumber()}-${randomNumber()}-${randomNumber()}` as const
  return {
    displayName$: "Gallery",
    get defaultValue$() {
      return {
        galleryId: galleryId
      }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()

      return (
        <GalleryDataProvider dataIn$={props.dataIn$} onChange$={(data) => {
          blocks$.saveBlockData$(props.blockId$, data)
        }}>
          <GalleryList />
          <GalleryButtonRow />
        </GalleryDataProvider>
      )
    }
  }
}