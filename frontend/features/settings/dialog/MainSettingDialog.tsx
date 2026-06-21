import { createSignal, For, Match, Switch } from "solid-js"
// ...
import { DialogContent } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"
// ...
import { css } from "molcss"
import "./MainSettingDialog.css"
import "~/styles/scrollbar.css"
// ...
import { SettingSidebarItem } from "../components/SettingSidebarItem"
import { PAGE_COMPONENT, PAGE_SIDEBAR } from "./pages"

const dialog = css`
  width: 90%;
  height: calc(100% - 10rem);
  padding: 0 !important;
`

const dialog__content = css`
  width: 100%;
  height: 100%;
  display: flex;
`

const dialog__sidebar = css`
  width: 15em;
  flex-shrink: 0;
  padding-inline: 5px;
  padding-block: 10px;
`

const dialog__mainContent = css`
  width: 100%;
  height: 100%;
  background-color: var(--base);
  padding-inline: 15px;
  padding-top: 10px;
  padding-bottom: 5rem;
`

interface IMainSettingDialog extends IBaseLazyComponent {}

export default function MainSettingDialog(props: IMainSettingDialog) {
  // a few asserts to make sure the setting doesn't randomly break
  console.assert(PAGE_SIDEBAR.length > 0, "No items on the sidebar.")
  console.assert(PAGE_SIDEBAR[0].items$.length > 0, "Empty sub content.")
  console.assert(PAGE_SIDEBAR[0].items$[0].pageId$ !== "", "The first page id is a empty string")

  const [currentPage, setCurrentPage] = createSignal(
    PAGE_SIDEBAR[0].items$[0].pageId$
  )

  return (
    <DialogContent class={dialog}>
      <div class={dialog__content}>
        <aside class={`${dialog__sidebar} scrollbar scrollbarVertical invsScrollbar`}>
          <For each={PAGE_SIDEBAR}>
            {it => (
              <SettingSidebarItem 
                {...it} 
                onClick$={(item) => setCurrentPage(item.pageId$)} 
                isCurrentPage$={(item) => item.pageId$ === currentPage()}
              />
            )}
          </For>
        </aside>
        <main
          class={`${dialog__mainContent} scrollbar scrollbarVertical invsScrollbar`}
          id="mainContent"
        >
          <Switch>
            <For each={PAGE_COMPONENT}>
              {([pageId, PageComponent]) => (
                <Match when={currentPage() === pageId}>
                  <PageComponent />
                </Match>
              )}
            </For>
          </Switch>
        </main>
      </div>
    </DialogContent>
  )
}