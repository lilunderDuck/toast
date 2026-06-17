import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"
import { onCleanup } from "solid-js"

/**This is a hook allowing you to 
 * manage media playback across running applications via system overlay.
 * 
 * The name `SMTC` is a shorthand for [`Windows System Media Transport Controls`](https://learn.microsoft.com/en-us/windows/apps/develop/media-playback/system-media-transport-controls)
 * 
 * However, it should works in any operation system (not sure what
 * it called in linux or macOS).
 */
export function createSMTCHandlers(options: {
  playHandler$: MediaSessionActionHandler
  pauseHandler$: MediaSessionActionHandler
  nextTrackHandler$: MediaSessionActionHandler
  previousTrackHandler$: MediaSessionActionHandler
}) {
  DEBUG_ASSERT('mediaSession' in navigator, "the current version of webview does not support MediaSession api.")

  DEBUG_INFO_LABEL("SMTC", "registered handlers")
  navigator.mediaSession.setActionHandler("play", options.playHandler$)
  navigator.mediaSession.setActionHandler("pause", options.pauseHandler$)
  navigator.mediaSession.setActionHandler("nexttrack", options.nextTrackHandler$)
  navigator.mediaSession.setActionHandler("previoustrack", options.previousTrackHandler$)
  
  onCleanup(() => {
    DEBUG_INFO_LABEL("SMTC", "handlers clean up")
    navigator.mediaSession.setActionHandler("play", null)
    navigator.mediaSession.setActionHandler("pause", null)
    navigator.mediaSession.setActionHandler("nexttrack", null)
    navigator.mediaSession.setActionHandler("previoustrack", null)
    navigator.mediaSession.metadata = null
  })

  return {
    changeMetadata$(data: MediaMetadataInit) {
      navigator.mediaSession.metadata = new MediaMetadata(data)
      DEBUG_INFO_LABEL("SMTC", "metadata changed to", data)
    }
  }
}