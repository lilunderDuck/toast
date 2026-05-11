import { createResource, For, Show } from "solid-js"
import { MdOutlineFilter_list_off } from 'solid-icons/md'
// ...
import { GetGroups } from "~/wailsjs/go/group/Exports"
import { Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { CreateJournalButton, JournalBlock, JournalListHeader, TagListButton, TotalJournalText } from "../components"
import { JournalHomeProvider } from "../provider/JournalHomeProvider"

const style = stylex.create({
  section: {
    padding: 10,
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
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 10,
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1
  },
  section__emptyJournalViewContent: {
    textAlign: "center"
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
          <TagListButton />
          <Spacer />
          <TotalJournalText />
        </header>
        <Show when={!resource.loading}>
          <Show when={resource()!.length == 0} fallback={
            <div class={`${stylex.attrs(style.section__list).class} scrollbar scrollbarVertical`}>
              <For each={resource()}>
                {it => <JournalBlock {...it} />}
              </For>
            </div>
          }>
            <div {...stylex.attrs(style.section__emptyJournalView)}>
              <span>
                <MdOutlineFilter_list_off size="4.5rem" />
              </span>
              <span>No journal here, try creating a new journal.</span>
            </div>
          </Show>
        </Show>
      </main>
    </JournalHomeProvider>
  )
}