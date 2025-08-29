import { A } from "@solidjs/router"
// ...
import { LibraryUsedList } from "~/features/misc"
import { AppTitleBarDraggable } from "~/components"
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  page: {
    paddingInline: 15,
    paddingBlock: 10
  },
  page__titleBar: {
    position: "fixed",
    top: 0,
    left: 0
  },
})

export default function Technical() {
  return (
    <>
      <AppTitleBarDraggable {...stylex.attrs(style.page__titleBar)} />
      <main {...stylex.attrs(style.page)}>
        <h2>Technical stuff</h2>
        <p>A place for nerdy, curious people like you and me. <A href="/">Go back?</A></p>
        <LibraryUsedList />
      </main>
    </>
  )
}