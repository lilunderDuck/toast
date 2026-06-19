import { css } from "molcss"
import { BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { useVideoContext } from "./Video"
import { Show } from "solid-js"
import { MediaProgressSlider } from "../short-hands"
import { formatSecondsToMMSS } from "~/utils"
import { DEBUG_INFO_LABEL } from "macro-def"

const videoControls = css`
  width: 100%;
  padding-inline: 20px;
  padding-block: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: 0;
  user-select: none;
`

const videoControls__showOnHover = css`
  opacity: 0;
  transition: 0.15s ease-out;
  will-change: opacity;
  &:hover {
    opacity: 1;
  }
`

const videoControls__button = css`
  width: 30px;
  height: 30px;
  padding: 0;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: var(--surface0);
  }
`

const videoControls__time = css`
  text-align: center;
  padding-inline: 9px;
  padding-block: 3px;
  border-radius: 6px;
  background-color: var(--mantle);
`

export default function VideoControls() {
  const { videoPlayer$ } = useVideoContext()
  const { state$, play$, pause$, currentProgress$, totalDuration$ } = videoPlayer$

  const togglePlayVideo = () => {
    if (state$() === MediaState.PLAYING) {
      pause$()
    } else {
      play$()
    }

    DEBUG_INFO_LABEL("video", "toggle playing")
  }

  const shouldControlsAlwaysShow = () => state$() === MediaState.PAUSED

  return (
    <div class={`${videoControls} ${shouldControlsAlwaysShow() ? '' : videoControls__showOnHover}`}>
      <button 
        onClick={togglePlayVideo}
        class={videoControls__button}
      >
        <Show when={state$() === MediaState.PLAYING} fallback={
          <BsPauseFill />
        }>
          <BsPlayFill />
        </Show>
      </button>
      <div class={videoControls__time}>
        {formatSecondsToMMSS(currentProgress$())}
      </div>
      <MediaProgressSlider player$={videoPlayer$} />
      <div class={videoControls__time}>
        {formatSecondsToMMSS(totalDuration$())}
      </div>
    </div>
  )
}