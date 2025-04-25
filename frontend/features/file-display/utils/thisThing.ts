import type { AnyTreeNode, FileNode, FolderNode } from "./types"

export function isFolder(node: AnyTreeNode): node is FolderNode {
  return (
    typeof node === "object" && 'child' in node
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

/**This exist is the backend used CBOR to make the data saved to disk smaller.
 * 
 * Empty array will cause it to return like this
 * ```
 * { "id": <some id>          }
 * //               ^^^^^^^^^ missing "child" prop
 * ```
 */
export const A_SPECIAL_CONSTANT_THAT_SHOULD_SAVE_THE_DATA = -1337

export function createFolderNodeData(id: number): FolderNode {
  return {
    id,
    child: [
      createFileNodeData(A_SPECIAL_CONSTANT_THAT_SHOULD_SAVE_THE_DATA)
    ]
  }
}

export function createFileNodeData(id: number): FileNode {
  return { id }
}