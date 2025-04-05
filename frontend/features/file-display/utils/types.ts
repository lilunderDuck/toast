export interface IDndDragEvent<T extends number | string> extends CustomEvent {
  detail: {
    info: {
      id: T
      source: "pointer"
      trigger: "draggedEntered"
    }
    items: { id: T }[]
  }
  srcElement: Ref<"div">
  type: "consider" | "finalize"
}

export type ContainsIdProps = { id: string | number }
export type FileNodeProps = ContainsIdProps & {
  onClick?: AnyFunction
}

export type NodeData<T extends FileNodeProps> = Omit<T, "onClick">

export const enum FileNodeType {
  FILE,
  FOLDER
}

export type FolderNode = {
  id: number
  child: Tree
}

export type FileNode = {
  id: number
}

export type Tree = AnyTreeNode[]

export type AnyTreeNode = FileNode | FolderNode