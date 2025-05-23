import { TextData } from "~/features/editor/common/text"

export const enum ListType {
  ordered,
  unordered
}

export interface IListBlockData {
  items: TextData[][]
  type: ListType
}