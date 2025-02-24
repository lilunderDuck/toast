import { lazy, Show } from "solid-js"
// ...
import { useJournalContext } from "~/features/journal"
import { api_getImageSavedPath } from "~/api/media"
// ...
import { IBlockSetting, useEditorContext } from "../../provider"
import { IImageData } from "./Image"
import { ImageDataProvider, useImageDataContext } from "./ImageDataProvider"

export function createImageBlock(): IBlockSetting<IImageData> {
  const ImageInput = lazy(() => import('./ImageInput'))
  const Image = lazy(() => import('./Image'))

  const TheImage = () => {
    const { data$ } = useImageDataContext()
    const { sessionStorage$ } = useJournalContext()
    const currentGroupId = sessionStorage$.get$('currentGroup').id
    
    return (
      <Image 
        name$={data$().imgName}
        src$={api_getImageSavedPath(currentGroupId, data$().imgName)}
        description$={data$().description}
      />
    )
  }

  return {
    displayName$: "Image",
    get defaultValue$() {
      return { imgName: '' }
    },
    blockComponent$(props) {
      const { blocks$, isReadonly$ } = useEditorContext()

      return (
        <ImageDataProvider 
          dataIn$={props.dataIn$} 
          onChange$={(newData) => blocks$.saveBlockData$(props.blockId$, newData)}
        >
          <Show when={isReadonly$()} fallback={
            <ImageInput />
          }>
            <TheImage />
          </Show>
        </ImageDataProvider>
      )
    }
  }
}