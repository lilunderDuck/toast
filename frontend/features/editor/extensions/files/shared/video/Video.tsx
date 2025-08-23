import { createSignal, Match, type ParentProps, Show, Switch } from "solid-js"
import { BsCameraVideoOffFill } from "solid-icons/bs"
// ...
import { SpinningCube } from "~/components"
import { mergeClassname, sleep } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Video.module.css"
// ...
import type { VideoAttribute, VideoPlayerStatus } from "./data"
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
    minHeight: "20rem"
  }
})

export interface IVideoProps extends VideoAttribute {
  autoplay$?: boolean
}

export function Video(props: ParentProps<IVideoProps>) {
  let videoRef!: Ref<"video">

  const [videoStatus, setVideoStatus] = createSignal<VideoPlayerStatus>('video__startLoading$')
  const [subtitlePath, setSubtitlePath] = createSignal<string>()
  const thisVideoIsLoaded: EventHandler<"video", "onLoadedData"> = async () => {
    await tryGettingThisVideoSubtitle()
    setVideoStatus("video__finishLoading$")
  }

  const tryGettingThisVideoSubtitle = async () => {
    const subtitlePath = await getThisVideoSubtitlePath(props.path)
    if (subtitlePath) {
      setSubtitlePath(subtitlePath)
    }
  }

  const loadStart = () => {
    resetVideo()
  }
  
  const resetVideo = () => {
    if (videoStatus() === "video__error$") {
      reloadVideo(videoRef)
    }
    setVideoStatus("video__startLoading$")
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
        src={props.path}
        onLoadedData={thisVideoIsLoaded}
        onLoad={loadStart}
        onError={async() => {
          await sleep(500)
          setVideoStatus("video__error$")
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
      <Show when={videoStatus() !== "video__finishLoading$"}>
        <div {...stylex.attrs(style.loadingVideoLayer)} id={__style.layer}>
          <Switch>
            <Match when={videoStatus() === "video__startLoading$"}>
              <SpinningCube cubeSize$={30} />
            </Match>

            <Match when={videoStatus() === "video__error$"}>
              <BsCameraVideoOffFill size={30} />
              Cannot load this video, please check the video file path. <a onClick={resetVideo}>Reload?</a>
            </Match>
          </Switch>
        </div>
      </Show>
    </div>
  )
}