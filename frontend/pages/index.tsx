import stylex from "@stylexjs/stylex"
import { AppTitleBarButton, AppTitleBarDraggable, Spacer } from "~/components"
// ...
import { JournalHomeProvider, JournalList } from "~/features/home"
import { shorthands } from "~/styles/shorthands"

const style = stylex.create({
  home: {
    paddingInline: "2rem",
    paddingTop: "1rem",
    overflowY: "auto"
  },
  home__titleBar: {
    position: "fixed",
    top: 0,
    left: 0
  }
})

export default function Home() {
  return (
    <JournalHomeProvider>
      <AppTitleBarDraggable {...stylex.attrs(style.home__titleBar)}>
        <Spacer />
        <AppTitleBarButton />
      </AppTitleBarDraggable>
      <section {...stylex.attrs(style.home, shorthands.h_full$)}>
        <h1>Your journals</h1>
        <JournalList />
      </section>
    </JournalHomeProvider>
  )
}
