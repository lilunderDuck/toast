import { createResource, For, Show } from "solid-js"
// ...
import { GetGroups } from "~/wailsjs/go/group/Exports"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { CreateJournalButton, JournalBlock, JournalListHeader } from "../components"
import { JournalHomeProvider } from "../provider/JournalHomeProvider"

const style = stylex.create({
  section: {
    padding: 10,
    overflowY: "auto",
    height: "100%",
    width: "100%",
  },
  section__header: {
    paddingInline: 10,
    paddingBlock: 5,
    display: "flex",
    gap: 10,
    marginBottom: 15
  },
  section__list: {
    height: "80vh",
  }
})

export default function Journal() {
  const [resource] = createResource(async () => {
    return await GetGroups()
  })

  return (
    <JournalHomeProvider groups$={resource() ?? []}>
      <main {...stylex.attrs(style.section)}>
        <JournalListHeader name$="Your journal" />
        <header {...stylex.attrs(style.section__header)}>
          <CreateJournalButton />
        </header>
        <Show when={!resource.loading}>
          <div class={`${stylex.attrs(style.section__list).class} scrollbar scrollbarVertical`}>
            <For each={resource()}>
              {it => <JournalBlock {...it} />}
            </For>
          </div>
        </Show>
      </main>
    </JournalHomeProvider>
  )
}