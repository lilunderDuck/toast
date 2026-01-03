import { For } from "solid-js";
import { useTagInputContext } from "./TagInputProvider";
import { EditorEditModeOnly } from "~/features/editor/components";
import { Tag } from "~/components";
import stylex from "@stylexjs/stylex";

const style = stylex.create({
  tagInput__display: {
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  tagInput__placeholder: {
    color: "var(--gray10)"
  }
})

export function TagInputDisplay() {
  const { selectedOptions$ } = useTagInputContext()
  
  return (
    <For each={selectedOptions$()} fallback={
      <EditorEditModeOnly>
        <span {...stylex.attrs(style.tagInput__placeholder)}>
          Click to select
        </span>
      </EditorEditModeOnly>
    }>
      {it => (
        <Tag color$={it.color}>
          {it.name}
        </Tag>
      )}
    </For>
  )
}