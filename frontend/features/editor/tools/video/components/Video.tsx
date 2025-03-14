import { lazy, Show, type VoidComponent, splitProps, type ParentProps } from "solid-js"
// ...
import { mergeClassname } from "~/utils"
import { FlexCenterY, FlexCenter, createLazyLoadedDialog } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Video.module.css"
// ...
import type { IVideoBlockData } from "../data"
import { VideoControls, type IVideoControlsProps, VideoControlState } from "./VideoControls"
import { createVideoProgressBar } from "./progress"
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

export interface IVideoProps extends IVideoBlockData {
  /**Whenever the video is loaded or not */
  onVideoLoaded$?: () => void
  /**Whenever the video should be displayed on fullscreen or not.
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
    onProgressBarChanged$(currentDuration) {
      thisVideoRef.currentTime = currentDuration
    }
  })

  const updateVideoProgressBar: EventHandler<"video", "onTimeUpdate"> = () => {
    updateProgressBar$(thisVideoRef.currentTime)
  }
  
  const onVideoLoaded: EventHandler<"video", "onLoadedData"> = () => {
    setTotalDuration$(thisVideoRef.duration)
    props.onVideoLoaded$?.()
  }
  
  const controlThisVideo: IVideoControlsProps["onClickingSomething$"] = (state) => {
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
    lazy(() => import("./dialog/VideoFullscreenDialog")),
    () => {
      const [, videoData] = splitProps(props, ["fullScreenMode$"])
      return {
        videoData$: videoData
      }
    }
  )

  return (
    <FlexCenter
      class={mergeClassname(
        __style.video
      )}
      ref={everythingRef}
    >
      <video
        src={props.videoUrl}
        ref={thisVideoRef}
        onTimeUpdate={updateVideoProgressBar}
        onLoadedData={onVideoLoaded}
        preload="metadata"
      />

      {props.children}

      <FlexCenterY class={mergeClassname(
        stylex.attrs(style.progressBar),
        props.fullScreenMode$ ? __style.controlsInFullscreen : __style.controls
      )}>
        <VideoControls onClickingSomething$={controlThisVideo}>
          <ProgressBar$ />
          <Show when={!props.fullScreenMode$}>
            <FullScreenButton onClick={videoFullscreenDialog.show$} />
          </Show>
        </VideoControls>
      </FlexCenterY>

      <videoFullscreenDialog.Modal$ />
    </FlexCenter>
  )
}