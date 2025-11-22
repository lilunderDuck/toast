import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"
import { createSignal } from "solid-js"
import { Button, Label, Tooltip } from "~/components"
import { Editor, EditorProvider, useEditorContext } from "~/features/editor"
import { highlightCodeBlock } from "~/features/editor/common/code"

const style = stylex.create({
  editor: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  editor__contentPanel: {
    width: "50%",
    borderRight: "2px solid var(--gray6)",
    height: "100%",
    paddingInline: 10,
    paddingBlock: 5
  },
  editor__dataPanel: {
    width: "50%",
    height: "100%",
    paddingInline: 10,
    paddingBlock: 5,
  },
  editor__jsonData: {
    whiteSpace: "pre-wrap",
    marginBottom: 15
  }
})

export default function EditorTestPage() {
  return (
    <div {...stylex.attrs(style.editor)}>
      <EditorProvider id$="test">
        <section {...stylex.attrs(style.editor__contentPanel)}>
          <Label>
            Editor
          </Label>
          <Editor />
        </section>
        <section {...stylex.attrs(style.editor__dataPanel)}>
          <EditorStatePanel />
        </section>
      </EditorProvider>
    </div>
  )
}

function EditorStatePanel() {
  const { isReadonly$, setIsReadonly$, event$ } = useEditorContext()
  let preRef!: Ref<"pre">
  const [data, setData] = createSignal('')

  event$.on$(EditorEvent.ON_UPDATE, (data) => {
    setData(JSON.stringify(data))
    highlightCodeBlock('json', preRef)
  })

  return (
    <section>
      <Label>
        JSON content
      </Label>
      <pre
        innerText={data()}
        class={MERGE_CLASS(
          "language-json",
          stylex.attrs(style.editor__jsonData)
        )}
        ref={preRef}
      >
        {data() ?? "... Empty ..."}
      </pre>

      <Label>
        State control
      </Label>
      <Tooltip label$="Toggle readonly">
        <Button size$={ButtonSize.SMALL} onClick={() => setIsReadonly$(prev => !prev)}>
          Readonly: {JSON.stringify(isReadonly$())}
        </Button>
      </Tooltip>
    </section>
  )
}