import stylex from "@stylexjs/stylex"
import { For } from "solid-js"
import { Skeleton } from "~/components"

const style = stylex.create({
  file: {
    paddingInline: 10,
    paddingBlock: 12,
    borderRadius: 6,
    marginBottom: 5
  }
})

export function FileDisplaySkeleton() {
  return (
    <For each={new Array(50).fill(0)}>
      {it => (
        <Skeleton {...stylex.attrs(style.file)} />
      )}
    </For>
  )
}