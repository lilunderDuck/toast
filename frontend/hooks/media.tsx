import { createEffect, createSignal, Show } from "solid-js"

export function createMediaPlayer(type: "audio" | "video") {
  const [mediaState, setMediaState] = createSignal(MediaState.LOADING)
  const [duration, setDuration] = createSignal(0)
  const [buffered, setBuffered] = createSignal(0)
  const [currentProgress, setCurrentProgress] = createSignal(0)

  createEffect(() => {
    console.log("Current media state changed to:", mediaState())
  })

  let mediaRef!: Ref<"audio" | "video">
  const mediaProps: HTMLAttributes<"audio" | "video"> = {
    preload: "metadata",
    ref: mediaRef,
    onProgress() {
      setMediaState(MediaState.LOADING)
    },
    onPlaying() {
      setMediaState(MediaState.PLAYING)
    },
    onCanPlayThrough() {
      setMediaState(MediaState.FINISHED_LOADING)
      setDuration(mediaRef.duration)
    },
    onEnded() {
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
  }

  const changeSource = (src: string) => {
    mediaRef.src = src
    mediaRef.load()
    console.log("New audio loaded:", src)
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
      } catch { }
    }, 10)
  }

  const changeVolume = (volume: number) => {
    console.assert(volume >= 0, "Media volume must not be negative.")
    console.assert(volume <= 100, "Media volume must over 100%.")
    mediaRef.volume = volume
  }

  const changeCurrentTime = (time: number) => {
    setCurrentProgress(time)
    mediaRef.currentTime = time
    console.log("Media changed to", time, "seconds")
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
    Player$: () => (
      <Show when={type === "audio"}>
        <audio ref={mediaRef} {...mediaProps} />
      </Show>
    )
  }
}

export type MediaPlayer = ReturnType<typeof createMediaPlayer>