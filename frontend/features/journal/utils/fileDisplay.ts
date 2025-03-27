import { IJournalCategoryData, IJournalData } from "~/api/journal"

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

export type AnyVirTreeNode = FileNode | FolderNode

export function isFolder(node: AnyVirTreeNode): node is FolderNode {
  return (
    typeof node === "object" &&
    Array.isArray((node as FolderNode)?.child)
  ) 
}

export function isNodeIdAFolder(
  anyNode: AnyVirTreeNode,
  id: number,
): anyNode is FolderNode {
  return isFolder(anyNode) && anyNode.id === id
}

export function insertBefore<Node extends AnyVirTreeNode>(
  nodes: Node[],
  newNode: Node,
  before: number,
) {
  const newChild = []
  for (const child of nodes) {
    newChild.push(child)
    if (child.id === before || isNodeIdAFolder(child, before)) {
      newChild.push(newNode)
    }
  }

  return newChild
}

export function createFolderNodeData(id: number): FolderNode {
  return {
    id,
    child: []
  }
}

export function createFileNodeData(id: number): FileNode {
  return { id }
}