import type { AnyVirTreeNode, VirFileTree } from "./types"

export function isFolder(node: AnyVirTreeNode): node is VirFileTree.FolderNode {
  return (
    typeof node === "object" &&
    Array.isArray((node as VirFileTree.FolderNode)?.child)
  ) 
}

export function isNodeIdAFolder(
  anyNode: AnyVirTreeNode,
  id: number,
): anyNode is VirFileTree.FolderNode {
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

export function createFolderNodeData(id: number): VirFileTree.FolderNode {
  return {
    id,
    child: []
  }
}

export function createFileNodeData(id: number): VirFileTree.FileNode {
  return { id }
}