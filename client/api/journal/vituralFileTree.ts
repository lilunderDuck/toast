import type { IJournalCategoryData, IJournalData } from "./stuff"

export namespace JournalVituralFileTree {
  export type FolderNode = {
    id: string
    child: Tree[]
  }

  export type FileNode = {
    id: string
  }

  export type Tree = Array<FolderNode | FileNode>

  /**A list of file datas that can be stored */
  export type Data = IJournalData | IJournalCategoryData 
}

export type JournalVirTreeData = {
  list: number[]
  data: JournalVituralFileTree.Tree[]
}

export const enum JournalFileType {
  journal,
  category
}

export interface IClientJournalVirturalFileTreeData {
  tree: JournalVituralFileTree.Tree
  lookup: Record<string, JournalVituralFileTree.Data>
}