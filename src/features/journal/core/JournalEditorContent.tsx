import stylex from "@stylexjs/stylex"
import { Show } from "solid-js"
// ...
import { 
  ThisEditor, 
  ThisEditorStatusBar,
  ThisEditorTitleBar, 
  useThisEditorContext 
} from "~/features/editor"
// ...
import { useJournalContext } from "../context"
import { EditorWelcome, TabList, TabPanel } from "../components"

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
  }
})

export function JournalEditorContent() {
  const { $journal } = useJournalContext()
  const { $event } = useThisEditorContext()

  $event.$on('editor_onSwitching', async(previousData) => {
    if (previousData) {
      await $journal.$save(previousData.id, previousData.content)
    }
  })

  $event.$on('editor_onUpdate', async(data) => {
    await $journal.$save(data.id, data.content)
  })

  return (
    <TabPanel initialSize={0.7} titleBar={
      <TabList />
    }>
      <div {...stylex.attrs(style.content)}>
        <ThisEditorTitleBar name={$journal.$currentlyOpened()?.name} />
        <ThisEditor>
          <ThisEditorStatusBar />
        </ThisEditor>
        <Show when={!$journal.$currentlyOpened()}>
          <EditorWelcome />
        </Show>
      </div>
    </TabPanel>
  )
}