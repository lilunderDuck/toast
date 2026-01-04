import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"
import { createSignal, onMount } from "solid-js"
import __style from "~/styles/scrollbar.module.css"
import { Button, Label, Tooltip } from "~/components"
import { Editor, EditorProvider, useEditorContext } from "~/features/editor"
import { highlightCodeBlock } from "~/features/code-block"

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
  const { isReadonly$, setIsReadonly$, event$, open$ } = useEditorContext()
  let preRef!: Ref<"pre">
  const [data, setData] = createSignal('')

  onMount(async() => {
    const response = await fetch("/editor_test.json", {
      method: "GET",
    })

    console.assert(response.ok, "Failed to fetch /editor_test.json, file not found on ./src/public folder")
    open$(await response.json())
  })

  event$.on$(EditorEvent.ON_UPDATE, (data) => {
    setData(JSON.stringify(data))
    highlightCodeBlock('json', preRef)
  })

  return (
    <section class={`${__style.scrollbar} ${__style.scrollbarVertical}`} style="max-height:100%">
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