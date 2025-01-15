import { IJournalCategoryData } from "./stuff"

export namespace JournalVituralFileTree {
  export type Tree = string | {
    id: string
    child: Tree[]
  }

  /**A list of file datas that can be stored */
  export type Data = IJournalCategoryData | IJournalCategoryData

  export type Type = 'journal' | 'category'
}