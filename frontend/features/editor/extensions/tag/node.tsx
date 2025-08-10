import { onMount } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
// ...
import { NodeViewWrapper } from "~/libs/solid-tiptap-renderer"
// ...
import { useNodeState } from "../../utils"
import { TagAttribute } from "./extension"

const style = stylex.create({
  tag: {
    fontSize: 14,
    borderRadius: 6,
    // paddingInline: 5,
    // paddingBlock: 1,
    position: "relative",
    color: "var(--color)",
    "::before": {
      content: '',
      position: "absolute",
      backgroundColor: "var(--color)",
      // opacity: 0.75,
      zIndex: -1,
      paddingBlock: 1,
      paddingInline: 5,
      borderRadius: 6,
      filter: "brightness(0.45)",
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
      {...stylex.attrs(style.tag, shorthands.wh_full_before$, shorthands.flex_y_center$)}
    >
      #<span contentEditable={true} ref={tagRef} {...stylex.attrs(style.tagContent)}>{data$().name}</span>
    </NodeViewWrapper>
  )
}