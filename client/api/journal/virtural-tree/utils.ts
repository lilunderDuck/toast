import type { AnyVirTreeNode, VirFileTree } from "./types"

export function createVirTree(initalTree: VirFileTree.Data | 'default', update?: AnyFunction) {
  let treeCache: VirFileTree.Data = initalTree !== 'default' ? initalTree : {
    list: [],
    data: []
  }

  const add = (node: AnyVirTreeNode, toFolder: number | 'root') => {
    if (toFolder === 'root') {
      treeCache.data.push(node)
      return update?.()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      return console.error("Could not insert", node, "to", toFolder)
    }

    if (!isFolder(thisFolder)) {
      return console.error(toFolder, "is not a folder")
    }

    thisFolder.child.push(node)
    return update?.()
  }

  const find = (nodeId: number, child: VirFileTree.Tree = treeCache.data) => {
    for (const node of child) {
      if (node.id === nodeId) {
        return node
      }

      if (isFolder(node)) {
        if (node.id === nodeId) {
          return node
        }

        node.child

        find(nodeId, node.child)
      }
    }
 
    return null
  }

  const replaceTree = (whichFolderId: number | 'root', tree: VirFileTree.Tree) => {
    if (whichFolderId === 'root') {
      treeCache.data = tree
      return update?.()
    }

    const shouldBeAFolder = find(whichFolderId)
    if (!shouldBeAFolder) {
      return console.error("could not find node", whichFolderId)
    }

    if (!isFolder(shouldBeAFolder)) {
      return console.error(shouldBeAFolder, "is not a folder")
    }

    shouldBeAFolder.child = tree
    update?.()
  }

  return {
    add$: add,
    find$: find,
    replaceTree$: replaceTree,
    setTree$(tree: VirFileTree.Tree) {
      treeCache.data = tree
      update?.()
    },
    get tree$() {
      return treeCache
    }
  }
}

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

export function findNodeRecursively() {}

export function createFolderNodeData(id: number): VirFileTree.FolderNode {
  return {
    id,
    child: []
  }
}

export function createFileNodeData(id: number): VirFileTree.FileNode {
  return { id }
}