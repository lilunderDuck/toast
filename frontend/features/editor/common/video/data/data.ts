export interface IVideoSubtitleData {
  from: number
  to: number
  text: string
}

export interface IVideoChapterData {
  from: number
  to: number
  text: string
}

export interface IVideoBlockData {
  videoName: string
  subtitles?: IVideoSubtitleData[]
  chapters?: IVideoChapterData[]
}