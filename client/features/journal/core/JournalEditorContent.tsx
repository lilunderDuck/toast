import stylex from "@stylexjs/stylex"
import { Show } from "solid-js"
// ...
import { 
  ThisEditor, 
  ThisEditorStatusBar,
  ThisEditorTitleBar, 
  useThisEditorContext 
} from "client/features/editor"
import { ResizablePanel } from "client/components"
// ...
import { EditorWelcome } from "../components"
import { useJournalContext } from "../context"

const style = stylex.create({
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--gray2)',
    position: 'relative'
  },
  tabs: {
    paddingInline: 5,
    gap: 5,
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap'
  },
  editor: {
    height: 'calc(100vh - 39px)'
  }
})

export function JournalEditorContent() {
  const { $journal } = useJournalContext()
  const { event$ } = useThisEditorContext()

  const shouldSave = () => {
    return $journal.currentlyOpened$() !== undefined
  }

  event$.on$('editor__onSwitching', async(previousData) => {
    if (!shouldSave()) return console.log('not open anything')

    if (previousData) {
      await $journal.save$(previousData.id, previousData.content)
    }
  })

  event$.on$('editor__onUpdate', async(data) => {
    if (!shouldSave()) return console.log('not open anything')
    
    await $journal.save$(data.id, data.content)
  })

  return (
    <ResizablePanel initialSize={0.7}>
      <div {...stylex.attrs(style.content)}>
        <ThisEditorTitleBar name={$journal.currentlyOpened$()?.name} />
        <ThisEditor {...stylex.attrs(style.editor)}>
          <ThisEditorStatusBar />
        </ThisEditor>
        <Show when={!$journal.currentlyOpened$()}>
          <EditorWelcome />
        </Show>
      </div>
    </ResizablePanel>
  )
}