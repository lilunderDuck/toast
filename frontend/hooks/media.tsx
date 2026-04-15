import { createEffect, createSignal, Show } from "solid-js"

type MediaPlayerProps = Omit<
  HTMLAttributes<"audio" | "video">,
  "onProgress" | "onPlaying" | "onCanPlayThrough" | "onEnded" | "onTimeUpdate" |
  "ref" | "preload"
>

interface IMediaPlayerListener {
  onEnded$(): void
}

export function createMediaPlayer(type: "audio" | "video", listener?: Partial<IMediaPlayerListener>) {
  const [mediaState, setMediaState] = createSignal(MediaState.LOADING)
  const [duration, setDuration] = createSignal(0)
  const [buffered, setBuffered] = createSignal(0)
  const [currentProgress, setCurrentProgress] = createSignal(0)

  if (isDevMode) {
    const stateMapping: Record<MediaState, string> = {
      [MediaState.COMPLETED]: 'MediaState.COMPLETED',
      [MediaState.PLAYING]: 'MediaState.PLAYING',
      [MediaState.FINISHED_LOADING]: 'MediaState.FINISHED_LOADING',
      [MediaState.PAUSED]: 'MediaState.PAUSED',
      [MediaState.ERROR]: 'MediaState.ERROR',
      [MediaState.LOADING]: 'MediaState.LOADING',
    }

    createEffect(() => {
      console.debug("[media player] current media state changed to:", stateMapping[mediaState()])
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
      console.debug("[media player] duration:", mediaRef.duration)
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
    console.log("[media player] Paused", mediaRef.src)
  }

  const changeSource = (src: string) => {
    mediaRef.src = src
    setCurrentProgress(0)
    console.log("[media player] New audio loaded:", src)
  }

  const play = () => {
    mediaRef.currentTime = currentProgress()
    // weird hack to forcefully play the audio.
    // this is a workaround for this error when calling play() method:
    //    the play() request was interrupted by a new load request
    const intervalId = setInterval(async () => {
      try {
        await mediaRef.play()
        clearInterval(intervalId)
      } catch { 
        console.warn("[media player] media haven't finished loading, retrying...")
      }
    }, 100)
    console.log("[media player] Playing", mediaRef.src)
  }

  const changeVolume = (volume: number) => {
    console.assert(volume >= 0 && volume <= 100, "[media player] volume must not be negative and must not over 100. Your current volume is: " + volume)
    mediaRef.volume = volume
    console.log("[media player] Media volume changed to:", volume)
  }

  const changeCurrentTime = (time: number) => {
    setCurrentProgress(time)
    mediaRef.currentTime = time
    console.log("[media player] current time changed to", time, "seconds")
  }

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
    Player$: (props: MediaPlayerProps) => (
      <Show when={type === "audio"} fallback={
        <video ref={mediaRef} {...props} {...mediaProps} />
      }>
        <audio ref={mediaRef} {...props} {...mediaProps} />
      </Show>
    )
  }
}

export type MediaPlayer = ReturnType<typeof createMediaPlayer>