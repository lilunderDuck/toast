import type { AnyTreeNode, FileNode, FolderNode } from "./types"

export function isFolder(node: AnyTreeNode): node is FolderNode {
  return (
    typeof node === "object" &&
    Array.isArray((node as FolderNode)?.child)
  ) 
}

export function isNodeIdAFolder(
  anyNode: AnyTreeNode,
  id: number,
): anyNode is FolderNode {
  return isFolder(anyNode) && anyNode.id === id
}

export function insertBefore<Node extends AnyTreeNode>(
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