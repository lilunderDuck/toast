export function toHHMMSS(seconds: number) {
  const toMiliseconds = seconds * 1000
  return new Date(toMiliseconds).toISOString().slice(11, 19)
}

export function progressPercentageToCurrentTime(
  totalDuration: number,
  currentProgress: number
) {
  return (currentProgress * totalDuration) / 100
}