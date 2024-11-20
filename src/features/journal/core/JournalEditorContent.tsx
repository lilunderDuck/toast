import stylex from "@stylexjs/stylex"
import { useJournalContext } from "../context"
import { EditorWelcome, Tab, TabPanel } from "../components"
import { createSignal, For, type ParentProps, Show } from "solid-js"
import { FlexCenterY, SortableVerticalItem, SortableVerticalList } from "~/components"

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
  const { $currentlyOpenedJournal } = useJournalContext()
  const [item, setItem] = createSignal([
    { name: '1', active: false },
    { name: '4', active: true },
  ])

  return (
    <TabPanel initialSize={0.7} titleBar={
      <div app-scrollbar app-scrollbar-vertical app-invs-scrollbar>
        <FlexCenterY {...stylex.attrs(style.tabs)}>
          <For each={item()}>
            {it => <Tab focused={it.active}>{it.name}</Tab>}
          </For>
        </FlexCenterY>
      </div>
    }>
      <div {...stylex.attrs(style.content)}>
        {props.children}
        <Show when={!$currentlyOpenedJournal()}>
          <EditorWelcome />
        </Show>
      </div>
    </TabPanel>
  )
}