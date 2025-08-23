import type { IStorage } from "~/utils";

export type GallerySessionStorage = IStorage<{
  [key: `${number}.${number}.currIndex`]: number
}>

