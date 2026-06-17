import { createContext, ParentProps, useContext } from "solid-js"
import { createMediaPlayer, type MediaPlayer } from "~/hooks"
import { VideoContent, type IVideoContentProps } from "./VideoContent"

interface IVideoContext {
  videoPlayer$: MediaPlayer
}

const Context = createContext<IVideoContext>()

export function Video(props: ParentProps<IVideoContentProps>) {
  return (
    <Context.Provider value={{ 
      videoPlayer$: createMediaPlayer("video")
    }}>
      <VideoContent {...props} />
    </Context.Provider>
  )
}

export function useVideoContext() {
  return useContext(Context)!
}