export const ROOT_FOLDER = 'root'
export const DONT_RENDER = 'no-render'

export const EMPTY_FOLDER_NODE = { id: DONT_RENDER }

export function createFileNode(id: string) {
  return { id: id }
}

export function createFolderNode(id: string) {
  return { id: id, child: [EMPTY_FOLDER_NODE] }
}