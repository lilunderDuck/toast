import { type Command } from '@tiptap/core'
// ...
import { NodeViewWrapper, useSolidNodeView } from '~/libs/solid-tiptap-renderer'
import { ImageInput, type ImageAttribute } from '~/features/image'
// ...
import stylex from "@stylexjs/stylex"
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'

const style = stylex.create({
  node: {
    width: "100%",
    height: "100%",
    maxHeight: "30rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  }
})

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      insertImage$: () => Command
    }
  }
}

export const ImageExtension = createEditorNode<
  ImageAttribute,
  EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: "image",
  commands$() {
    return {
      insertImage$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<ImageAttribute>(this, tr, { name: '' })
      },
    }
  },
  attributes$: () => ({
    name: {
      default: null
    }
  }),
  
  View$() {
    const { attrs$, updateAttribute$ } = useSolidNodeView<ImageAttribute>()

    return (
      <NodeViewWrapper {...stylex.attrs(style.node)}>
        <ImageInput
          onChange$={(fileName) => {
            updateAttribute$("name", fileName)
          }}
          data$={attrs$()}
        />
      </NodeViewWrapper>
    )
  }
})