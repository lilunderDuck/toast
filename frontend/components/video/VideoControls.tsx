import { BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { Show } from "solid-js"
import { DEBUG_INFO_LABEL } from "macro-def"
import { RiMediaPictureInPictureFill } from "solid-icons/ri"
// ...
import { css } from "molcss"
// ...
import { formatSecondsToMMSS } from "~/utils"
// ...
import { useVideoContext } from "./Video"
import { MediaProgressSlider } from "../short-hands"
import { Tooltip } from "../ui"

const videoControls = css`
  width: 100%;
  padding-inline: 20px;
  padding-top: 5px;
  padding-bottom: 10px;
  position: absolute;
  bottom: 0;
  user-select: none;
`

const videoControls__showOnHover = css`
  opacity: 0;
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

const videoControls__controlsWrapper = css`
  display: flex;
  align-items: center;
  gap: 5px;
`

const videoControls__progressSlider = css`
  margin-bottom: 5px;
`

export default function VideoControls() {
  const { videoPlayer$, isInPictureInPicture$ } = useVideoContext()
  const { state$, play$, pause$, currentProgress$, totalDuration$, ref$ } = videoPlayer$

  const togglePlayVideo = () => {
    if (state$() === MediaState.PLAYING) {
      pause$()
    } else {
      play$()
    }

    DEBUG_INFO_LABEL("video", "toggle playing")
  }

  const shouldControlsAlwaysShow = () => state$() === MediaState.PAUSED

  const openPictureInPicture = () => {
    ref$()!.requestPictureInPicture()
    DEBUG_INFO_LABEL("video", "entering picture in picture...")
  }

  return (
    <div class={`${videoControls} ${shouldControlsAlwaysShow() ? '' : videoControls__showOnHover}`}>
      <MediaProgressSlider 
        player$={videoPlayer$} 
        class$={videoControls__progressSlider}
      />
      <div class={videoControls__controlsWrapper}>
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
          {formatSecondsToMMSS(currentProgress$())} / {formatSecondsToMMSS(totalDuration$())}
        </div>
        <Tooltip label$={`${isInPictureInPicture$() ? "Leave" : "Open"} picture-in-picture`}>
          <button 
            class={videoControls__button}
            onClick={openPictureInPicture}
          >
            <RiMediaPictureInPictureFill />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}