export namespace VirturalFileTree {
  export type ValidNode = string | Folder
  
  export type Folder = {
    id: string
    child: ValidNode[]
  }
}


export function isNodeIdAFolder(child: VirturalFileTree.ValidNode, id: string): child is VirturalFileTree.Folder {
  return typeof child === 'object' && child.id === id
}

export function isFolder(child: VirturalFileTree.ValidNode): child is VirturalFileTree.Folder {
  return typeof child === 'object'
}

export function insertBefore(nodes: VirturalFileTree.ValidNode[], node: VirturalFileTree.ValidNode, before: string) {
  const newChild = []
  for (const child of nodes) {
    newChild.push(child)
    if (child === before || isNodeIdAFolder(child, before)) {
      newChild.push(node)
    }
  }

  return newChild
}