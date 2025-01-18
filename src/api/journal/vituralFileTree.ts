import type { IJournalCategoryData, IJournalData } from "./stuff"

export namespace JournalVituralFileTree {
  export type Tree = string | {
    id: string
    child: Tree[]
  }

  /**A list of file datas that can be stored */
  export type Data = IJournalData | IJournalCategoryData 
}

export const enum JournalFileType {
  journal,
  category
}