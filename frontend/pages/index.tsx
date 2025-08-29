import stylex from "@stylexjs/stylex"
import { AppTitleBarDraggable } from "~/components"
// ...
import { JournalHomeProvider, JournalList, JournalListHeader } from "~/features/home"

const style = stylex.create({
  home: {
    paddingInline: "2rem",
    paddingTop: "1rem",
    overflowY: "auto",
    height: "100%"
  },
  home__titleBar: {
    position: "fixed",
    top: 0,
    left: 0
  },
})

export default function Home() {
  return (
    <JournalHomeProvider>
      <AppTitleBarDraggable {...stylex.attrs(style.home__titleBar)} />
      <section {...stylex.attrs(style.home)}>
        <JournalListHeader name$="Your journal" />
        <JournalList />
      </section>
    </JournalHomeProvider>
  )
}
