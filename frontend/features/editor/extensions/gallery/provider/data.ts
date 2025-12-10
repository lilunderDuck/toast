import type { IStorage } from "~/utils";

export type GallerySessionStorage = IStorage<{
  [key: `${string}.${string}.currIndex`]: number
}>

