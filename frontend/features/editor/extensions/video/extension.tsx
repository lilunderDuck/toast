import { type Attribute, Node } from '@tiptap/core'
// ...
import { NodeViewWrapper, SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { useNodeState } from '../../utils'
import { Video, type VideoAttribute } from '../files'

import stylex from "@stylexjs/stylex"

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
      insertVideo$: () => ({ tr, dispatch }) => {
        const node = this.type.create({ name: '' } satisfies VideoAttribute)

        if (dispatch) {
          tr.replaceRangeWith(tr.selection.from, tr.selection.to, node)
        }

        return true
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(() => {
    const { data$ } = useNodeState<VideoAttribute>()

    return (
      <NodeViewWrapper>
        <Video src$={data$().name} />
      </NodeViewWrapper>
    )
  }),
})