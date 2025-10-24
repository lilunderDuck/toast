import { type Attribute, Node } from '@tiptap/core'
// ...
import { NodeViewWrapper, SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { insertNodeAtCurrentPosition, useNodeState } from '../../utils'
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

export const VideoNode = Node.create({
  name: 'video',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof VideoAttribute, Attribute> {
    return {
      name: {
        default: null,
      }
    }
  },
  addCommands() {
    return {
      insertVideo$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<VideoAttribute>(this, tr, { name: '' })
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(() => {
    const { data$ } = useNodeState<VideoAttribute>()

    return (
      <NodeViewWrapper {...stylex.attrs(style.nodeView)}>
        <Video src$={data$().name} />
      </NodeViewWrapper>
    )
  }),
})