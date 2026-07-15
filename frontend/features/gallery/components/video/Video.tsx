import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { createMediaPlayer, useDocumentEventListener, type MediaPlayer } from "~/hooks"
import { VideoContent } from "./VideoContent"
import type { gallery } from "~/wailsjs/go/models"
import { DEBUG_INFO_LABEL } from "macro-def"

interface IVideoContext {
  videoPlayer$: MediaPlayer<"video">
  isInPictureInPicture$: Accessor<boolean>
  setIsInPictureInPicture$: Setter<boolean>
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
  const [isInPictureInPicture, setIsInPictureInPicture] = createSignal(false)

  const VIDEO_JUMP_IN_SECONDS = 10

  if (props.enableKeyboardShotcuts$) {
    useDocumentEventListener("keyup", (keyboardEvent) => {
      if (keyboardEvent.shiftKey || keyboardEvent.ctrlKey) return

      const keyPressed = keyboardEvent.key.toLowerCase()

      switch (keyPressed) {
        case " ":
          DEBUG_INFO_LABEL("video", "toggle play")
          videoPlayer.state$() === MediaState.PAUSED ? videoPlayer.play$() : videoPlayer.pause$()
        break

        case "arrowleft": {
          DEBUG_INFO_LABEL("video", "going backward 10 seconds")
          videoPlayer.changeCurrentTime$(videoPlayer.currentProgress$() - 10)
        } break

        case "arrowright": {
          DEBUG_INFO_LABEL("video", "going forward 10 seconds")
          videoPlayer.changeCurrentTime$(videoPlayer.currentProgress$() + VIDEO_JUMP_IN_SECONDS)
        } break
      }
    })

    DEBUG_INFO_LABEL("video", "video keyboard shortcut is enabled")
  }

  return (
    <Context.Provider value={{ 
      videoPlayer$: videoPlayer,
      isInPictureInPicture$: isInPictureInPicture, 
      setIsInPictureInPicture$: setIsInPictureInPicture
    }}>
      <VideoContent {...props} />
    </Context.Provider>
  )
}

export function useVideoContext() {
  return useContext(Context)!
}