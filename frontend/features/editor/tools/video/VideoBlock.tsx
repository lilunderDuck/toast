import { type IBlockSetting, useEditorContext } from "../../provider"
import { VideoDataProvider, type IVideoBlockData } from "./data"
import { VideoInput } from "./ui/VideoInput"

export function createVideoBlock(): IBlockSetting<IVideoBlockData> {
  return {
    displayName$: "Video",
    get defaultValue$() {
      return {
        videoUrl: ''
      }
    },
    blockComponent$(props) {
      const { blocks$ } = useEditorContext()

      return (
        <VideoDataProvider 
          dataIn$={props.dataIn$} 
          onChange$={(data) => blocks$.saveBlockData$(props.blockId$, data)}
        >
          <VideoInput />
        </VideoDataProvider>
      )
    }
  }
}