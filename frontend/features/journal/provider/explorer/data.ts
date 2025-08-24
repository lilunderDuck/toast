export const ROOT_FOLDER = 0
export const DONT_RENDER = 1

export const EMPTY_FOLDER_NODE = { id: DONT_RENDER }

export function createFileNode(id: number) {
  return { id: id }
}

export function createFolderNode(id: number) {
  return { id: id, child: [EMPTY_FOLDER_NODE] }
}