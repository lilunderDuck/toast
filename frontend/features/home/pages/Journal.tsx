import { createResource, For, Show } from "solid-js"
import { MdOutlineFilter_list_off } from 'solid-icons/md'
// ...
import { GetGroups } from "~/wailsjs/go/group/Exports"
import { PlaceholderView, Spacer } from "~/components"
// ...
import { css } from "molcss"
import "../core/JournalHomeRoot.css"
import "~/styles/scrollbar.css"
// ...
import { CreateJournalButton, JournalBlock, TagListButton, TotalJournalText } from "../components"
import { JournalHomeProvider } from "../provider/JournalHomeProvider"

const section = css`
  overflow-y: auto;
  height: 100%;
  width: 100%;
  position: relative;
`

const section__header = css`
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  user-select: none;
`

const section__list = css`
  height: 80vh;
`

const section__emptyJournalView = css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

export default function Journal() {
  const [resource] = createResource(async () => {
    return await GetGroups()
  })

  return (
    <JournalHomeProvider groups$={resource() ?? []}>
      <main class={`${section} journalHome__mainContent`}>
        <h1>Jour journal</h1>
        <header class={section__header}>
          <CreateJournalButton />
          <TagListButton />
          <Spacer />
          <TotalJournalText />
        </header>
        <Show when={!resource.loading}>
          <Show when={resource()!.length == 0} fallback={
            <div class={`${section__list} scrollbar scrollbarVertical`}>
              <For each={resource()}>
                {/* @ts-ignore */}
                {it => <JournalBlock {...it} />}
              </For>
            </div>
          }>
            <PlaceholderView 
              icons$={<MdOutlineFilter_list_off size="4.5rem" />}
              class={section__emptyJournalView}
            >
              No journal here, try creating a new journal.
            </PlaceholderView>
          </Show>
        </Show>
      </main>
    </JournalHomeProvider>
  )
}