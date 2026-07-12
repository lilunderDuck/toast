export const COLLECTION_TYPE_NAME_REGISTRY = {
  [CollectionType.GALLERY]: "gallery",
  [CollectionType.PLAYLIST]: "playlist"
} as Record<CollectionType, string>

export const COLLECTION_TYPE_MAGIC_ROUTE_REGISTRY = {
  [CollectionType.GALLERY]: "gallery_ex",
  [CollectionType.PLAYLIST]: "playlist_ex"
} as Record<CollectionType, string>