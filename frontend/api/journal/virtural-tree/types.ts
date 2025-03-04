import type { IJournalCategoryData, IJournalData } from "../stuff"

export namespace VirFileTree {
  export const enum FileType {
    journal,
    category
  }

  export type FolderNode = {
    id: number
    child: Tree
  }

  export type FileNode = {
    id: number
  }

  export type Tree = Array<AnyVirTreeNode>

  export type Data = {
    list: number[]
    data: Tree
  }

  export type ClientData = {
    list: Record<number, IJournalCategoryData | IJournalData>
    data: Tree
  }
}

export type AnyVirTreeNode = VirFileTree.FileNode | VirFileTree.FolderNode