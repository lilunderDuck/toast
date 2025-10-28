import { createResource, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { AppTitleBarDraggable } from "~/components"
import { JournalHomeProvider, JournalListSection } from "~/features/home"
// ...
import { GetGroups } from "~/wailsjs/go/group/Exports"

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
  const [resource] = createResource(async () => {
    return await GetGroups()
  })

  return (
    <>
      <AppTitleBarDraggable {...stylex.attrs(style.home__titleBar)} />
      <Show when={!resource.loading}>
        {void console.log(resource())}
        <JournalHomeProvider groups$={resource() ?? []}>
          <JournalListSection />
        </JournalHomeProvider>
      </Show>
    </>
  )
}
