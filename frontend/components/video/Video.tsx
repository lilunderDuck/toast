import { createContext, ParentProps, useContext } from "solid-js"
import { createMediaPlayer, useDocumentEventListener, type MediaPlayer } from "~/hooks"
import { VideoContent } from "./VideoContent"
import type { gallery } from "~/wailsjs/go/models"
import { DEBUG_INFO_LABEL } from "macro-def"

interface IVideoContext {
  videoPlayer$: MediaPlayer
}

const Context = createContext<IVideoContext>()

export interface IVideoProps {
  src$: string
  subtitleUrlRoot$?: string
  subtitles$?: gallery.GalleryVideoSubtitleData[]
  enableKeyboardShotcuts$?: boolean
}

export function Video(props: ParentProps<IVideoProps>) {
  const videoPlayer = createMediaPlayer("video")

  if (props.enableKeyboardShotcuts$) {
    useDocumentEventListener("keyup", (keyboardEvent) => {
      if (keyboardEvent.key === " ") {
        videoPlayer.state$() === MediaState.PAUSED ? 
          videoPlayer.play$() :
          videoPlayer.pause$()
      }
    })

    DEBUG_INFO_LABEL("video", "video keyboard shortcut is enabled")
  }

  return (
    <Context.Provider value={{ 
      videoPlayer$: videoPlayer
    }}>
      <VideoContent {...props} />
    </Context.Provider>
  )
}

export function useVideoContext() {
  return useContext(Context)!
}