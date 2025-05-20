import { type IBlockSetting, useEditorContext } from "../provider"
import { VideoDataProvider, type IVideoBlockData, VideoInput } from "../common/video"

export function createVideoBlock(): IBlockSetting<IVideoBlockData> {
  return {
    displayName$: "Video",
    get defaultValue$() {
      return {
        videoName: ''
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