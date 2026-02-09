export function reloadVideo(videoRef: Ref<"video">) {
  videoRef.load()
  videoRef.play()
}