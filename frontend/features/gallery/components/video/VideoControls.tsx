import { BsPauseFill, BsPlayFill } from "solid-icons/bs"
import { Show } from "solid-js"
import { DEBUG_INFO_LABEL } from "macro-def"
import { RiMediaPictureInPictureFill } from "solid-icons/ri"
// ...
import { css } from "molcss"
import "~/styles/shorthand.css"
// ...
import { formatSecondsToMMSS, type EventHandler } from "~/utils"
// ...
import { useVideoContext } from "./Video"
import { Button, MediaProgressSlider, RangeInput, Spacer, Tooltip } from "~/components"
import { FaSolidVolumeHigh, FaSolidVolumeMute } from "solid-icons/fa"

const videoControls = css`
  width: 100%;
  padding-inline: 25px;
  padding-top: 6rem;
  padding-bottom: 15px;
  position: absolute;
  bottom: 0;
  user-select: none;
  transition: .5s cubic-bezier(.07,.98,.12,.98);
`

const videoControls__showOnHover = css`
  transform: translateY(100px);
  &:hover {
    transform: translateY(0);
  }
`

const videoControls__button = css`
  background-color: var(--crust);
  &:hover {
    background-color: var(--surface0);
  }
`

const videoControls__time = css`
  text-align: center;
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 6px;
  background-color: var(--crust);
`

const videoControls__controlsWrap = css`
  display: flex;
  align-items: center;
  gap: 5px;
`

const videoControls__progressSliderWrap = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
`

const videoControls__volumeWrap = css`
  display: flex;
  align-items: center;
  gap: 10px;
  & .videoControls__volumeSlider {
    display: none;
  }

  &:hover .videoControls__volumeSlider {
    display: block;
  }
`

export default function VideoControls() {
  const { videoPlayer$, isInPictureInPicture$ } = useVideoContext()
  const { state$, play$, pause$, currentProgress$, totalDuration$, ref$, volume$, setVolume$ } = videoPlayer$

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

  const updateVolume: EventHandler<"input", "onInput"> = (inputEvent) => {
    const newVolume = parseFloat(inputEvent.currentTarget.value)
    setVolume$(newVolume)
  }

  const toggleVolume = () => setVolume$(volume$() === 0 ? 100 : 0)

  return (
    <div class={`${videoControls} ${shouldControlsAlwaysShow() ? '' : videoControls__showOnHover}`}>
      <div class={videoControls__progressSliderWrap}>
        <div class={videoControls__time}>
          {formatSecondsToMMSS(currentProgress$())}
        </div>
        <MediaProgressSlider player$={videoPlayer$} />
        <div class={videoControls__time}>
          {formatSecondsToMMSS(totalDuration$())}
        </div>
      </div>
      <div class={videoControls__controlsWrap}>
        <Button 
          size$={ButtonSize.ICON_LARGE}
          variant$={ButtonVariant.UNSET}
          onClick={togglePlayVideo}
          class={videoControls__button}
        >
          <Show when={state$() === MediaState.PLAYING} fallback={
            <BsPauseFill size={25} />
          }>
            <BsPlayFill size={25} />
          </Show>
        </Button>
        <div class={`${videoControls__volumeWrap}`}>
          <Button 
            size$={ButtonSize.ICON_LARGE}
            variant$={ButtonVariant.UNSET}
            class={videoControls__button}
            onClick={toggleVolume}
          >
            <Show when={volume$() !== 0} fallback={
              <FaSolidVolumeMute size={25} />
            }>
              <FaSolidVolumeHigh size={25} />
            </Show>
          </Button>
          <RangeInput 
            min={0}
            max={100}
            step={1}
            value={volume$()}
            onInput={updateVolume}
            class="videoControls__volumeSlider"
          />
        </div>
        <Spacer />
        <Tooltip label$={`${isInPictureInPicture$() ? "Leave" : "Open"} picture-in-picture`}>
          <Button
            size$={ButtonSize.ICON_LARGE} 
            variant$={ButtonVariant.UNSET}
            class={videoControls__button}
            onClick={openPictureInPicture}
          >
            <RiMediaPictureInPictureFill size={25} />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}