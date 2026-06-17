export const COLLECTION_TYPE_NAME_MAPPING = {
  [CollectionType.GALLERY]: "gallery",
  [CollectionType.PLAYLIST]: "playlist"
} as Record<CollectionType, string>

export const COLLECTION_TYPE_MAGIC_MAPPING = {
  [CollectionType.GALLERY]: "youre_in_external_mode_dont_panic",
  [CollectionType.PLAYLIST]: "the_answer_to_everything_is_42_non_inclusive"
} as Record<CollectionType, string>