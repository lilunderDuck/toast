import { insertNodeAtCurrentPosition, NodeViewWrapper, useSolidNodeView } from '~/libs/solid-tiptap-renderer'
import { Video, type VideoAttribute } from '~/features/video'
// ...
import { createEditorNode } from '../../utils'

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
    const { attrs$ } = useSolidNodeView<VideoAttribute>()

    return (
      <NodeViewWrapper {...stylex.attrs(style.nodeView)}>
        <Video src$={attrs$().name} />
      </NodeViewWrapper>
    )
  },
  
})