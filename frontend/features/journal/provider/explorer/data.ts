export const ROOT_FOLDER = 0
export const DONT_RENDER = 1

export const EMPTY_FOLDER_NODE = { id: DONT_RENDER }
export const FILE_NODE = { id: 0 }
export const FOLDER_NODE = { id: 0, child: [EMPTY_FOLDER_NODE] }