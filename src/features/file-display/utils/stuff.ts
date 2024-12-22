export type ValidNode = string | Folder
  
export type Folder = {
  id: string
  child: ValidNode[]
}

export function isNodeIdAFolder(child: ValidNode, id: string): child is Folder {
  return typeof child === 'object' && child.id === id
}

export function isFolder(child: ValidNode): child is Folder {
  return typeof child === 'object'
}

export function insertBefore(nodes: ValidNode[], node: ValidNode, before: string) {
  const newChild = []
  for (const child of nodes) {
    newChild.push(child)
    if (child === before || isNodeIdAFolder(child, before)) {
      newChild.push(node)
    }
  }

  return newChild
}