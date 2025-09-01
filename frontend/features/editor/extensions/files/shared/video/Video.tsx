import { createSignal, Match, type ParentProps, Show, Switch } from "solid-js"
import { BsCameraVideoOffFill } from "solid-icons/bs"
// ...
import { SpinningCube } from "~/components"
import { mergeClassname, sleep } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Video.module.css"
// ...
import { getThisVideoSubtitlePath, reloadVideo } from "./utils"

const style = stylex.create({
  everything: {
    position: "relative",
    userSelect: "none",
  },
  layer: {
    position: "absolute",
    minHeight: "20rem"
  },
  loadingVideoLayer: {
    backgroundColor: "var(--gray3)",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexFlow: "column"
  },
  video: {
    width: "100%",
    minHeight: "20rem",
    outline: "none"
  }
})

export interface IVideoProps {
  autoplay$?: boolean
  src$: string
}

export function Video(props: ParentProps<IVideoProps>) {
  let videoRef!: Ref<"video">

  const [videoStatus, setVideoStatus] = createSignal<VideoLoadingStatus>(VideoLoadingStatus.START_LOADING)
  const [subtitlePath, setSubtitlePath] = createSignal<string>()
  const thisVideoIsLoaded: EventHandler<"video", "onLoadedData"> = async () => {
    await tryGettingThisVideoSubtitle()
    setVideoStatus(VideoLoadingStatus.FINISH_LOADING)
  }

  const tryGettingThisVideoSubtitle = async () => {
    const subtitlePath = await getThisVideoSubtitlePath(props.src$)
    if (subtitlePath) {
      setSubtitlePath(subtitlePath)
    }
  }

  const loadStart = () => {
    resetVideo()
  }
  
  const resetVideo = () => {
    if (videoStatus() === VideoLoadingStatus.ERROR) {
      reloadVideo(videoRef)
    }
    setVideoStatus(VideoLoadingStatus.START_LOADING)
  }

  return (
    <div
      class={mergeClassname(
        stylex.attrs(style.everything),
        __style.video,
      )}
    >
      <video
        {...stylex.attrs(style.video)}
        controls
        autoplay={props.autoplay$}
        src={props.src$}
        onLoadedData={thisVideoIsLoaded}
        onLoad={loadStart}
        onError={async() => {
          await sleep(500)
          setVideoStatus(VideoLoadingStatus.ERROR)
        }}
        ref={videoRef}
        // Actually, it still work fine without this attribute, 
        // until you start thinking about subtitle support and stuff.
        // 
        // No thanks, CORS.
        crossorigin="anonymous"
        // Extremely fast video loading pushed to maximum
        preload="metadata"
      >
        <Show when={subtitlePath()}>
          <track
            default
            kind="captions"
            srclang="en"
            src={subtitlePath()}
          />
        </Show>
      </video>
      <Show when={videoStatus() !== VideoLoadingStatus.FINISH_LOADING}>
        <div {...stylex.attrs(style.loadingVideoLayer)} id={__style.layer}>
          <Switch>
            <Match when={videoStatus() === VideoLoadingStatus.START_LOADING}>
              <SpinningCube cubeSize$={30} />
            </Match>

            <Match when={videoStatus() === VideoLoadingStatus.ERROR}>
              <BsCameraVideoOffFill size={30} />
              Cannot load this video, please check the video file path. <a onClick={resetVideo}>Reload?</a>
            </Match>
          </Switch>
        </div>
      </Show>
    </div>
  )
}