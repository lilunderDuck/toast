import { type Attribute, Node } from '@tiptap/core'
// ...
import { NodeViewWrapper, SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { insertNodeAtCurrentPosition, useNodeState } from '../../utils'
import { ImageInput, type ImageAttribute } from '../files'
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  node: {
    width: "100%",
    minHeight: "17rem",
    height: "17rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      insertImage$: () => ReturnType
    }
  }
}

export const ImageExtension = Node.create({
  name: 'image',
  group: 'block',
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
      insertImage$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<ImageAttribute>(this, tr, { name: '' })
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(() => {
    const { data$, updateAttribute$ } = useNodeState<ImageAttribute>()

    return (
      <NodeViewWrapper {...stylex.attrs(style.node)}>
        <ImageInput 
          onChange$={(fileName) => {
            updateAttribute$("name", fileName)
          }} 
          data$={data$()} 
        />
      </NodeViewWrapper>
    )
  }),
})