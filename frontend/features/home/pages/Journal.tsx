import { createResource, For, Show } from "solid-js"
import { MdOutlineFilter_list_off } from 'solid-icons/md'
import { CLS } from "macro-def"
// ...
import { GetGroups } from "~/wailsjs/go/group/Exports"
import { PlaceholderView, Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { CreateJournalButton, JournalBlock, TagListButton, TotalJournalText } from "../components"
import { JournalHomeProvider } from "../provider/JournalHomeProvider"

const style = stylex.create({
  section: {
    overflowY: "auto",
    height: "100%",
    width: "100%",
    position: "relative"
  },
  section__header: {
    paddingInline: 10,
    paddingBlock: 5,
    display: "flex",
    gap: 10,
    marginBottom: 15,
    userSelect: "none"
  },
  section__list: {
    height: "80vh",
  },
  section__emptyJournalView: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1
  },
})

export default function Journal() {
  const [resource] = createResource(async () => {
    return await GetGroups()
  })

  return (
    <JournalHomeProvider groups$={resource() ?? []}>
      <main {...stylex.attrs(style.section)} id="journalHome__mainContent">
        <h1>Jour journal</h1>
        <header {...stylex.attrs(style.section__header)}>
          <CreateJournalButton />
          <TagListButton />
          <Spacer />
          <TotalJournalText />
        </header>
        <Show when={!resource.loading}>
          <Show when={resource()!.length == 0} fallback={
            <div class={`${CLS(style.section__list)} scrollbar scrollbarVertical`}>
              <For each={resource()}>
                {it => <JournalBlock {...it} />}
              </For>
            </div>
          }>
            <PlaceholderView 
              icons$={<MdOutlineFilter_list_off size="4.5rem" />}
              {...stylex.attrs(style.section__emptyJournalView)}
            >
              No journal here, try creating a new journal.
            </PlaceholderView>
          </Show>
        </Show>
      </main>
    </JournalHomeProvider>
  )
}