import { createEffect, createSignal, onCleanup } from "solid-js"
// ...
import { type HTMLAttributes, type Ref } from "~/utils" // documentation only
import { MediaProgressSlider } from "~/components" // documentation only
import { DEBUG_ASSERT, DEBUG_ERR_LABEL, DEBUG_INFO_LABEL, DEBUG_WARN_LABEL } from "macro-def"

type MediaPlayerProps<T extends "audio" | "video"> = Omit<
  HTMLAttributes<T>,
  "onProgress" | "onPlaying" | "onCanPlayThrough" | "onEnded" | "onTimeUpdate" |
  "ref" | "preload"
>

interface IMediaPlayerListener {
  onEnded$(): void
}

// oh god, how many time do I have to look at my mess here...
// I think I'm going insane

const ERROR_MESSAGE_MAPPING: Record<MediaNetworkState, string> = {
  [MediaNetworkState.NETWORK_EMPTY]: "NETWORK_EMPTY: there's no data yet.",
  [MediaNetworkState.NETWORK_IDLE]: "NETWORK_IDLE: the audio/video is currently not using the network.",
  [MediaNetworkState.NETWORK_LOADING]: "NETWORK_LOADING: current audio/video is still loading.",
  [MediaNetworkState.NETWORK_NO_SOURCE]: "NETWORK_NO_SOURCE: The audio/video is corrupted or in a unsupported format, or the src is not found.",
}

/**A hook for that abstracts raw HTML5 `<audio>` and `<video>` elements and handles 
 * media event states and a lot of black magic.
 * @param type      the type of media element, can be `"audio"` or `"video"`
 * @param listener  optional event listener to listen to some events, see {@link IMediaPlayerListener}
 * @see {@link MediaProgressSlider} - helper component to see the current progress of 
 * the media player and handle seeking.
 * @returns 
 */
export function createMediaPlayer<T extends "audio" | "video">(type: T, listener?: Partial<IMediaPlayerListener>) {
  const [mediaState, setMediaState] = createSignal(MediaState.LOADING)
  const [duration, setDuration] = createSignal(0)
  const [buffered, setBuffered] = createSignal(0)
  const [currentProgress, setCurrentProgress] = createSignal(0)
  const [currentVolume, setCurentVolume] = createSignal(100)
  const [isMuted, setIsMuted] = createSignal(false)

  DEBUG_ASSERT(type == "audio" || type == "video", "invalid media player type:", type)

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

  let mediaRef!: Ref<T>
  let detailErrorMessage = ""
  const mediaProps: HTMLAttributes<T> = {
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
      DEBUG_ASSERT(mediaRef, "NullPointerException: accessing mediaRef too early!!")
      DEBUG_ERR_LABEL("media player", `ERROR DURING MOD, I mean... ${type}... LOADING\n`, "networkState:", mediaRef.networkState)

      detailErrorMessage = ERROR_MESSAGE_MAPPING[mediaRef.networkState as MediaNetworkState]
      DEBUG_ASSERT(detailErrorMessage, "could not get the detail error message for networkState", mediaRef.networkState, ", case is not being handled or invalid.")

      setMediaState(MediaState.ERROR)
    },
    onTimeUpdate() {
      const currentMediaTime = mediaRef.currentTime

      if (shouldUpdateCurrentTime) {
        setCurrentProgress(currentMediaTime)
      } else {
        DEBUG_INFO_LABEL("media player", "current time won't be updated")
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
        DEBUG_WARN_LABEL("media player", "play request safely aborted by a newer load request.")
        return
      }

      DEBUG_ERR_LABEL("media player", error)
    }
  }

  const changeVolume = (volume: number) => {
    DEBUG_ASSERT(!isNaN(volume), "volume is not a number")
    DEBUG_ASSERT(volume >= 0 && volume <= 100, "volume must not be negative and must not over 100. Your current volume is:", volume)

    mediaRef.volume = volume / 100
    setCurentVolume(volume)

    DEBUG_INFO_LABEL("media player", "volume changed to:", volume)
  }

  const changeCurrentTime = (time: number, update = true) => {
    if (time < 0) {
      DEBUG_WARN_LABEL("media player", "provided a negative time", time, "seconds, falling back to", 0, "second.")
      time = 0
    }

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
    /**The current state of the media player. All possible state can be:
     * ```
     * MediaState.LOADING
     * MediaState.PLAYING
     * MediaState.PAUSED
     * MediaState.ERROR
     * MediaState.COMPLETED
     * ```
     */
    state$: mediaState,
    /**The total length of the current media file in seconds. */
    totalDuration$: duration,
    /**The buffered (downloaded) **in percentage** of the media file, from `0` to `100`. */
    bufferedProgress$: buffered,
    /**The current playback timestamp of the media file in seconds. */
    currentProgress$: currentProgress,
    /**Changes the current playback timestamp.
     * @param time    the new timestamp in seconds.
     * @param update  set to `false` during slider dragging to temporarily prevent updating current media time.
     */
    changeCurrentTime$: changeCurrentTime,
    /**Pauses the current media player */
    pause$: pause,
    /**Plays/Resumes media playback */
    play$: play,
    /**Sets the media volume.
     * @param volume A value from `0` (muted) to `100` (full volume).
     */
    setVolume$: changeVolume,
    /**Switches the media player source URL and resets current progress.
     * @param src the URL of the new audio or video file.
     */
    changeSource$: changeSource,
    /**Gets the direct underlying HTML5 `<audio>` or `<video>` element reference. */
    ref$: () => mediaRef,
    /**Gets the current volume level. */
    volume$: currentVolume,
    /**Reactive boolean indicating whether the player is currently muted. */
    isMuted$: isMuted,
    /**Toggles the media player to be muted. */
    toggleMute$: toggleMute,
    /**Gets the detailed error message if `state$` enters `MediaState.ERROR` state.*/
    errorMessage$: () => detailErrorMessage,
    /**The SolidJS JSX Component wrapper. Automatically handles DOM references and binding event listeners.
     * @example
     * ```tsx
     * const player = createMediaPlayer("video")
     * // ... do something with the player ...
     * 
     * <player.Player$ src="video.mp4" class="my-video-style" />
     * ```
     */
    Player$: (props: MediaPlayerProps<T>) => (
      type == "audio" ?
        // @ts-ignore
        <audio ref={mediaRef} {...props} {...mediaProps} /> :
        // @ts-ignore
        <video ref={mediaRef} {...props} {...mediaProps} />
    )
  }
}

export type MediaPlayer<T extends "audio" | "video"> = ReturnType<typeof createMediaPlayer<T>>