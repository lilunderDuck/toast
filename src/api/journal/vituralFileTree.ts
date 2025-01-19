import type { IJournalCategoryData, IJournalData } from "./stuff"

export namespace JournalVituralFileTree {
  export type Tree = Array<string | {
    id: string
    child: Tree[]
  }>

  /**A list of file datas that can be stored */
  export type Data = IJournalData | IJournalCategoryData 
}

export const enum JournalFileType {
  journal,
  category
}

export interface IClientJournalVirturalFileTreeData {
  tree: JournalVituralFileTree.Tree
  lookup: Record<string, JournalVituralFileTree.Data>
}