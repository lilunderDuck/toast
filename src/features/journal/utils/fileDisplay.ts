export type FolderNode = {
  id: string;
  child: TreeNode[];
};

export type TreeNode = string | FolderNode;

export function isFolder(node: TreeNode): node is FolderNode {
  return typeof node === "object";
}

export function isNodeIdAFolder(
  anyNode: TreeNode,
  id: string,
): anyNode is FolderNode {
  return isFolder(anyNode) && anyNode.id === id;
}

export function insertBefore(
  nodes: TreeNode[],
  node: TreeNode,
  before: string,
) {
  const newChild = [];
  for (const child of nodes) {
    newChild.push(child);
    if (child === before || isNodeIdAFolder(child, before)) {
      newChild.push(node);
    }
  }

  return newChild;
}

export function createFolder(id: string): FolderNode {
  return {
    id,
    child: []
  }
} 