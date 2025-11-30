import { getRandomNumberFrom } from "~/utils"
// ...
import type { TreeNodeData } from "../provider"

/**Generates a new tree node, initialized as either a leaf or a parent. 
 * @param type the node type
 * @see {@link TreeViewNodeType}
 */
export function createNode(type: TreeViewNodeType): TreeNodeData {
  const nodeId = getRandomNumberFrom(0, 999_999_999)
  return type === TreeViewNodeType.LEAF ? { id: nodeId } : { id: nodeId, child: [] }
}

/**Search a node on the provided tree segment to locate a specific node by its ID. 
 * @param child The array of nodes to begin the search from.
 * @param nodeId The ID of the node to search for.
 * @returns a {@link TreeNodeData} if it's found.
 * @note Honestly, this function will 150% find the node you're looking for, because
 * it's already exist in the tree itself. 
 * 
 * But if this function returns null, something is definitely wrong on your side, 
 * maybe due to saving or something.
*/
export function recursivelyFindNode(nodeId: number, child: TreeNodeData[]): TreeNodeData | null {
  for (const node of child) {
    if (node.id === nodeId) {
      return node
    }

    if (node.child && node.child.length > 0) {
      const foundNode = recursivelyFindNode(nodeId, node.child)
      if (foundNode) {
        return foundNode
      }
    } // else continue with the loop
  }

  return null
}

/**Replaces the children of a specified parent node with a new array of nodes. 
 * @param treeCacheRef The reference to the tree. 
 * @param whichFolderId The id of the parent node.If you pass in this magic constant: 
 * `TREE_VIEW_ROOT_NODE_ID`, it will replace the whole tree.
 * @param treeContent new child content.
 * @returns the modified tree.
 */
export function replaceTree(
  treeCacheRef: TreeNodeData[],
  whichFolderId: number,
  treeContent: TreeNodeData[]
) {
  if (whichFolderId === TREE_VIEW_ROOT_NODE_ID) {
    treeCacheRef = treeContent
    console.log('replace', whichFolderId, "with", treeCacheRef)
    return treeCacheRef
  }

  const shouldBeAFolder = recursivelyFindNode(whichFolderId, treeCacheRef)
  console.assert(shouldBeAFolder, `Could not insert to ${whichFolderId}, it must exist in the tree.`)
  console.assert(shouldBeAFolder?.child, `${whichFolderId} must be a folder.`)

  shouldBeAFolder!.child = treeContent
  console.log('replace', whichFolderId, "with", treeCacheRef)
  return treeCacheRef
}