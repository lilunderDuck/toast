import { createEffect, createSignal, onCleanup } from "solid-js"
// ...
import { getMediaCurrentPercentage, getMediaCurrentTimeByPercentage, type HTMLAttributes, type Ref } from "~/utils" // documentation only
import { MediaProgressSlider } from "~/components" // documentation only
import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"

type MediaPlayerProps = Omit<
  HTMLAttributes<"audio" | "video">,
  "onProgress" | "onPlaying" | "onCanPlayThrough" | "onEnded" | "onTimeUpdate" |
  "ref" | "preload"
>

interface IMediaPlayerListener {
  onEnded$(): void
}

/**
 * @param type 
 * @param listener
 * @see {@link MediaProgressSlider} - Helper component to handle seeking and stuff
 * @see {@link getMediaCurrentPercentage}
 * @see {@link getMediaCurrentTimeByPercentage}
 * @returns 
 */
export function createMediaPlayer(type: "audio" | "video", listener?: Partial<IMediaPlayerListener>) {
  const [mediaState, setMediaState] = createSignal(MediaState.LOADING)
  const [duration, setDuration] = createSignal(0)
  const [buffered, setBuffered] = createSignal(0)
  const [currentProgress, setCurrentProgress] = createSignal(0)
  const [currentVolume, setCurentVolume] = createSignal(100)
  const [isMuted, setIsMuted] = createSignal(false)

  if (TOAST_DEBUG) {
    const stateMapping: Record<MediaState, string> = {
      [MediaState.COMPLETED]: 'MediaState.COMPLETED',
      [MediaState.PLAYING]: 'MediaState.PLAYING',
      [MediaState.FINISHED_LOADING]: 'MediaState.FINISHED_LOADING',
      [MediaState.PAUSED]: 'MediaState.PAUSED',
      [MediaState.ERROR]: 'MediaState.ERROR',
      [MediaState.LOADING]: 'MediaState.LOADING',
    }

    createEffect(() => {
      DEBUG_INFO_LABEL("media player", "state changed to:", stateMapping[mediaState()])
    })
  }

  let mediaRef!: Ref<"audio" | "video">
  const mediaProps: HTMLAttributes<"audio" | "video"> = {
    ref: mediaRef,
    preload: "metadata",
    onLoadedData() {
      setMediaState(MediaState.LOADING)
    },
    onPlaying() {
      setMediaState(MediaState.PLAYING)
    },
    onCanPlayThrough() {
      setMediaState(MediaState.FINISHED_LOADING)
      setDuration(mediaRef.duration)
      DEBUG_INFO_LABEL("media player", "finished loading, duration:", mediaRef.duration, "seconds")
    },
    onEnded() {
      listener?.onEnded$?.()
      setMediaState(MediaState.COMPLETED)
    },
    onTimeUpdate() {
      const currentMediaTime = mediaRef.currentTime

      setCurrentProgress(currentMediaTime)

      const duration = mediaRef.duration
      const buffered = mediaRef.buffered
      if (duration <= 0) return

      for (let i = 0; i < buffered.length; i++) {
        if (buffered.start(buffered.length - 1 - i) < currentMediaTime) {
          const bufferedProgress = (mediaRef.buffered.end(mediaRef.buffered.length - 1 - i) * 100) / duration
          setBuffered(bufferedProgress)
          break
        }
      }
    }
  }

  const pause = () => {
    mediaRef.pause()
    setMediaState(MediaState.PAUSED)
    DEBUG_INFO_LABEL("media player", "paused", mediaRef.src)
  }

  const changeSource = (src: string) => {
    mediaRef.src = src
    setCurrentProgress(0)
    DEBUG_INFO_LABEL("media player", "source changed:", src)
  }

  const play = () => {
    const isEnded = currentProgress() === duration()
    if (isEnded) {
      setCurrentProgress(0)
    }
    mediaRef.currentTime = currentProgress()
    // weird hack to forcefully play the audio.
    // this is a workaround for this error when calling play() method:
    //    the play() request was interrupted by a new load request
    const intervalId = setInterval(async () => {
      try {
        await mediaRef.play()
        clearInterval(intervalId)
      } catch(error) { 
        console.warn(error)
      }
    }, 100)
    DEBUG_INFO_LABEL("media player", "Playing", mediaRef.src)
  }

  const changeVolume = (volume: number) => {
    DEBUG_ASSERT(volume >= 0 && volume <= 100, "volume must not be negative and must not over 100. Your current volume is: " + volume)
    DEBUG_ASSERT(!isNaN(volume), "volume is not a number")

    mediaRef.volume = volume / 100
    setCurentVolume(volume)
    DEBUG_INFO_LABEL("media player", "Media volume changed to:", volume)
  }

  const changeCurrentTime = (time: number) => {
    setCurrentProgress(time)
    mediaRef.currentTime = time
    DEBUG_INFO_LABEL("media player", "current time changed to", time, "seconds")
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
    mediaRef.muted = isMuted()
    DEBUG_INFO_LABEL("media player", "muted:", isMuted())
  }

  onCleanup(() => {
    DEBUG_INFO_LABEL("media player", "cleaning up...")
    // @ts-ignore
    mediaRef = null
  })

  return {
    state$: mediaState,
    totalDuration$: duration,
    bufferedProgress$: buffered,
    currentProgress$: currentProgress,
    changeCurrentTime$: changeCurrentTime,
    pause$: pause,
    play$: play,
    setVolume$: changeVolume,
    changeSource$: changeSource,
    ref$: () => mediaRef,
    volume$: currentVolume,
    isMuted$: isMuted,
    toggleMute$: toggleMute,
    Player$: (props: MediaPlayerProps) => (
      // @ts-ignore
      <video ref={mediaRef} {...props} {...mediaProps} />
    )
  }
}

export type MediaPlayer = ReturnType<typeof createMediaPlayer>