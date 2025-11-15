import { NodeViewWrapper } from '~/libs/solid-tiptap-renderer'
// ...
import { createEditorNode, insertNodeAtCurrentPosition, useNodeState } from '../../utils'

import { CodeBlock, CodeBlockProvider, type CodeBlockData } from '../files/shared/code'

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
  name$: 'code',
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
    const { data$, updateAttribute$ } = useNodeState<CodeAttribute>()

    return (
      <NodeViewWrapper>
        <CodeBlockProvider
          data$={data$()}
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
  menu$(editorInstance) {
    return {}
  },
})