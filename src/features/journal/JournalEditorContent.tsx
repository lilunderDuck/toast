import stylex from "@stylexjs/stylex"
import { useJournalContext } from "./context"
import { EditorWelcome, TabPanel } from "./components"
import { ParentProps, Show } from "solid-js"

const style = stylex.create({
  content: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--gray2)',
    position: 'relative'
  }
})

export function JournalEditorContent(props: ParentProps) {
  const { $currentlyOpenedJournal } = useJournalContext()

  return (
    <TabPanel initialSize={0.7}>
      <div {...stylex.attrs(style.content)}>
        {props.children}
        <Show when={!$currentlyOpenedJournal()}>
          <EditorWelcome />
        </Show>
      </div>
    </TabPanel>
  )
}