export class TreeNode {
  static onUpdate: (
    type: 'add' | 'remove' | 'update',
    data: 
      { type: 'journal', id: string } |
      { type: 'category', id: string, node: TreeNode }
    // 
  ) => any = () => {}

  readonly $journals: string[] = []
  readonly $categories: Record<string, this> = {}

  $addJournal(id: string) {
    this.$journals.push(id)
    TreeNode.onUpdate('add', { type: 'journal', id })
  }

  $addCategory(id: string, node: this) {
    this.$categories[id] = node
    TreeNode.onUpdate('remove', { type: 'category', id, node })
  }
}