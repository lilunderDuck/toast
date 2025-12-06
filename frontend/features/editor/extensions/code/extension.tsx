import { NodeViewWrapper, useSolidNodeView } from '~/libs/solid-tiptap-renderer'
// ...
import { createEditorNode, insertNodeAtCurrentPosition } from '../../utils'

import { CodeBlock, CodeBlockProvider, type CodeBlockData } from '../../common/code'

export type CodeAttribute = CodeBlockData

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    code: {
      insertCodeBlock$: () => ReturnType
    }
  }
}

export const CodeBlockExtension = createEditorNode<
  CodeAttribute, EditorNodeType.BLOCK
>(EditorNodeType.BLOCK, {
  name$: 'codeBlock',
  attributes$: () => ({
    codeContent: {
      default: ""
    },
    lang: {
      default: ""
    }
  }),
  commands$() {
    return {
      insertCodeBlock$: () => ({ tr }) => {
        return insertNodeAtCurrentPosition<CodeAttribute>(this, tr, { codeContent: "", lang: "text" })
      },
    }
  },
  View$() {
    const { attrs$, updateAttribute$ } = useSolidNodeView<CodeAttribute>()

    return (
      <NodeViewWrapper>
        <CodeBlockProvider
          data$={attrs$()}
          onChange$={(codeData) => {
            for (const [key, value] of Object.entries(codeData)) {
              if (!key) continue
              updateAttribute$(key as keyof CodeAttribute, value)
            }
          }}
        >
          <CodeBlock />
        </CodeBlockProvider>
      </NodeViewWrapper>
    )
  },
})