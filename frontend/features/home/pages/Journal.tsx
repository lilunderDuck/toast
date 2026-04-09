import { createResource, For, Show } from "solid-js"
// ...
import { GetGroups } from "~/wailsjs/go/group/Exports"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Journal.module.css"
// ...
import { CreateJournalButton, JournalBlock, JournalListHeader } from "../components"
import { JournalHomeProvider } from "../provider/JournalHomeProvider"
import { AppTitleBarDraggable } from "~/components"

const style = stylex.create({
  section: {
    padding: 10,
    overflowY: "auto",
    height: "100%",
    width: "100%",
  },
  section__list: {
    gap: 10,
    flexWrap: "wrap",
    display: "flex"
  },
  section__titleBar: {
    width: "100%",
    position: "fixed",
    top: 0
  }
})

export default function Journal() {
  const [resource] = createResource(async () => {
    return await GetGroups()
  })

  return (
    <JournalHomeProvider groups$={resource() ?? []}>
      <main {...stylex.attrs(style.section)}>
        <AppTitleBarDraggable {...stylex.attrs(style.section__titleBar)} />
        <JournalListHeader name$="Your journal" />
        <Show when={!resource.loading}>
          <div {...stylex.attrs(style.section__list)} id={__style.list}>
            <For each={resource()}>
              {it => <JournalBlock {...it} />}
            </For>
            <CreateJournalButton />
          </div>
        </Show>
      </main>
    </JournalHomeProvider>
  )
}