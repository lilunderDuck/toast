import { createToggableInput } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Input, Tooltip } from "~/components"
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
        <h2 {...props} {...stylex.attrs(style.title__heading)}>
          <Tooltip label$="Click to change table title">
            {titleDisplay()}
          </Tooltip>
        </h2>
      )
    },
    label$: title$.get$,
    onFinalize$(newContent) {
      title$.set$(newContent)
    },
    onDiscard$() {}
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