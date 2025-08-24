import { type Attribute, Node } from '@tiptap/core'
// ...
import { NodeViewWrapper, SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { useNodeState } from '../../utils'
import { Image, type ImageAttribute } from '../files'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      insertImage$: () => ReturnType
    }
  }
}

export const VideoNode = Node.create({
  name: 'video',
  group: 'block',
  inline: true,
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof ImageAttribute, Attribute> {
    return {
      name: {
        default: null,
      }
    }
  },
  addCommands() {
    return {
      insertVideo$: () => ({ tr, dispatch }) => {
        const node = this.type.create({ name: '' } satisfies ImageAttribute)

        if (dispatch) {
          tr.replaceRangeWith(tr.selection.from, tr.selection.to, node)
        }

        return true
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(() => {
    const { data$ } = useNodeState<ImageAttribute>()

    return (
      <NodeViewWrapper>
        <Image src$={data$().name} />
      </NodeViewWrapper>
    )
  }),
})