import { insertNodeAtCurrentPosition, NodeViewWrapper, useSolidNodeView } from '~/libs/solid-tiptap-renderer'
import { getRandomNumberFrom } from '~/utils'
import { TreeViewProvider } from '~/features/tree-view'
// ...
import stylex from "@stylexjs/stylex"
// ...
import { createEditorNode } from '../../utils'
import { TaskDataProvider, type AnyTaskData, type TasksAttribute } from './provider'
import TaskNodeView from './node'

const style = stylex.create({
  nodeView: {
    marginBottom: 20
  }
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    task: {
      insertTask$: () => ReturnType
    }
  }
}

export const TasksNode = createEditorNode<
  TasksAttribute, EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'task',
  attributes$: () => ({
    tasks: {
      default: {}
    }
  }),
  commands$() {
    return {
      insertTask$: () => ({ tr }) => {
        const DEFAULT_TASK_ID = getRandomNumberFrom(0, 999_999)
        return insertNodeAtCurrentPosition<TasksAttribute>(this, tr, {
          tasks: {
            storage: {
              [DEFAULT_TASK_ID]: {
                type: TaskType.SECTION,
                name: "New task section",
                parentId: TREE_VIEW_ROOT_NODE_ID
              }
            },
            tree: [
              { id: DEFAULT_TASK_ID, child: [] }
            ]
          }
        })
      },
    }
  },
  View$() {
    const { attrs$, updateAttribute$ } = useSolidNodeView<TasksAttribute>()
    
    return (
      <TreeViewProvider<AnyTaskData> 
        onUpdate$={(newData) => updateAttribute$('tasks', newData)} 
        data$={attrs$().tasks}
      >
        <TaskDataProvider>
          <NodeViewWrapper {...stylex.attrs(style.nodeView)}>
            <TaskNodeView />
          </NodeViewWrapper>
        </TaskDataProvider>
      </ TreeViewProvider>
    )
  },
})