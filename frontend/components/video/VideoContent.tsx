import { createEffect, For, Show } from "solid-js"
import { BiSolidError } from "solid-icons/bi"
import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"
// ...
import { css } from "molcss"
// ...
import { SpinningCube } from "../loader"
import { PlaceholderView } from "../short-hands"
import { useVideoContext, type IVideoProps } from "./Video"
import VideoControls from "./VideoControls"

const video__root = css`
  width: 100%;
  height: auto;
  position: relative;
`

// Workaround for GPU hardware acceleration / compositing bug, very weird...
// 
// Whenever I don't hover the VideoControls, the video background just changes to black...?
// Hover the VideoControls/elements inside dev-tools just changes back to the
// original state, what?
const video__thisVideoElement = css`
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
  background-color: var(--crust);
`

const video__layer = css`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const video__layerErrorMessage = css`
  flex-direction: column;
`

export function VideoContent(props: IVideoProps) {
  const { videoPlayer$, setIsInPictureInPicture$ } = useVideoContext()
  const { Player$, state$, errorMessage$, changeSource$ } = videoPlayer$

  createEffect(() => {
    changeSource$(props.src$)
    DEBUG_INFO_LABEL("video", "source changed")
  })

  if (TOAST_DEBUG) {
    if (props.subtitles$) {
      DEBUG_ASSERT(props.subtitles$ && props.subtitleUrlRoot$, "you're included the props.subtitles$ but you haven't specify the props.subtitleUrlRoot$")
    }
  }

  return (
    <div class={video__root}>
      <Player$
        crossorigin="anonymous"
        src={props.src$}
        class={video__thisVideoElement}
        onEnterPictureInPicture={() => setIsInPictureInPicture$(true)}
        onLeavePictureInPicture={() => setIsInPictureInPicture$(false)}
      >
        <Show when={props.subtitles$}>
          <For each={props.subtitles$}>
            {(it, currentIndex) => (
              <track
                kind="subtitles"
                srclang={it.lang}
                src={`${props.subtitleUrlRoot$}/${it.fileName}`}
                default={currentIndex() === 0}
              />
            )}
          </For>
        </Show>
      </Player$>

      <Show when={![MediaState.LOADING, MediaState.ERROR].includes(state$())}>
        <VideoControls />
      </Show>

      <Show when={state$() == MediaState.LOADING}>
        <div class={video__layer}>
          <SpinningCube cubeSize$={40} />
        </div>
      </Show>

      <Show when={state$() == MediaState.ERROR}>
        <PlaceholderView 
          icons$={<BiSolidError size={60} />}
          class={`${video__layer} ${video__layerErrorMessage}`}
        >
          Failed to load video. {errorMessage$()}. <a onClick={() => changeSource$(props.src$)}>Reload?</a>
        </PlaceholderView>
      </Show>
    </div>
  )
}