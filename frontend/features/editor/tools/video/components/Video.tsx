import { Show } from "solid-js"
// ...
import { useResource, useToggleState } from "~/hook"
import { mergeClassname, sleep } from "~/utils"
import { FlexCenterY, SpinningCube } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Video.module.css"
// ...
import type { IVideoBlockData } from "../data"
import { VideoControls, IVideoControlsProps, VideoControlState } from "./VideoControls"
import { createVideoProgressBar } from "./VideoProgressBar"
import FullScreenButton from "./FullScreenButton"

const style = stylex.create({
  bound: {
    width: '100%',
    minHeight: '25rem'
  },
  progressBar: {
    bottom: 0,
    marginBottom: 5,
    marginInline: 20,
    width: "-webkit-fill-available",
    backgroundColor: "var(--gray3)",
    paddingBlock: 5,
    paddingInline: 10,
    borderRadius: 6,
    gap: 10
  }
})

interface IVideoProps extends IVideoBlockData {
  isLoading$?: boolean
}

export function Video(props: IVideoProps) {
  const { ProgressBar$, updateProgressBar$, setTotalDuration$ } = createVideoProgressBar()
  let thisVideoRef!: Ref<"video">
  let everythingRef!: Ref<"div">

  const updateVideoProgressBar: EventHandler<"video", "onTimeUpdate"> = () => {
    setTotalDuration$(thisVideoRef.duration)
    updateProgressBar$(thisVideoRef.currentTime)
  }

  const controlThisVideo: IVideoControlsProps["onClickingSomething$"] = (state) => {
    switch (state) {
      case VideoControlState.playing:
        thisVideoRef.play()
        break
      case VideoControlState.pausing:
        thisVideoRef.pause()
        break
      case VideoControlState.fullscreen:
        everythingRef.requestFullscreen()
        break
      case VideoControlState.unfullscreen:
        document.exitFullscreen()
        break
    }
  }

  const [isFullScreen, toggleFullscreen] = useToggleState(false)

  return (
    <FlexCenterY 
      class={mergeClassname(
        __style.video
      )}
      ref={everythingRef}
    >
      <video 
        src={props.videoUrl} 
        ref={thisVideoRef}
        onTimeUpdate={updateVideoProgressBar}
        preload="metadata"
      />

      <Show when={props.isLoading$}>
        <div>
          <SpinningCube cubeSize$={30} />
        </div>
      </Show>

      <FlexCenterY class={mergeClassname(
        stylex.attrs(style.progressBar), 
        isFullScreen() ? __style.controlsInFullscreen : __style.controls
      )}>
        <VideoControls onClickingSomething$={controlThisVideo}>
          <ProgressBar$ />
          <FullScreenButton 
            toggle$={[isFullScreen, toggleFullscreen]} 
            videoRef$={() => everythingRef}
          />
        </VideoControls>
      </FlexCenterY>
    </FlexCenterY>
  )
}