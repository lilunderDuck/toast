import { onMount } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { useNodeState } from "../../utils"
import type { TagAttribute } from "./extension"

const style = stylex.create({
  tag: {
    fontSize: 14,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    position: "relative",
    color: "var(--color)",
    "::before": {
      content: '',
      position: "absolute",
      backgroundColor: "var(--color)",
      zIndex: -1,
      paddingBlock: 1,
      paddingInline: 5,
      borderRadius: 6,
      filter: "brightness(0.45)",
      width: "100%",
      height: "100%"
    }
  },
  tagContent: {
    ":focus": {
      outline: "none"
    }
  }
})

export default function TagNodeView() {
  const { data$ } = useNodeState<TagAttribute>()
  let tagRef!: Ref<"span">

  onMount(() => {
    tagRef.focus()
  })

  return (
    <NodeViewWrapper 
      as="span" 
      style={{
        "--color": data$().color
      }}
      {...stylex.attrs(style.tag)}
    >
      #<span contentEditable={true} ref={tagRef} {...stylex.attrs(style.tagContent)}>{data$().name}</span>
    </NodeViewWrapper>
  )
}