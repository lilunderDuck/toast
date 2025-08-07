export function getVideoPercentage(currentProgress: number, totalProgress: number) {
  return currentProgress / (totalProgress) * 100
}

export function getCurrentTimeByPercentage(
  currentPercentage: number,
  totalDuration: number,
) {
  return (currentPercentage * totalDuration) / 100
}