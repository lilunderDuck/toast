import { RANDOM_STRING } from 'macro-def'
// ...
import { insertNodeAtCurrentPosition, NodeViewWrapper, useSolidNodeView } from '~/libs/solid-tiptap-renderer'
// ...
import stylex from "@stylexjs/stylex"
// ...
import { createEditorNode } from '../../utils'
import { TaskDataProvider, type TasksAttribute } from './provider'

const style = stylex.create({
  nodeView: {
    marginBottom: 20
  }
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    video: {
      insertVideo$: () => ReturnType
    }
  }
}

export const TasksNode = createEditorNode<
  TasksAttribute, EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'task',
  attributes$: () => ({
    tasks: {
      default: []
    }
  }),
  commands$() {
    return {
      insertVideo$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<TasksAttribute>(this, tr, { 
          tasks: [{
            name: "",
            completed: false,
            id: RANDOM_STRING(5)
          }]
        })
      },
    }
  },
  View$() {
    const { attrs$ } = useSolidNodeView<TasksAttribute>()

    return (
      <TaskDataProvider attrs$={attrs$()}>
        <NodeViewWrapper {...stylex.attrs(style.nodeView)}>
        </NodeViewWrapper>
      </TaskDataProvider>
    )
  },
})