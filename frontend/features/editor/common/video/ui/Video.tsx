import { Show, splitProps, type ParentProps } from "solid-js"
// ...
import { mergeClassname } from "~/utils"
import { FlexCenterY, FlexCenter, createLazyLoadedDialog } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Video.module.css"
// ...
import { type IVideoBlockData } from "../data"
import { createVideoProgressBar } from "./progress"
import { VideoButtonControls, type IVideoButtonControlsProps, VideoControlState } from "./VideoButtonControls"
import { FullScreenButton } from "./FullScreenButton"

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

export interface IVideoProps extends IVideoBlockData {
  /**Whenever the video is loaded or not */
  onVideoLoaded$?: () => void
  /**Whenever the video should be displayed on fullscreen mode or not.
   * 
   * Set this to `true` will:
   * - Hide the fullscreen button
   * 
   * @default false
   */
  fullScreenMode$?: boolean
}

export function Video(props: ParentProps<IVideoProps>) {
  let thisVideoRef!: Ref<"video">
  let everythingRef!: Ref<"div">

  const { 
    ProgressBar$, 
    updateProgressBar$, 
    setTotalDuration$ 
  } = createVideoProgressBar({
    onProgressBarChanged$(thisVideoCurrentDuration) {
      thisVideoRef.currentTime = thisVideoCurrentDuration
    }
  })

  const updateVideoProgressBar = () => {
    updateProgressBar$(thisVideoRef.currentTime)
  }
  
  const onVideoLoaded = () => {
    setTotalDuration$(thisVideoRef.duration)
    props.onVideoLoaded$?.()
  }

  const controlThisVideo: IVideoButtonControlsProps["onClick$"] = (state) => {
    switch (state) {
      case VideoControlState.playing:
        thisVideoRef.play()
      break

      case VideoControlState.pausing:
        thisVideoRef.pause()
      break
    }
  }

  const videoFullscreenDialog = createLazyLoadedDialog(
    () => import("../dialog/VideoFullscreenDialog"),
    () => {
      const [, videoData] = splitProps(props, ["fullScreenMode$"])
      return {
        videoData$: videoData
      }
    }
  )

  const goFullScreen = () => {
    controlThisVideo(VideoControlState.pausing)
    videoFullscreenDialog.show$()
  }

  return (
    <FlexCenter
      class={mergeClassname(__style.video)}
      ref={everythingRef}
    >
      <video
        src={props.videoName}
        ref={thisVideoRef}
        onTimeUpdate={() => updateVideoProgressBar()}
        onLoadedData={onVideoLoaded}
        preload="metadata"
      />

      {props.children}

      <FlexCenterY class={mergeClassname(
        stylex.attrs(style.progressBar),
        props.fullScreenMode$ ? __style.controlsInFullscreen : __style.controls
      )}>
        <VideoButtonControls onClick$={controlThisVideo}>
          <ProgressBar$ />
          <Show when={!props.fullScreenMode$}>
            <FullScreenButton onClick={goFullScreen} />
          </Show>
        </VideoButtonControls>
      </FlexCenterY>

      <videoFullscreenDialog.Modal$ />
    </FlexCenter>
  )
}