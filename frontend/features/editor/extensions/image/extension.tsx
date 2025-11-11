import { type Command } from '@tiptap/core'
// ...
import { NodeViewWrapper } from '~/libs/solid-tiptap-renderer'
// ...
import { createEditorNode, insertNodeAtCurrentPosition, useNodeState } from '../../utils'
import { ImageInput, type ImageAttribute } from '../files'
import stylex from "@stylexjs/stylex"

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
  menu$(editorInstance) {
    return {}
  },
  View$() {
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
  }
})