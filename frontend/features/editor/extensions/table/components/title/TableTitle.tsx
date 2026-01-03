import { createToggableInput } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Input } from "~/components"
import { EditorTooltip } from "~/features/editor/components"
import { useEditorContext } from "~/features/editor/provider"
// ...
import { useTablesDataContext } from "../../provider"
import { TableTabList } from "./TableTabList"

const style = stylex.create({
  title: {
    width: "100%",
    paddingBlock: 5
  },
  title__headingWrap: {
    marginBottom: 8
  },
  title__heading: {
    width: "fit-content",
    userSelect: "none",
    cursor: "pointer"
  },
  title__display: {
    width: "100%"
  }
})

export function TableTitle() {
  const { title$ } = useTablesDataContext()
  const { isReadonly$ } = useEditorContext()

  let inputRef!: Ref<"input">

  const { Input$ } = createToggableInput({
    component$: {
      Input$: (props) => (
        <Input
          {...props}
          placeholder={titleDisplay()}
          ref={inputRef}
        />
      ),
      Readonly$: (props) => (
        <EditorTooltip label$="Click to change table title">
          <h2 {...props} {...stylex.attrs(style.title__heading)}>
            {titleDisplay()}
          </h2>
        </EditorTooltip>
      )
    },
    readonly$: isReadonly$,
    label$: title$.get$,
    onFinalize$(newContent) {
      title$.set$(newContent)
    },
  })

  const titleDisplay = () => title$.get$() === "" ? "Untitled" : title$.get$()

  return (
    <section {...stylex.attrs(style.title)}>
      <div {...stylex.attrs(style.title__headingWrap)}>
        <Input$ />
      </div>
      <TableTabList />
    </section>
  )
}