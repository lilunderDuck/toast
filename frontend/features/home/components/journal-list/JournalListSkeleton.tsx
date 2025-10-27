import stylex from "@stylexjs/stylex"
import { For } from "solid-js"
import { Skeleton } from "~/components"

const style = stylex.create({
  skeletonBlock: {
    width: "10rem !important",
    height: "10rem !important",
  }
})

export function JournalListSkeleton() {
  return (
    <For each={new Array(10)}>
      {() => <Skeleton {...stylex.attrs(style.skeletonBlock)} />}
    </For>
  )
}