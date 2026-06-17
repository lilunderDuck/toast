import { createEffect, createSignal, onCleanup } from "solid-js"
// ...
import { type HTMLAttributes, type Ref } from "~/utils" // documentation only
import { MediaProgressSlider } from "~/components" // documentation only
import { DEBUG_ASSERT, DEBUG_ERR_LABEL, DEBUG_INFO_LABEL } from "macro-def"

type MediaPlayerProps = Omit<
  HTMLAttributes<"audio" | "video">,
  "onProgress" | "onPlaying" | "onCanPlayThrough" | "onEnded" | "onTimeUpdate" |
  "ref" | "preload"
>

interface IMediaPlayerListener {
  onEnded$(): void
}

// oh god, how many time do I have to look at my mess here...
// I think I'm going insane

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

  // flag to make sure that the media player does not update
  // if we call changeCurrentTime(newTime, false /* don't update */)
  //
  // this is because if we have a slider and you try to drag it, the
  // current time will be flickering between the updated time and the current progress.
  let shouldUpdateCurrentTime = true

  if (TOAST_DEBUG) {
    const stateMapping: Record<MediaState, string> = {
      [MediaState.COMPLETED]: 'MediaState.COMPLETED',
      [MediaState.PLAYING]: 'MediaState.PLAYING',
      [MediaState.PAUSED]: 'MediaState.PAUSED',
      [MediaState.ERROR]: 'MediaState.ERROR',
      [MediaState.LOADING]: 'MediaState.LOADING',
    }

    createEffect(() => {
      DEBUG_INFO_LABEL("media player", "state changed to:", stateMapping[mediaState()])
    })
  }

  let mediaRef!: Ref<"audio" | "video">
  let detailErrorMessage = ""
  const mediaProps: HTMLAttributes<"audio" | "video"> = {
    preload: "metadata",
    onLoadedData() {
      setMediaState(MediaState.LOADING)
    },
    onPlaying() {
      setMediaState(MediaState.PLAYING)
    },
    onCanPlayThrough() {
      DEBUG_ASSERT(mediaRef, "accessing mediaRef too early!!")

      if (mediaRef.paused) {
        setMediaState(MediaState.PAUSED)
      }

      setDuration(mediaRef.duration)
      DEBUG_INFO_LABEL("media player", "total duraction updated, duration:", mediaRef.duration, "seconds")
    },
    onEnded() {
      listener?.onEnded$?.()
      setMediaState(MediaState.COMPLETED)
    },
    onError() {
      DEBUG_ASSERT(mediaRef, "accessing mediaRef too early!!")
      DEBUG_ERR_LABEL("media player", "ERROR DURING MOD, I mean... VIDEO... LOADING\n", "networkState:", mediaRef.networkState)

      switch (mediaRef.networkState) {
        case 3: // MEDIA_ERR_DECODE
          detailErrorMessage = `MEDIA_ERR_DECODE: The audio/video is corrupted or in a unsupported format`
        break;
      }
      
      setMediaState(MediaState.ERROR)
    },
    onTimeUpdate() {
      const currentMediaTime = mediaRef.currentTime

      if (shouldUpdateCurrentTime) {
        setCurrentProgress(currentMediaTime)
      } else {
        DEBUG_INFO_LABEL("media player", "current time won't be updated, ")
      }

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
    DEBUG_ASSERT(mediaRef, "accessing mediaRef too early!!")

    mediaRef.pause()
    setMediaState(MediaState.PAUSED)
    DEBUG_INFO_LABEL("media player", "paused", mediaRef.src)
  }

  const changeSource = (src: string) => {
    DEBUG_ASSERT(mediaRef, "accessing mediaRef too early!!")

    setMediaState(MediaState.LOADING)
    mediaRef.src = src
    setCurrentProgress(0)

    DEBUG_INFO_LABEL("media player", "source changed:", src)
  }

  const play = () => {
    DEBUG_ASSERT(mediaRef, "accessing mediaRef too early!!")

    const isEnded = currentProgress() === duration()
    if (isEnded) {
      DEBUG_INFO_LABEL("media player", "detected that the media has finished playing, resetting current progress back to 0")
      setCurrentProgress(0)
    }
    mediaRef.currentTime = currentProgress()

    if (mediaRef.readyState >= 3) {
      tryPlayingThis()
      return
    }
  
    DEBUG_INFO_LABEL("media player", "media not ready!! waiting for 'canplay' event...")
    const handleCanPlay = async () => {
      DEBUG_INFO_LABEL("media player", "GOT 'canplay' signal, attempting to play now")
      mediaRef.removeEventListener("canplay", handleCanPlay)
      await tryPlayingThis()
    }
    
    mediaRef.addEventListener("canplay", handleCanPlay)
  }

  const tryPlayingThis = async () => {
    try {
      await mediaRef.play()
      DEBUG_INFO_LABEL("media player", "playing", mediaRef.src)
    } catch (error: any) {
      if (error.name === "AbortError") {
        DEBUG_INFO_LABEL("media player", "play request safely aborted by a newer load request.")
        return
      }

      DEBUG_ERR_LABEL("media player", error)
    }
  }

  const changeVolume = (volume: number) => {
    DEBUG_ASSERT(!isNaN(volume), "volume is not a number")
    DEBUG_ASSERT(volume >= 0 && volume <= 100, "volume must not be negative and must not over 100. Your current volume is: " + volume)

    mediaRef.volume = volume / 100
    setCurentVolume(volume)

    DEBUG_INFO_LABEL("media player", "volume changed to:", volume)
  }

  const changeCurrentTime = (time: number, update = true) => {
    setCurrentProgress(time)
    shouldUpdateCurrentTime = update
    if (update) {
      mediaRef.currentTime = time
      DEBUG_INFO_LABEL("media player", "current time changed to", time, "seconds")
    }
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
    errorMessage$: () => detailErrorMessage,
    Player$: (props: MediaPlayerProps) => (
      type == "audio" ?
        // @ts-ignore
        <audio ref={mediaRef} {...props} {...mediaProps} /> :
        // @ts-ignore
        <video ref={mediaRef} {...props} {...mediaProps} />
    )
  }
}

export type MediaPlayer = ReturnType<typeof createMediaPlayer>