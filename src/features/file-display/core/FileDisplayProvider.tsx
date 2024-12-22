import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
// ...
import { createEvent, IEvent } from "~/utils"
// ...
import { Folder, insertBefore, isFolder, ValidNode } from "../utils"

export interface INodeContext {
  tree: ValidNode[]
  $event: IEvent<{
    node__update(newTree: ValidNode[]): void
  }>
  $virturalTree: Accessor<ValidNode[]>
  $isFolder: typeof isFolder
  $createFolder(id: string): Folder
  $addNode(node: ValidNode, toFolder: string, before?: string): any
  $findNodeRecursively(nodeId: string, nodes: ValidNode[]): ValidNode | null
}

const Context = createContext<INodeContext>()

export function FileDisplayProvider(props: ParentProps) {
  let tree: ValidNode[] = []
  const event: INodeContext["$event"] = createEvent()
  const [virturalTree, setVirturalTree] = createSignal<ValidNode[]>([])

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
  
  return (
    <Context.Provider value={{
      get tree() {
        return tree
      },
      set tree(value) {
        tree = value
        setVirturalTree(value)
      },
      $event: event,
      $virturalTree: virturalTree,
      $isFolder: isFolder,
      $createFolder(id) {
        return { id, child: [] }
      },
      $addNode: addNode,
      $findNodeRecursively: findNodeRecursively,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useFileDisplayContext = () => useContext(Context)!