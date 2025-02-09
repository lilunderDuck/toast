import { AnyVirTreeNode, IJournalCategoryData, IJournalData, isFolder, VirFileTree } from "~/api/journal"

type TreeMappingData = Record<number, IJournalCategoryData | IJournalData>
type TreeMapping = Map<string, IJournalCategoryData | IJournalData>

export function createVirTree(initalTree: VirFileTree.Data | 'default', updateThis?: AnyFunction) {
  let treeCache: VirFileTree.Data = initalTree !== 'default' ? initalTree : {
    list: [],
    data: []
  }

  let mapping: TreeMapping = new Map()

  const update = () => {
    updateThis?.()
    console.log('[vir tree] update')
  }

  const add = (node: AnyVirTreeNode, toFolder: number | 'root') => {
    if (toFolder === 'root') {
      treeCache.data.push(node)
      return update()
    }

    const thisFolder = find(toFolder)
    if (!thisFolder) {
      return console.error("Could not insert", node, "to", toFolder)
    }

    if (!isFolder(thisFolder)) {
      return console.error(toFolder, "is not a folder")
    }

    thisFolder.child.push(node)
    return update()
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
      return update()
    }

    const shouldBeAFolder = find(whichFolderId)
    if (!shouldBeAFolder) {
      return console.error("could not find node", whichFolderId)
    }

    if (!isFolder(shouldBeAFolder)) {
      return console.error(shouldBeAFolder, "is not a folder")
    }

    shouldBeAFolder.child = tree
    update()
  }

  return {
    add$: add,
    find$: find,
    replaceTree$: replaceTree,
    setTree$(tree: VirFileTree.Tree) {
      treeCache.data = tree
      update()
    },
    setMapping$(data: TreeMappingData) {
      console.log(mapping)
      mapping = new Map(Object.entries(data))
      console.log(mapping)
      update()
    },
    get mapping$() {
      console.log('get', mapping)
      return mapping
    },
    get tree$() {
      return treeCache
    }
  }
}