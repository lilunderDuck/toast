import stylex from "@stylexjs/stylex"
import { type ParentProps, Show } from "solid-js"
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

export function JournalEditorContent(props: ParentProps) {
  const { $journal } = useJournalContext()

  return (
    <TabPanel initialSize={0.7} titleBar={
      <TabList />
    }>
      <div {...stylex.attrs(style.content)}>
        {props.children}
        <Show when={!$journal.$currentlyOpened()}>
          <EditorWelcome />
        </Show>
      </div>
    </TabPanel>
  )
}