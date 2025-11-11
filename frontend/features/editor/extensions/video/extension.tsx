import { NodeViewWrapper } from '~/libs/solid-tiptap-renderer'
// ...
import { createEditorNode, insertNodeAtCurrentPosition, useNodeState } from '../../utils'
import { Video, type VideoAttribute } from '../files'

import stylex from "@stylexjs/stylex"

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

export const VideoNode = createEditorNode<
  VideoAttribute, EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'video',
  attributes$: () => ({
    name: {
      default: null,
    }
  }),
  commands$() {
    return {
      insertVideo$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<VideoAttribute>(this, tr, { name: '' })
      },
    }
  },
  View$() {
    const { data$ } = useNodeState<VideoAttribute>()

    return (
      <NodeViewWrapper {...stylex.attrs(style.nodeView)}>
        <Video src$={data$().name} />
      </NodeViewWrapper>
    )
  },
  menu$(editorInstance) {
    return {}
  },
})