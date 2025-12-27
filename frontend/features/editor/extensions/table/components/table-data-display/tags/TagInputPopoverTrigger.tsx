import { For } from "solid-js";
import { PopoverTrigger, Tag } from "~/components";
import { useTagInputContext } from "./TagInputProvider";
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

export default function TagInputPopoverTrigger() {
  const { selectedOptions$ } = useTagInputContext()

  return (
    <PopoverTrigger as="div" {...stylex.attrs(style.tagInput__display)}>
      <For each={selectedOptions$()} fallback={
        <span {...stylex.attrs(style.tagInput__placeholder)}>Click to select</span>
      }>
        {it => (
          <Tag color$={it.color}>
            {it.name}
          </Tag>
        )}
      </For>
    </PopoverTrigger>
  )
}