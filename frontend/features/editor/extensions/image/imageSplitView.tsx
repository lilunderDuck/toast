import { type Attribute, Node } from '@tiptap/core'
// ...
import stylex from "@stylexjs/stylex"
import __style from "./imageSplitView.module.css"
// ...
import { NodeViewWrapper, SolidNodeViewRenderer } from '~/libs/solid-tiptap-renderer'
// ...
import { insertNodeAtCurrentPosition, useNodeState } from '../../utils'
import { ImageInput, type ImageAttribute } from '../files'

const style = stylex.create({
  node: {
    width: "100%",
    height: "17rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 5
  },
  image__divider: {
    height: "100%",
    width: 9,
    borderRadius: 6,
    backgroundColor: "var(--gray6)"
  }
})

type ImageSplitViewAttribute = {
  leftImage: ImageAttribute
  rightImage: ImageAttribute
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageSplitView: {
      insertImageSplitView$: () => ReturnType
    }
  }
}

export const ImageSplitViewExtension = Node.create({
  name: 'imageSplitView',
  group: 'block',
  selectable: false,
  atom: true,
  addAttributes(): Record<keyof ImageSplitViewAttribute, Attribute> {
    return {
      leftImage: {
        default: null,
      },
      rightImage: {
        default: null
      }
    }
  },
  addCommands() {
    return {
      insertImageSplitView$: () => ({ tr }) => {
        // @ts-ignore
        return insertNodeAtCurrentPosition<ImageSplitViewAttribute>(this, tr, { leftImage: null, rightImage: null })
      },
    }
  },
  addNodeView: () => SolidNodeViewRenderer(() => {
    const { data$, updateAttribute$ } = useNodeState<ImageSplitViewAttribute>()

    return (
      <NodeViewWrapper {...stylex.attrs(style.node)} id={__style.imageNode}>
        <ImageInput 
          onChange$={(fileName) => {
            updateAttribute$("leftImage", { name: fileName })
          }} 
          data$={data$().leftImage} 
        />
        <div {...stylex.attrs(style.image__divider)} />
        <ImageInput 
          onChange$={(fileName) => {
            updateAttribute$("rightImage", { name: fileName })
          }} 
          data$={data$().rightImage} 
        />
      </NodeViewWrapper>
    )
  }),
})