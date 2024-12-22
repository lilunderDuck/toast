import { Accessor, createSignal } from "solid-js"
import { type VirturalFileTree, insertBefore, isFolder } from "./stuff"
import { createEvent, IEvent } from "~/utils"

export interface INodeContext {
  tree: VirturalFileTree.ValidNode[]
  $event: IEvent<{
    node__update(newTree: VirturalFileTree.ValidNode[]): void
  }>
  $virturalTree: Accessor<VirturalFileTree.ValidNode[]>,
  $isFolder: typeof isFolder,
  $createFolder(id: string): VirturalFileTree.Folder,
  $addNode(node: VirturalFileTree.ValidNode, toFolder: string, before?: string): any,
  $findNodeRecursively(nodeId: string, nodes: VirturalFileTree.ValidNode[]): VirturalFileTree.ValidNode | null,
}

export function createNodeContext(): INodeContext {
  let tree: VirturalFileTree.ValidNode[] = []
  const event: INodeContext["$event"] = createEvent()
  const [virturalTree, setVirturalTree] = createSignal<VirturalFileTree.ValidNode[]>([])

  const update = () => {
    setVirturalTree(tree)
    event.$emit('node__update', tree)
    console.log('tree updated')
  }

  const findNodeRecursively: INodeContext["$findNodeRecursively"] = (nodeId, nodes) => {
    for (const node of nodes) {
      if (node === nodeId) {
        return node
      }

      if (isFolder(node)) {
        if (node.id === nodeId) {
          return node
        }

        findNodeRecursively(nodeId, node.child)
      }
    }

    return null
  }

  const addNode: INodeContext["$addNode"] = (node, toFolder, before) => {
    console.log(`Adding node`, node, `to folder "${toFolder}" before "${before || '*nothing*'}"`)
    if (toFolder === 'root') {
      if (before) {
        tree = insertBefore(tree, node, before)
      }
      else {
        tree.push(node)
      }

      update()
    }

    const thisExactFolder = findNodeRecursively(toFolder, tree)
    if (!thisExactFolder) {
      return console.log('Cannot insert', node, 'to', toFolder)
    }

    if (typeof thisExactFolder === "string") {
      return
    }

    if (before) {
      thisExactFolder.child = insertBefore(thisExactFolder.child, node, before)
    }
    else {
      thisExactFolder.child.push(node)
    }

    update()
  }

  return { 
    get tree() {
      return tree
    },
    set tree(value) {
      tree = value
    },
    $event: event,
    $virturalTree: virturalTree,
    $isFolder: isFolder,
    $createFolder(id) {
      return { id, child: [] }
    },
    $addNode: addNode,
    $findNodeRecursively: findNodeRecursively,
  }
}