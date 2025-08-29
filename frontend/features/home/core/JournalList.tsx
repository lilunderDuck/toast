import { For, type ParentProps, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalList.module.css"
// ...
import { CreateJournalButton, JournalBlock } from "../components"
import { useJournalHomeContext } from "../provider"
import { JournalListSkeleton } from "./JournalListSkeleton"

const style = stylex.create({
  list: {
    gap: 10,
    flexWrap: "wrap",
    display: "flex"
  }
})

interface IJournalListProps {
}

export function JournalList(props: ParentProps<IJournalListProps>) {
  const { groups$, isLoading$ } = useJournalHomeContext()
  
  return (
    <div {...stylex.attrs(style.list)} id={__style.list}>
      <Show when={!isLoading$()} fallback={
        <JournalListSkeleton />
      }>
        <For each={groups$()}>
          {it => <JournalBlock {...it} />}
        </For>
      </Show>
      <CreateJournalButton />
    </div>
  )
}